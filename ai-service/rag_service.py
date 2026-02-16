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
INDEX_DIR = os.path.join(BASE_DIR, "faiss_index")
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
CHAT_MODEL = "gemini-2.5-flash"

class RAGService:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        
        # We can still init embeddings if API key is missing (for local embeddings)
        self.embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
        
        try:
            self.vectorstore = FAISS.load_local(INDEX_DIR, self.embeddings, allow_dangerous_deserialization=True)
            self.retriever = self.vectorstore.as_retriever(search_kwargs={"k": 3})
            print("✅ Vector store loaded successfully")
        except Exception as e:
            print(f"⚠️ Warning: Could not load vector store: {e}")
            self.retriever = None

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

    def ask(self, query, user_id=None):
        if not self.llm:
            return "System is not fully initialized (missing API Key)."
            
        retriever = None
        mode = "global_rag"
        
        # 1. Member Mode (Strict Private RAG)
        if user_id:
            user_retriever = self.get_user_retriever(user_id)
            if user_retriever:
                retriever = user_retriever
                mode = "user_rag"
                print(f"🔍 Using Private Index for User {user_id}")
            else:
                # User is logged in but has no data
                return {
                    "answer": "⚠️ **Private Knowledge Base Empty**\n\nYou haven't uploaded any documents yet. To prompt me, please:\n1. Go to **Profile > AI Settings**\n2. Upload your PDF, TXT, or MD files.\n\nOnce indexed, I will answer based on your data.",
                    "source": "empty_user_rag"
                }
        
        # 2. Guest Mode (Public AdroIT RAG)
        # Only reached if user_id is None
        elif not retriever:
            if self.retriever:
                retriever = self.retriever
                print("🔍 Using Global AdroIT Index (Guest Mode)")
            else:
                return "Knowledge base is currently unavailable."
            
        # Retrieval
        docs = retriever.invoke(query)
        if not docs and mode == "user_rag":
            pass
            
        context = self.format_docs(docs)
        print(f"📄 Generated Context ({len(context)} chars): {context[:200]}...")  # Debug log
        
        # Generation
        chain = self.prompt | self.llm | StrOutputParser()
        response = chain.invoke({"context": context, "question": query})
        print(f"🤖 LLM Answer: {response[:200]}...") # Debug log
        
        # Return response + mode info (hacky return, consumer handles it)
        return {"answer": response, "source": mode}

# For testing
if __name__ == "__main__":
    bot = RAGService()
    if bot.llm and bot.retriever:
        print(bot.ask("What is AdroIT?"))
    else:
        print("Skipping test due to missing config.")
