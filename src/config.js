require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  token: process.env.TOKEN,
  phoneNumberId: process.env.PHONE_NUMBER_ID,
  verifyToken: process.env.VERIFY_TOKEN,
  allowedNumbers: process.env.ALLOWED_NUMBERS.split(","),
};
