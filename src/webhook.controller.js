const config = require("./config");
const { sendMessage } = require("./whatsapp.service");

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
  const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!message) return res.sendStatus(200);

  const from = message.from;
  const text = message.text?.body;

  console.log("IN:", from, text);

  if (!config.allowedNumbers.includes(from)) {
    return res.sendStatus(200);
  }

  const reply = await askAI(text);

  await sendMessage(from, reply);

  res.sendStatus(200);
}

module.exports = { verify, handleMessage };
