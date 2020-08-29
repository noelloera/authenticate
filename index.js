const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const user = require("./routes/user.js")
const { connect, disconnect } = require("./database/database.js");

app.use(bodyParser.json());

connect();

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send({ message: "API Working" });
});

app.use("/user", user);

app.listen(PORT, (req, res) => {
  console.log(`Server listening at: http://localhost:${PORT}`);
});
