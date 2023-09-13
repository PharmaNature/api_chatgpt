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

async function fileMessage(message){
    let contenu = "";
    const contextFilePath = path.join(__dirname, '../utils/context.txt');
    try {
        contenu = await fsPromises.readFile(contextFilePath, 'utf8');

        const productsInput = JSON.stringify(jsonInput);
        
        if (!message || typeof message !== 'string') {
            throw new Error('Message invalide');
        }

        console.log(contenu)

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    "role": "system",
                    "content": contenu + productsInput
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
