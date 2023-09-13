const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: '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', // defaults to process.env["OPENAI_API_KEY"]
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: "qui est l'auteur de one piece" }],
    model: 'gpt-3.5-turbo',
  });

  console.log(completion.choices);
}

main();
