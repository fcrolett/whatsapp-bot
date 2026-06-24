require("dotenv").config();

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variabile ambiente mancante: ${name}`);
  }

  return value;
}

function parseAllowedNumbers(value) {
  return value
    .split(",")
    .map((number) => number.trim())
    .filter(Boolean);
}

module.exports = {
  port: process.env.PORT || 3000,

  token: getRequiredEnv("TOKEN"),

  phoneNumberId: getRequiredEnv("PHONE_NUMBER_ID"),

  verifyToken: getRequiredEnv("VERIFY_TOKEN"),

  openAiApiKey: getRequiredEnv("OPENAI_API_KEY"),

  allowedNumbers: parseAllowedNumbers(process.env.ALLOWED_NUMBERS || ""),
};
