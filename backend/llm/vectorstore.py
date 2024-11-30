import pickle
import faiss
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader
from langchain_huggingface import HuggingFaceEmbeddings
from constants import embeddings

# Directory containing PDF documents
pdf_directory = "documents"
pages = []

# Generate a list of PDF file names
pdf_files = [f"\doc_{i}.pdf" for i in range(1, 6)]

# Load and split the content of each PDF file
for files in pdf_files:
    path = pdf_directory + files
    loader = PyPDFLoader(path)  
    pages += loader.load_and_split()

# Create a FAISS index from the loaded pages using embeddings
faiss_index = FAISS.from_documents(pages, embeddings)

# Write the FAISS index to a file for later use
faiss.write_index(faiss_index.index, "docs.index")

# Save the FAISS index store using pickle for persistence
with open("faiss_store.pkl", "wb") as f:
    pickle.dump(faiss_index, f)
