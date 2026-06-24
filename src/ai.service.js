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

function askLocalKnowledge(userMessage) {
  const message = userMessage.toLowerCase();

  if (
    message.includes("orari") ||
    message.includes("aperti") ||
    message.includes("apertura") ||
    message.includes("chiusi") ||
    message.includes("chiusura")
  ) {
    return knowledge.orari || "Non ho informazioni sugli orari.";
  }

  if (
    message.includes("prezzo") ||
    message.includes("prezzi") ||
    message.includes("costa") ||
    message.includes("costo") ||
    message.includes("quanto")
  ) {
    return knowledge.prezzi || "Non ho informazioni sui prezzi.";
  }

  if (
    message.includes("azienda") ||
    message.includes("chi siete") ||
    message.includes("cosa fate") ||
    message.includes("servizi")
  ) {
    return knowledge.azienda || "Non ho informazioni sull'azienda.";
  }

  if (
    message.includes("ciao") ||
    message.includes("buongiorno") ||
    message.includes("buonasera") ||
    message.includes("salve")
  ) {
    return "Ciao! Posso aiutarti con informazioni su azienda, orari e prezzi.";
  }

  return "Al momento posso rispondere solo usando le informazioni disponibili su azienda, orari e prezzi.";
}

async function askAI(userMessage) {
  try {
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
  } catch (err) {
    console.error(
      "Errore OpenAI, uso fallback locale:",
      err.code || err.message || err,
    );

    return askLocalKnowledge(userMessage);
  }
}

module.exports = { askAI };
``;
