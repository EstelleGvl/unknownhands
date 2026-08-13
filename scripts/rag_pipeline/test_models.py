import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=KEY)

try:
    print("Listing available embedding models for your key:")
    for m in genai.list_models():
        if 'embedContent' in m.supported_generation_methods:
            print(f" - {m.name}")
except Exception as e:
    print("Error:", e)
