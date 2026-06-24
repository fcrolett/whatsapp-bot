const OpenAI = require("openai");
const knowledge = require("./knowledge.json");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildContext() {
  return `
Informazioni disponibili:
${Object.values(knowledge).join("\n")}
`;
}

async function askAI(userMessage) {
  const context = buildContext();

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
Sei un assistente aziendale.
Rispondi in italiano semplice, in modo chiaro e sintetico.

Devi usare principalmente queste informazioni:

${context}

Regole:
- Se la risposta è presente nelle informazioni disponibili, rispondi usando quelle informazioni.
- Se la risposta non è presente nelle informazioni disponibili, dillo chiaramente.
- Non inventare prezzi, orari, servizi o dettagli aziendali.
- Se l'utente saluta, rispondi in modo naturale e chiedi come puoi aiutare.
`,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const reply = response.choices[0].message.content;

  console.log("AI input:", userMessage);
  console.log("AI output:", reply);

  return reply;
}

module.exports = { askAI };
