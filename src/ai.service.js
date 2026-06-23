const knowledge = require("./knowledge.json");

function buildContext() {
  return `
Informazioni azienda:
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
Rispondi usando queste informazioni:

${context}


Se non sai qualcosa, dì chiaramente che non è disponibile.
        `,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  console.log("AI input:", userMessage);
  console.log("AI output:", response.choices[0].message.content);
  return response.choices[0].message.content;
}
