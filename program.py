import os 
import openai
import flask 

# importation de la fonction load_dotenv de la bibliotheque dotenv
from dotenv import load_dotenv

#chargement des variables d'environnement du fichier .env
load_dotenv()

#recuperation et assignation des variable d'environnement
openai.organization = os.getenv("openai_org_id", default=None)

# contenant la clé pour nous connecter à l'api openai
openai.api_key = os.getenv("openai_api_key", default=None)

for k in range(3):
    messages=[{"role": "system", "content": "Tu es un américain"}]
    msg = input()
    messages.append({"role": "user", "content": msg})
    reply = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=messages)
    messages.append({"role": "assistant", "content":reply['choices'][0]['message']['content']})
    print(reply['choices'][0]['message']['content'])


