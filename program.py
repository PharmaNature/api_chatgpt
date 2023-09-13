import os 
import openai 
#import flask
 
# importation de la fonction load_dotenv de la bibliotheque dotenv
from dotenv import load_dotenv

#chargement des variables d'environnement du fichier .env
load_dotenv()

#recuperation et assignation des variable d'environnement
openai.organization = os.getenv("openai_org_id", default=None)

# contenant la clé pour nous connecter à l'api openai
openai.api_key = os.getenv("openai_api_key", default=None)



prompt = f"Ecris moi un poème court"

completion = openai.ChatCompletion.create(
  model="gpt-3.5-turbo", 
  messages=[{"role": "user", "content": prompt}]
)

print(completion['choices'][0]['message']['content'])