

const FILE_PATH = 'conversation.json'
const MAX_MESSAGES = 1_500;


// Vérifie si la conversation doit être supprimé 
function shouldDeleteConversation(conversations, user_id) {
    const oneMinuteAgo = new Date(new Date() - (60000 * 60 * 6)); // 60000 ms dans 1 minute * 60 = 1h * 6 = 6h
    const conv = conversations[user_id]
    return conv.messages.length > MAX_MESSAGES || new Date(conv.time) < oneMinuteAgo;
}


// retourne ou créé la conversation demandé 
function getConversation(conversations,user_id) {
    if (!conversations[user_id]) {
        conversations[user_id] = { messages: "", time: new Date().toISOString() };
    }
    return conversations[user_id];
}

// Supprime la conversation passé en paramètre
function deleteConversation(conversation, user_id) {
    if (conversation[user_id]) {
        delete conversation[user_id]
    }
    return conversation
}

function loadConversations(fs,path) {
    try {
        const filePath = path.join(__dirname,FILE_PATH);
        const data = fs.readFileSync(filePath, 'utf8');
        var conversations = JSON.parse(data);
        return conversations
    } catch (err) {
        console.error('Erreur lors du chargement du fichier JSON :', err);
    }
}

function addToConversation(fs,path,conversation, user_id,user_message,gpt_message) {
    // Ajouter un message à la conversation
    conversation[user_id].messages += "\n" + "Utilisateur: "+user_message + "\n" + "GPT: "+gpt_message;
    // Enregistrement des conversations dans le fichier JSON
    try {
        const filePath = path.join(__dirname,FILE_PATH);
        fs.writeFileSync(filePath, JSON.stringify(conversation), 'utf8');
    } catch (err) {
        console.error('Erreur lors de l\'enregistrement du fichier JSON :', err);
    }
}

module.exports = {
    getConversation, 
    loadConversations, 
    addToConversation, 
    shouldDeleteConversation,
    deleteConversation
}
