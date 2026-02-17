import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
GLOBAL_INDEX_DIR = os.path.join(BASE_DIR, "faiss_index")  # Markdown docs only
RESOURCES_INDEX_DIR = os.path.join(BASE_DIR, "faiss_index_resources")  # MongoDB resources only
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
CHAT_MODEL = "gemini-2.5-flash"

class RAGService:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        
        # We can still init embeddings if API key is missing (for local embeddings)
        self.embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
        
        # Load GLOBAL index (markdown docs - for everyone)
        try:
            self.global_vectorstore = FAISS.load_local(GLOBAL_INDEX_DIR, self.embeddings, allow_dangerous_deserialization=True)
            self.global_retriever = self.global_vectorstore.as_retriever(search_kwargs={"k": 3})
            print("✅ Global vector store (markdown docs) loaded successfully")
        except Exception as e:
            print(f"⚠️ Warning: Could not load global vector store: {e}")
            self.global_retriever = None

        # Load RESOURCES index (MongoDB resources - for members only)
        try:
            self.resources_vectorstore = FAISS.load_local(RESOURCES_INDEX_DIR, self.embeddings, allow_dangerous_deserialization=True)
            self.resources_retriever = self.resources_vectorstore.as_retriever(search_kwargs={"k": 3})
            print("✅ Resources vector store (MongoDB resources) loaded successfully")
        except Exception as e:
            print(f"⚠️ Warning: Could not load resources vector store: {e}")
            self.resources_retriever = None

        if self.api_key:
            self.llm = ChatGoogleGenerativeAI(model=CHAT_MODEL, google_api_key=self.api_key, temperature=0.3)
        else:
            self.llm = None
            print("⚠️ Warning: GEMINI_API_KEY missing. Chat will not work.")

        # Prompt Template
        template = """Answer the question based ONLY on the following context about AdroIT technical club. 
If the answer is not in the context, say "I cannot answer this based on the provided documents."

Context:
{context}

Question: {question}

Answer:"""
        self.prompt = PromptTemplate(template=template, input_variables=["context", "question"])

    def format_docs(self, docs):
        return "\n\n".join(doc.page_content for doc in docs)

    def get_user_retriever(self, user_id):
        """Loads a user-specific FAISS index if it exists."""
        user_index_dir = os.path.join(BASE_DIR, "data", "users", user_id, "faiss_index")
        if os.path.exists(user_index_dir):
            try:
                # Load user vector store
                vectorstore = FAISS.load_local(user_index_dir, self.embeddings, allow_dangerous_deserialization=True)
                return vectorstore.as_retriever(search_kwargs={"k": 3})
            except Exception as e:
                print(f"⚠️ Error loading user index for {user_id}: {e}")
                return None
        return None

    def ask(self, query, user_id=None, user_api_key=None, user_approved=False):
        """
        Ask a question using RAG
        Args:
            query: The question to ask
            user_id: Optional user ID for private RAG
            user_api_key: Optional user's personal Gemini API key
            user_approved: Whether user is approved member (to access resources)
        """
        print(f"\n🔍 RAG Query Started")
        print(f"   User ID: {user_id}")
        print(f"   User Approved: {user_approved}")
        print(f"   User API Key: {'Yes' if user_api_key else 'No'}")
        print(f"   Query: {query[:100]}...")
        
        # Determine which LLM to use
        llm = None
        if user_api_key:
            try:
                llm = ChatGoogleGenerativeAI(model=CHAT_MODEL, google_api_key=user_api_key, temperature=0.3)
                print(f"   🔑 Using user's personal API key")
            except Exception as e:
                print(f"   ⚠️ Error initializing user's API key: {e}")
                llm = self.llm  # Fallback to admin key
        else:
            llm = self.llm
            
        if not llm:
            return {"answer": "System is not fully initialized (missing API Key).", "source": "error"}
            
        retriever = None
        mode = "global_rag"
        
        # 1. Member Mode (Strict Private RAG) - Only if they have uploaded documents
        if user_id:
            user_retriever = self.get_user_retriever(user_id)
            if user_retriever:
                retriever = user_retriever
                mode = "user_rag"
                print(f"   🔍 Using Private Index for User {user_id}")
            # If no private documents, fall through to combined RAG
        
        # 2. Combined RAG - Global + Resources (if approved)
        if not retriever:
            retrievers = []
            
            # Global index always available
            if self.global_retriever:
                retrievers.append(self.global_retriever)
                print("   🔍 Adding Global Index (markdown docs)")
            
            # Resources index only for approved members
            if user_approved and self.resources_retriever:
                retrievers.append(self.resources_retriever)
                print("   🔍 Adding Resources Index (members only)")
            elif not user_approved and self.resources_retriever:
                print("   ⛔ Resources Index BLOCKED (user not approved)")
            
            # Combine retrievers
            if retrievers:
                if len(retrievers) == 1:
                    retriever = retrievers[0]
                else:
                    # Create a combined retriever that queries all and merges results
                    def combined_search(q):
                        all_docs = []
                        for ret in retrievers:
                            all_docs.extend(ret.invoke(q))
                        # Remove duplicates while preserving order
                        seen = set()
                        unique_docs = []
                        for doc in all_docs:
                            doc_id = doc.page_content[:50]  # Use first 50 chars as simple ID
                            if doc_id not in seen:
                                seen.add(doc_id)
                                unique_docs.append(doc)
                        return unique_docs[:6]  # Return top 6 unique docs
                    
                    class CombinedRetriever:
                        def invoke(self, q):
                            return combined_search(q)
                    
                    retriever = CombinedRetriever()
            else:
                return {"answer": "Knowledge base is currently unavailable.", "source": "error"}
        
        # Retrieval
        docs = retriever.invoke(query)
        if not docs and mode == "user_rag":
            pass
            
        context = self.format_docs(docs)
        print(f"   📄 Retrieved {len(docs)} documents ({len(context)} chars)")
        
        # Generation with the appropriate LLM
        chain = self.prompt | llm | StrOutputParser()
        response = chain.invoke({"context": context, "question": query})
        print(f"   ✅ Query completed - Mode: {mode}")
        
        # Return response + mode info
        return {"answer": response, "source": mode}

# For testing
if __name__ == "__main__":
    bot = RAGService()
    if bot.llm and bot.global_retriever:
        print(bot.ask("What is AdroIT?"))
    else:
        print("Skipping test due to missing config.")

