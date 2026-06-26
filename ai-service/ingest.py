import os
import sys

# Ensure langchain-text-splitters is installed
try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
except ImportError:
    try:
        from langchain.text_splitter import RecursiveCharacterTextSplitter
    except ImportError:
        print("❌ 'langchain-text-splitters' not found. Please install it: pip install langchain-text-splitters")
        sys.exit(1)

from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from pymongo import MongoClient

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load environment variables
load_dotenv(os.path.join(BASE_DIR, ".env"))

DOCS_DIR = os.path.join(BASE_DIR, "data/docs")
GLOBAL_INDEX_DIR = os.path.join(BASE_DIR, "faiss_index")  # Markdown docs only
RESOURCES_INDEX_DIR = os.path.join(BASE_DIR, "faiss_index_resources")  # MongoDB resources only
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/club-members")

def get_mongodb_resources():
    """Fetch all resources from MongoDB and convert to LangChain Documents."""
    try:
        client = MongoClient(MONGO_URI)
        db = client.get_database()
        resources_collection = db.resources
        
        resources = list(resources_collection.find({}))
        documents = []
        
        for resource in resources:
            # Create a formatted document from each resource
            title = resource.get("title", "Untitled")
            description = resource.get("description", "")
            resource_type = resource.get("type", "")
            domain = resource.get("domain", "")
            difficulty = resource.get("difficulty", "")
            url = resource.get("url", "")
            tags = ", ".join(resource.get("tags", []))
            
            content = f"""
Title: {title}
Type: {resource_type}
Domain: {domain}
Difficulty: {difficulty}
URL: {url}
Tags: {tags}

Description:
{description}
"""
            
            # Create LangChain Document
            doc = Document(
                page_content=content,
                metadata={
                    "source": "mongodb_resource",
                    "resource_id": str(resource.get("_id")),
                    "title": title,
                    "domain": domain,
                    "type": resource_type,
                    "url": url
                }
            )
            documents.append(doc)
        
        client.close()
        return documents
    except Exception as e:
        print(f"❌ Error fetching MongoDB resources: {e}")
        return []

def ingest_docs():
    # Only verify API key for chat later, not needed for ingestion with local embeddings
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "CHANGE_ME_TO_YOUR_GEMINI_API_KEY":
        print("⚠️  Warning: GEMINI_API_KEY not set properly. Chat features might fail later, but ingestion will proceed.")

    print("📚 Loading documents...")
    
    # Load Markdown documents from data/docs (GLOBAL - for everyone)
    md_documents = []
    try:
        loader = DirectoryLoader(DOCS_DIR, glob="**/*.md", loader_cls=TextLoader)
        md_documents = loader.load()
        print(f"   Loaded {len(md_documents)} markdown documents from data/docs.")
    except Exception as e:
        print(f"⚠️  Warning: Could not load markdown documents: {e}")

    # Load resources from MongoDB (MEMBERS ONLY)
    mongo_documents = get_mongodb_resources()
    print(f"   Loaded {len(mongo_documents)} resources from MongoDB.")

    # Create GLOBAL index (markdown docs only - PUBLIC)
    if md_documents:
        print("\n🌐 Creating GLOBAL index (markdown docs only - for all users)...")
        print("✂️  Splitting text...")
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        md_texts = text_splitter.split_documents(md_documents)
        print(f"   Split into {len(md_texts)} chunks.")

        print("🧠 Creating embeddings & Indexing (using local model)...")
        try:
            embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
            vectorstore = FAISS.from_documents(md_texts, embeddings)
            print(f"💾 Saving global index to {GLOBAL_INDEX_DIR}...")
            vectorstore.save_local(GLOBAL_INDEX_DIR)
            print("✅ Global index created!")
        except Exception as e:
            print(f"❌ Failed to create global index: {e}")
            return
    else:
        print("⚠️  No markdown documents found. Skipping global index creation.")

    # Create RESOURCES index (MongoDB resources only - MEMBERS ONLY)
    if mongo_documents:
        print("\n👥 Creating RESOURCES index (MongoDB resources only - for members)...")
        print("✂️  Splitting text...")
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
        resource_texts = text_splitter.split_documents(mongo_documents)
        print(f"   Split into {len(resource_texts)} chunks.")

        print("🧠 Creating embeddings & Indexing (using local model)...")
        try:
            embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
            vectorstore = FAISS.from_documents(resource_texts, embeddings)
            print(f"💾 Saving resources index to {RESOURCES_INDEX_DIR}...")
            vectorstore.save_local(RESOURCES_INDEX_DIR)
            print("✅ Resources index created!")
        except Exception as e:
            print(f"❌ Failed to create resources index: {e}")
            return
    else:
        print("⚠️  No resources found. Skipping resources index creation.")

    print("\n✅ Ingestion complete!")


if __name__ == "__main__":
    ingest_docs()

