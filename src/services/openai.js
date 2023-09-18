require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAi = require('openai');
const jsonInput = require('../utils/produits.json');

const openai = new OpenAi({
    apiKey: process.env.TOKEN_GPT
});

async function simpleMessage(message) {
    try {
        if (!message || typeof message !== 'string') {
            throw new Error('Message invalide');
        }

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ],
            model: 'gpt-3.5-turbo',
        });

        if (completion.choices) {
            return completion.choices;
        } else {
            throw new Error('Réponse inattendue de OpenAI');
        }

    } catch (error) {
        throw error;
    }
}

const fsPromises = fs.promises;

async function fileMessage(message, isTheFirstMessage) {
    let contenu = "";
    let historique = "";
    let historiqueConv = "";
    const contextFilePath = path.join(__dirname, '../utils/context.txt');
    const historyFilePath = path.join(__dirname, '../utils/history.txt');
    try {
        contenu = await fsPromises.readFile(contextFilePath, 'utf8');
        historique = await fsPromises.readFile(historyFilePath, 'utf8')
        const productsInput = JSON.stringify(jsonInput);

        if (!message || typeof message !== 'string') {
            throw new Error('Message invalide');
        }

        console.log(contenu)
        var content = contenu + productsInput
        // si ce n'est pas le premier message, ajout de l'historique à la conversation
        if (!isTheFirstMessage) {
            content += historique
        }
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    "role": "system",
                    "content": content
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            model: 'gpt-3.5-turbo',
            max_tokens: 200
        });

        console.log(completion)
        // Si c'est le premier 
        if (isTheFirstMessage) {
            historiqueConv += "Voici également l'échange que tu as eu avec l'utilisateur si besoin : "
            historique = ""
        }
        historiqueConv += historique
        historiqueConv += "\n"
        historiqueConv += "-Utilisateur: " + message
        historiqueConv += "\n"
        historiqueConv += "-GPT: " + completion.choices[0].message.content
        console.log(historiqueConv);


        fs.writeFile(historyFilePath, historiqueConv, (err) => {
            if (err) {
                console.error('Une erreur s\'est produite lors de l\'écriture du fichier :', err);
                return;
            }
            console.log('Le fichier a été écrit avec succès.');
        });

        if (completion.choices) {
            return completion.choices;
        } else {
            throw new Error('Réponse inattendue de OpenAI');
        }

    } catch (error) {
        console.error("Erreur :", error);
        throw error;
    }
}


module.exports = {
    simpleMessage, fileMessage
}
