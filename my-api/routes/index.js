const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: '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', // Remplacez par votre clé API
});

router.post('/chatgpt', async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'user', content: req.query.question },
      ],
      model: 'gpt-3.5-turbo',
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Erreur lors de la requête à ChatGPT:', error);
    res.status(500).json({ error: 'Erreur lors de la requête à ChatGPT' });
  }
});

module.exports = router;
