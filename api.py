from flask import Flask, request, jsonify, abort
import json
import os
import openai
from dotenv import load_dotenv

# Chargement des variables d'environnement du fichier .env
load_dotenv()

# Récupération et assignation des variables d'environnement
openai.organization = os.getenv("openai_org_id", default=None)
openai.api_key = os.getenv("openai_api_key", default=None)

app = Flask(__name__)

@app.route('/gpt/answer', methods=['POST'])
def gpt_answer():
    try:
        prompt = request.get_json()
        
        # Chargement des données présentes dans le fichier json
        with open("database.json", "r") as json_file:
            database = json.load(json_file)

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system",
                 "content": f"Tu es un spécialiste de santé, je te donne un json contenant des problèmes que mes produits soignent :\n{json.dumps(database)}\nJe vais te dire mes problèmes et tu devras me répondre quel produit est associé à ma problématique"},
                {"role": "user", "content": prompt['question']}
            ]
        )

        return jsonify({"answer": response['choices'][0]['message']['content']})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.errorhandler(400)
def bad_request(error):
    return jsonify({"error": str(error)}), 400

if __name__ == "__main__":
    app.run(debug=True)
