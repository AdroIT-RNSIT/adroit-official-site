import os
from fastapi import FastAPI, HTTPException, Body, File, UploadFile, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from rag_service import RAGService

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
    # Generate a key if not provided (for dev convenience, but should be static in prod)
    print("⚠️ WARNING: ENCRYPTION_KEY not set. Generating a temporary one.")
    ENCRYPTION_KEY = Fernet.generate_key().decode()

cipher = Fernet(ENCRYPTION_KEY.encode())

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

    # 1. Try RAG (User or Global)
    # We pass user_id so RAGService can check for private index
    rag_response = rag_bot.ask(user_msg, user_id=user_id)
    
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
    # BUT, if the user is a Member with an API Key (Phase 8 feature), maybe they prefer the "Personalized Chat" 
    # (which uses their key and acts as a generic assistant) over the "Global RAG" (which is strict documentation).
    # ...
    if user_id:
        user = users_collection.find_one({"_id": user_id})
        if user and user.get("geminiApiKey"):
            try:
                # Decrypt User Key
                encrypted_key = user["geminiApiKey"]
                user_api_key = cipher.decrypt(encrypted_key.encode()).decode()
                
                # Personalized Generic Chat (Phase 8)
                # Note: This ignores the RAG answer. 
                # If the user asks "What is AdroIT?", Global RAG is better.
                # If they ask "Write me a poem", Personalized Chat is better.
                # Hard to decide. For now, let's return the RAG answer but maybe enhance it?
                # Simpler: If Global RAG returned "I don't know", fallback to Personalized?
                # Or just stick to RAG as the primary "AI Service" feature.
                
                # Let's stick to RAG to be consistent. 
                # Retaining Phase 8 logic strictly:
                # Phase 8: If Member -> Personalized Chat.
                # Phase 9: If Member upload -> User RAG.
                
                # Hybrid approach:
                # If User RAG -> Return it.
                # Else -> Run Personalized Chat (Phase 8).
                
                llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=user_api_key)
                response = llm.invoke(f"You are a helpful assistant for {user.get('name', 'User')}. {user_msg}")
                return {"response": response.content, "mode": "personalized"}
                
            except Exception as e:
                print(f"Error in personalized chat: {e}")
                # Fallthrough to RAG
                pass

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
