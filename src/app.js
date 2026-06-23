const express = require("express");
const { verify, handleMessage } = require("./webhook.controller");

const app = express();
app.use(express.json());

app.get("/webhook", verify);
app.post("/webhook", handleMessage);

module.exports = app;
