const express = require("express");
const cors = require("cors");
const { verify, handleMessage } = require("./webhook.controller");
const { askAI } = require("./ai.service");

const app = express();

app.use(cors());
app.options("*", cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("WhatsApp Bot API attiva");
});

app.get("/webhook", verify);
app.post("/webhook", handleMessage);

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({
        error: "Il campo message è obbligatorio",
      });
    }

    const reply = await askAI(message);

    return res.json({
      reply,
    });
  } catch (err) {
    console.error("Errore endpoint /chat:", err);

    return res.status(500).json({
      error: "Errore server",
    });
  }
});

module.exports = app;
