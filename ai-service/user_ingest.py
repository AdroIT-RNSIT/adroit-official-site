import os
import sys
from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader, TextLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# Load environment variables
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

# Configuration
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

def ingest_user_docs(user_id: str):
    """
    Ingests documents for a specific user from `data/users/<user_id>/docs`
    and saves the index to `data/users/<user_id>/faiss_index`.
    """
    user_data_dir = os.path.join(BASE_DIR, "data/users", user_id)
    docs_dir = os.path.join(user_data_dir, "docs")
    index_dir = os.path.join(user_data_dir, "faiss_index")
    
    if not os.path.exists(docs_dir):
        print(f"❌ User docs directory not found: {docs_dir}")
        return False

    print(f"📚 Loading documents for User {user_id}...")
    
    documents = []
    
    # Load Markdown files
    try:
        loader = DirectoryLoader(docs_dir, glob="**/*.md", loader_cls=TextLoader)
        documents.extend(loader.load())
    except Exception as e:
        print(f"⚠️ Error loading .md files: {e}")
        
    # Load Text files
    try:
        loader = DirectoryLoader(docs_dir, glob="**/*.txt", loader_cls=TextLoader)
        documents.extend(loader.load())
    except Exception as e:
        print(f"⚠️ Error loading .txt files: {e}")
        
    # Load PDF files
    # Note: Requires pypdf
    try:
        loader = DirectoryLoader(docs_dir, glob="**/*.pdf", loader_cls=PyPDFLoader)
        documents.extend(loader.load())
    except Exception as e:
        print(f"⚠️ Error loading .pdf files (ensure pypdf is installed): {e}")

    if not documents:
        print("⚠️ No documents found to ingest.")
        return False
        
    print(f"✅ Loaded {len(documents)} documents.")

    # Split documents
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(documents)
    print(f"✂️ Split into {len(splits)} chunks.")

    # Embed and Store
    print("🧠 Embedding documents... (This runs locally, may take a moment)")
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
    
    try:
        vectorstore = FAISS.from_documents(splits, embeddings)
        vectorstore.save_local(index_dir)
        print("✅ User Index created successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to create vector store: {e}")
        return False
        
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python user_ingest.py <user_id>")
        sys.exit(1)
    
    user_id = sys.argv[1]
    ingest_user_docs(user_id)
