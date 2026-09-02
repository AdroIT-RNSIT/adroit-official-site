import os
from fastapi import FastAPI, HTTPException, Body, File, UploadFile, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from rag_service import RAGService
from ingest import ingest_docs
import hashlib
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import base64
import random
import string
from typing import List

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== SUPABASE CLIENT =====
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  # Use service_role key for backend

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ ERROR: SUPABASE_URL and SUPABASE_KEY must be set in .env")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Encryption
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
if not ENCRYPTION_KEY:
    print("❌ ERROR: ENCRYPTION_KEY not set in .env file")
    print("   Set ENCRYPTION_KEY to a 64-character hex string")
    exit(1)

# Initialize RAG Service (Global system instance)
try:
    rag_bot = RAGService()
    print("✅ RAG Service initialized.")
except Exception as e:
    print(f"❌ Failed to initialize RAG Service: {e}")
    rag_bot = None

# Models
class ChatRequest(BaseModel):
    message: str
    userId: str | None = None

class ApiKeyRequest(BaseModel):
    userId: str
    apiKey: str

class RegistrationParticipant(BaseModel):
    name: str
    usn: str

class RegistrationRequest(BaseModel):
    eventName: str
    teamName: str
    collegeName: str
    leaderEmail: str
    leaderUSN: str | None = None
    participants: List[RegistrationParticipant]

# ===== ENCRYPTION / DECRYPTION =====
def decrypt_api_key(encrypted_data, encryption_key):
    """
    Decrypt API key using AES-256-GCM
    Format: iv.authTag.encrypted (all hex encoded)
    """
    try:
        parts = encrypted_data.split(".")
        if len(parts) != 3:
            return None

        iv_hex, auth_tag_hex, encrypted_hex = parts
        iv = bytes.fromhex(iv_hex)
        auth_tag = bytes.fromhex(auth_tag_hex)
        encrypted = bytes.fromhex(encrypted_hex)

        cipher = AES.new(
            bytes.fromhex(encryption_key),
            AES.MODE_GCM,
            nonce=iv
        )
        cipher.update(auth_tag)

        decrypted = cipher.decrypt_and_verify(encrypted, auth_tag)
        return decrypted.decode("utf-8")
    except Exception as e:
        print(f"❌ Error decrypting API key: {e}")
        return None

def get_user_api_key(user_id):
    """Fetch and decrypt user's API key from Supabase"""
    try:
        result = supabase.table("users").select("gemini_api_key").eq("id", user_id).single().execute()
        user = result.data
        if not user or not user.get("gemini_api_key"):
            return None

        encryption_key = os.getenv("ENCRYPTION_KEY")
        if not encryption_key:
            print("⚠️ ENCRYPTION_KEY not set")
            return None

        return decrypt_api_key(user["gemini_api_key"], encryption_key)
    except Exception as e:
        print(f"❌ Error fetching user API key: {e}")
        return None

def get_user_approved_status(user_id):
    """Fetch user's approval status from Supabase"""
    if not user_id:
        return False
    try:
        result = supabase.table("users").select("approved").eq("id", user_id).single().execute()
        user = result.data
        if not user:
            print(f"   ⚠️ User not found with ID: {user_id}")
            return False
        approved = user.get("approved", False)
        print(f"   ✅ User found - Approved: {approved}")
        return approved
    except Exception as e:
        print(f"   ❌ Error fetching user approval status: {e}")
        return False

@app.get("/")
def home():
    return {"status": "AI Service Running"}

@app.post("/chat")
async def chat(request: ChatRequest):
    user_msg = request.message
    user_id = request.userId

    if not rag_bot:
        return {"response": "System AI is currently unavailable.", "mode": "error"}

    user_api_key = None
    user_approved = False

    if user_id:
        user_api_key = get_user_api_key(user_id)
        user_approved = get_user_approved_status(user_id)

    rag_response = rag_bot.ask(user_msg, user_id=user_id, user_api_key=user_api_key, user_approved=user_approved)

    if isinstance(rag_response, str):
        return {"response": rag_response, "mode": "error"}

    if rag_response["source"] == "user_rag":
        response_data = {"response": rag_response["answer"], "mode": "personalized_rag"}
        print(f"📤 Sending to Frontend: {response_data}")
        return response_data

    if rag_response["source"] == "empty_user_rag":
        return {"response": rag_response["answer"], "mode": "system_msg"}

    if user_id and rag_response["source"] == "global_rag":
        user_api_key = get_user_api_key(user_id)
        if user_api_key:
            try:
                user_llm = ChatGoogleGenerativeAI(
                    model="gemini-2.5-flash",
                    google_api_key=user_api_key
                )
                print(f"✅ Using user's personal API key for {user_id}")
                return {"response": rag_response["answer"], "mode": "rag_with_user_key"}
            except Exception as e:
                print(f"⚠️ Error with user's API key: {e}")

    return {"response": rag_response["answer"], "mode": "rag"}

@app.post("/user/apikey")
async def save_api_key(request: ApiKeyRequest):
    try:
        encrypted_key = Fernet(ENCRYPTION_KEY.encode()).encrypt(request.apiKey.encode()).decode()

        result = supabase.table("users").update({
            "gemini_api_key": encrypted_key,
            "has_api_key": True
        }).eq("id", request.userId).execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")

        return {"status": "success", "message": "API Key saved securely."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/user/upload")
async def upload_file(
    userId: str = Body(...),
    file: UploadFile = File(...)
):
    try:
        user_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "users", userId)
        docs_dir = os.path.join(user_dir, "docs")
        os.makedirs(docs_dir, exist_ok=True)

        file_path = os.path.join(docs_dir, file.filename)

        with open(file_path, "wb") as buffer:
            import shutil
            shutil.copyfileobj(file.file, buffer)

        from user_ingest import ingest_user_docs
        ingest_user_docs(userId)

        return {"status": "success", "message": f"File '{file.filename}' uploaded and indexed."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ingest")
async def trigger_ingest(background_tasks: BackgroundTasks):
    try:
        def ingest_in_background():
            print("🔄 Starting ingestion in background...")
            ingest_docs()
            print("✅ Ingestion completed. Reloading RAG service...")
            global rag_bot
            try:
                rag_bot = RAGService()
                print("✅ RAG service reloaded with new index")
            except Exception as e:
                print(f"❌ Error reloading RAG service: {e}")

        background_tasks.add_task(ingest_in_background)
        return {"status": "ingestion_started", "message": "Documents are being indexed. This may take a moment."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/register")
async def register_event(request: RegistrationRequest):
    try:
        random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        reg_id = f"ADR-{random_suffix}"

        # Build flat participants list for Supabase (stored as JSONB)
        registration_data = {
            "registration_id": reg_id,
            "event_name": request.eventName,
            "team_name": request.teamName,
            "college_name": request.collegeName,
            "leader_email": request.leaderEmail,
            "leader_usn": request.leaderUSN,
            "participants": [p.dict() for p in request.participants],
        }

        result = supabase.table("registrations").insert(registration_data).execute()

        if result.data:
            return {"status": "success", "registrationId": reg_id}
        else:
            raise HTTPException(status_code=500, detail="Failed to save registration")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)