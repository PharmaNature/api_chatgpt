const { simpleMessage, fileMessage } = require('../services/openai')

module.exports.answer = async (req, res) => {
    const message = req.body.message;

    try {
        const answer = await simpleMessage(message);

        return res.send(answer[0].message.content);

    } catch (error) {
        if (error.message === 'Message invalide') {
            return res.status(400).send({ error: error.message });
        } else if (error.message === 'Réponse inattendue de OpenAI') {
            return res.status(500).send({ error: 'Erreur du serveur.' });
        } else {
            // Pour d'autres erreurs inattendues
            return res.status(500).send({ error: 'Erreur interne du serveur.' });
        }
    }
}

module.exports.goodAnswer = async (req, res) => {
    const message = req.body.message;
    const user_id = req.body.user_id;
    try {
        const answer = await fileMessage(message,user_id);
        return res.send({ response:answer[0].message.content});

    } catch (error) {
        if (error.message === 'Message invalide') {
            return res.status(400).send({ error: error.message });
        } else if (error.message === 'Réponse inattendue de OpenAI') {
            return res.status(500).send({ error: 'Erreur du serveur.' });
        } else {
            // Pour d'autres erreurs inattendues
            return res.status(500).send({ error: 'Erreur interne du serveur.' });
        }
    }
}

