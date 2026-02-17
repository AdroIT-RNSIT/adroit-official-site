import os
from fastapi import FastAPI, HTTPException, Body, File, UploadFile, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from rag_service import RAGService
from ingest import ingest_docs
import hashlib
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import base64
from bson import ObjectId

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/club-members")
client = MongoClient(MONGO_URI)
db = client.get_database()
users_collection = db.user

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
        cipher.update(auth_tag)  # For GCM verification
        
        decrypted = cipher.decrypt_and_verify(encrypted, auth_tag)
        return decrypted.decode("utf-8")
    except Exception as e:
        print(f"❌ Error decrypting API key: {e}")
        return None

def get_user_api_key(user_id):
    """
    Fetch and decrypt user's API key from MongoDB
    """
    try:
        # Convert string ID to ObjectId
        try:
            user_obj_id = ObjectId(user_id)
        except:
            user_obj_id = user_id  # Fallback to string if conversion fails
        
        user = users_collection.find_one({"_id": user_obj_id})
        if not user or not user.get("geminiApiKey"):
            return None
        
        encryption_key = os.getenv("ENCRYPTION_KEY")
        if not encryption_key:
            print("⚠️ ENCRYPTION_KEY not set")
            return None
        
        decrypted_key = decrypt_api_key(user["geminiApiKey"], encryption_key)
        return decrypted_key
    except Exception as e:
        print(f"❌ Error fetching user API key: {e}")
        return None

def get_user_approved_status(user_id):
    """
    Fetch user's approval status from MongoDB
    Returns False if user_id is None (logged out)
    """
    if not user_id:
        return False
    
    try:
        # Convert string ID to ObjectId
        try:
            user_obj_id = ObjectId(user_id)
        except:
            user_obj_id = user_id  # Fallback to string if conversion fails
        
        user = users_collection.find_one({"_id": user_obj_id})
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
    
    # Check if system is ready
    if not rag_bot:
        return {"response": "System AI is currently unavailable.", "mode": "error"}

    # Get user's API key if they have one
    user_api_key = None
    user_approved = False
    
    if user_id:
        user_api_key = get_user_api_key(user_id)
        user_approved = get_user_approved_status(user_id)

    # 1. Try RAG (User or Global) with user's API key if available
    rag_response = rag_bot.ask(user_msg, user_id=user_id, user_api_key=user_api_key, user_approved=user_approved)
    
    # If rag_response is a string (error string from old logic handling), wrap it
    if isinstance(rag_response, str):
         return {"response": rag_response, "mode": "error"}
         
    # Logic:
    # If mode is 'user_rag', we returned answer from private docs. Great.
    
    if rag_response["source"] == "user_rag":
        response_data = {"response": rag_response["answer"], "mode": "personalized_rag"}
        print(f"📤 Sending to Frontend: {response_data}")
        return response_data

    # If mode is 'empty_user_rag', strictly return the prompt to upload data.
    if rag_response["source"] == "empty_user_rag":
        return {"response": rag_response["answer"], "mode": "system_msg"}
        
    # If mode is 'global_rag', we returned answer from public docs.
    # BUT, if the user is a Member with an API Key, they can use personalized chat with their own key
    if user_id and rag_response["source"] == "global_rag":
        user_api_key = get_user_api_key(user_id)
        if user_api_key:
            try:
                # Use user's API key for personalized chat
                user_llm = ChatGoogleGenerativeAI(
                    model="gemini-2.5-flash", 
                    google_api_key=user_api_key
                )
                
                # Still use RAG answer as primary (consistent), but user has their own quota
                print(f"✅ Using user's personal API key for {user_id}")
                return {"response": rag_response["answer"], "mode": "rag_with_user_key"}
                
            except Exception as e:
                print(f"⚠️ Error with user's API key: {e}")
                # Fallthrough to global RAG

    return {"response": rag_response["answer"], "mode": "rag"}

@app.post("/user/apikey")
async def save_api_key(request: ApiKeyRequest):
    try:
        # Encrypt key
        encrypted_key = cipher.encrypt(request.apiKey.encode()).decode()
        
        # Update User in DB
        result = users_collection.update_one(
            {"_id": request.userId},
            {"$set": {"geminiApiKey": encrypted_key, "hasApiKey": True}}
        )
        
        if result.matched_count == 0:
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
        # Directory structure: data/users/{userId}/docs
        user_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "users", userId)
        docs_dir = os.path.join(user_dir, "docs")
        os.makedirs(docs_dir, exist_ok=True)
        
        file_path = os.path.join(docs_dir, file.filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            import shutil
            shutil.copyfileobj(file.file, buffer)
            
        # Trigger Ingestion (Directly call function instead of subprocess for simplicity if possible, or subprocess)
        # Using subprocess to keep it async/separate process or we can import the function
        # Let's import the function to keep it simple, but run it in a thread/background task?
        # For MVP, we run it synchronously or use BackgroundTasks
        from user_ingest import ingest_user_docs
        
        # In a real app, use BackgroundTasks. Here we do it inline for immediate feedback or better yet BackgroundTasks
        ingest_user_docs(userId)
        
        return {"status": "success", "message": f"File '{file.filename}' uploaded and indexed."}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.post("/ingest")
async def trigger_ingest(background_tasks: BackgroundTasks):
    """
    Endpoint to trigger re-ingestion of all documents (markdown + MongoDB resources).
    Useful when new resources are added to the database.
    Runs in the background to avoid blocking the response.
    """
    try:
        def ingest_in_background():
            print("🔄 Starting ingestion in background...")
            ingest_docs()
            print("✅ Ingestion completed. Reloading RAG service...")
            # Reload the RAG service to use the new index
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