import google.generativeai as genAI
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Configure API key for Google Generative AI (Gemini)
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("API key is missing. Please provide the GOOGLE_API_KEY in your .env file.")

genAI.configure(api_key=api_key)

# Function to generate medical responses
def med_gpt(query=None, treatment=False, user_data=None):
    if treatment and user_data:
        prompt = f"""
        You are a medical assistant. Analyze the following patient data and provide treatment recommendations:
        Please analyze the patient data and return some basic treatment recommendations the following format:

        "Based on the provided data, the would recommended [treatment recommendations]."
        "Respond shortly"

        Patient data: {user_data}
        """
    else:
        context = store.similarity_search(query, k=3)
        prompt =  f"""
        You are a medical assistant specialized in identifying medical disorders or diseases based on symptoms.
        Please analyze the following symptoms and return the name of the most relevant medical disorder or disease in the following format:
        
        "Based on the symptoms provided, the most likely diagnosis is [disorder name]."
        Symptoms: {query}
        Relevant context: {context}

        If the query does not pertain to medical conditions, please respond with a general message.
        """
    try:
        # Generate content based on the prompt
        model = genAI.GenerativeModel('gemini-1.5-pro')  
        response = model.generate_content(prompt) 
        return response.text.replace("*", "") 
    
    except Exception:
        return "An error occurred during processing." 
