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
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load environment variables
load_dotenv(os.path.join(BASE_DIR, ".env"))

DOCS_DIR = os.path.join(BASE_DIR, "data/docs")
INDEX_DIR = os.path.join(BASE_DIR, "faiss_index")
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

def ingest_docs():
    # Only verify API key for chat later, not needed for ingestion with local embeddings
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "CHANGE_ME_TO_YOUR_GEMINI_API_KEY":
        print("⚠️  Warning: GEMINI_API_KEY not set properly. Chat features might fail later, but ingestion will proceed.")

    print("📚 Loading documents...")
    try:
        loader = DirectoryLoader(DOCS_DIR, glob="**/*.md", loader_cls=TextLoader)
        documents = loader.load()
    except Exception as e:
        print(f"❌ Failed to load documents: {e}")
        return

    if not documents:
        print("⚠️  No documents found in data/docs. Skipping ingestion.")
        return

    print(f"   Loaded {len(documents)} documents.")

    print("✂️  Splitting text...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    texts = text_splitter.split_documents(documents)
    print(f"   Split into {len(texts)} chunks.")

    print("🧠 Creating embeddings & Indexing (using local model)...")
    try:
        # Use local embeddings
        embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
        vectorstore = FAISS.from_documents(texts, embeddings)
    except Exception as e:
        print(f"❌ Failed to create embeddings: {e}")
        return

    print(f"💾 Saving index to {INDEX_DIR}...")
    vectorstore.save_local(INDEX_DIR)
    print("✅ Ingestion complete!")

if __name__ == "__main__":
    ingest_docs()
