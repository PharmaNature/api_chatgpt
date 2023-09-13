# Utilisation :
# Envoyez un JSON de cette forme dans le body de la requête :
# {
#   "question" : "la question posée"
# }

import os
import openai
from flask import Flask, request, jsonify, abort

from dotenv import load_dotenv
load_dotenv()
openai.organization = os.getenv("ORG_ID", default=None)
openai.api_key = os.getenv("KEY_API", default=None)

import json
fichier_json = "data.json"

app = Flask(__name__)

@app.route("/create-completion", methods=["POST"])
def create_completion():
    try:
        prompt = request.get_json()
        if 'question' not in prompt:
            abort(400, "Veuillez posez une question.")
        
        with open(fichier_json, 'r') as json_file:
            data_json = json.load(json_file) 

        answer = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Imagine que tu es pharmacien, voici un json des problème de santé que ma pharmacie soigne avec le produit associé : \n" + str(data_json) + "\n Je vais te donner mes problèmes et tu devras me répondre quel produit pour chaque problème est associé. Je veux que tu mettes le nom du produit entre crochets. Lorsque le problème énoncé est une pathologie grave ou aucun des produit ne peuvent les guerir redirige la personne vers un spécialiste sinon reponds juste le bon produit. \n"},
                {"role": "user", "content": prompt['question']}
                ]
        )

        return jsonify(answer['choices'][0]['message']['content']), 201

    except openai.error.OpenAIError as e:
        abort(500, str(e))

@app.errorhandler(400)
def bad_request(error):
    return jsonify({"error": str(error)}), 400

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({"error": "Un problème est survenu avec le service OpenAI"}), 500

if __name__ == "__main__":
    app.run(debug=True)