const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const user = require("./routes/user.js")
const me = require("./routes/me.js")
const { connect, disconnect } = require("./database/database.js");
const morgan = require("morgan")
app.use(
  morgan("tiny"),
  bodyParser.json());

connect();

const PORT = 5000;
app.get("/", (req, res) => {
  res.send({ message: "API Working" });
});

app.use(user);
app.use(me)

app.listen(PORT, (req, res) => {
  console.log(`Server listening at: http://localhost:${PORT}`);
});
