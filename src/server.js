const app = require("./app");
const config = require("./config");

app.listen(config.port, () => {
  console.log("Server avviato su porta", config.port);
});
