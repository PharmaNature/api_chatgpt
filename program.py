import os 
import openai
from dotenv import load_dotenv
load_dotenv()

openai.organization = os.getenv("ORG_ID", default=None)
openai.api_key = os.getenv("KEY_API", default=None)

prompt = f"Ecris moi une conclusion d'un article qui parle de l'utilisation de l'API ChatGPT"

completion = openai.ChatCompletion.create(
  model="gpt-3.5-turbo", 
  messages=[{"role": "user", "content": prompt}]
)

print(completion['choices'][0]['message']['content'])