const config = require("./config");
const { sendMessage } = require("./whatsapp.service");
const { askAI } = require("./ai.service");

function verify(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === config.verifyToken) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
}

async function handleMessage(req, res) {
  try {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const text = message.text?.body;

    console.log("IN:", from, text);

    if (!text) {
      return res.sendStatus(200);
    }

    if (!config.allowedNumbers.includes(from)) {
      console.log("Numero non autorizzato:", from);
      return res.sendStatus(200);
    }

    const reply = await askAI(text);

    await sendMessage(from, reply);

    return res.sendStatus(200);
  } catch (err) {
    console.error(
      "Errore webhook WhatsApp:",
      err.response?.data || err.message || err,
    );

    return res.sendStatus(500);
  }
}

module.exports = { verify, handleMessage };
