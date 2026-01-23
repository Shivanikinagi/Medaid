"""
Check available Gemini models
"""
import os
from dotenv import load_dotenv

load_dotenv()

try:
    import google.generativeai as genai
    
    api_key = os.getenv('GOOGLE_API_KEY')
    if api_key:
        genai.configure(api_key=api_key)
        
        print("Available Gemini models:")
        print("=" * 60)
        
        for model in genai.list_models():
            if 'generateContent' in model.supported_generation_methods:
                print(f"✅ {model.name}")
                print(f"   Display Name: {model.display_name}")
                print(f"   Description: {model.description[:100]}...")
                print()
    else:
        print("No GOOGLE_API_KEY found in environment")
        
except Exception as e:
    print(f"Error: {e}")
