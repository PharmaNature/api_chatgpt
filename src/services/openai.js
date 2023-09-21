require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAi = require('openai');
const jsonInput = require('../utils/data.json');
const { getConversation, loadConversations, addToConversation, deleteConversation, shouldDeleteConversation } = require('../utils/conversationUtil.js')

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

async function fileMessage(message, user_id) {
    let context = "";
    let user_conversation = "";
    const contextFilePath = path.join(__dirname, '../utils/context.txt');
    
    try {
        // récupère le context
        context = await fsPromises.readFile(contextFilePath, 'utf8');
        
        // récupère les conversations de tout le monde
        let all_conversations = loadConversations(fs,path)
        // récupère la conversation de l'utilisateur
        user_conversation = getConversation(all_conversations,user_id)
        // récupère tous les produits
        const all_product = JSON.stringify(jsonInput);

        if (!message || typeof message !== 'string') {
            throw new Error('Message invalide');
        }
        // contexte + tous les produits 
        let content = context + all_product

        // si ce n'est pas le premier message, ajout de l'historique à la conversation
        if (user_conversation.message !== "") {
            content += "Voici également l'échange que tu as eu avec l'utilisateur si besoin : \n"
            content += user_conversation.message
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
        console.log(completion.usage.total_tokens);
        // modification du cout des discussions avec le G
        let cout = fs.readFileSync(path.join(__dirname, '../utils/cout.txt'), 'utf8');
        let coutFloat = parseFloat(cout)
        coutFloat += ((completion.usage.prompt_tokens/1000) * 0.0015) + ((completion.usage.completion_tokens/1000) * 0.002)
        fs.writeFileSync(path.join(__dirname, '../utils/cout.txt'), String(coutFloat), 'utf8');
        let all = all_conversations
        for(let key in all){
            if(shouldDeleteConversation(all_conversations,key)){
            all_conversations = deleteConversation(all_conversations,key)
            }
        }
        getConversation(all_conversations,user_id)
        addToConversation(fs,path,all_conversations,user_id, message,completion.choices[0].message.content)
        
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
