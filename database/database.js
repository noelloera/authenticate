const mongoose = require("mongoose");
const { config } = require("dotenv/types");
require("dotenv").config();

const dbURI = `mongodb+srv://${process.env.MONGO_E}:${process.env.MONGO_P}@groceries.ggozb.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

//This is implementation of sign in only
const options = { useNewUrlParser: true };


async function connect() {
  await mongoose
    .connect(process.env.MONGO_URI || dbURI, options)
    .then(() => {
      console.log("successfully connected database...");
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

async function disconnect() {
  await mongoose
    .disconnect()
    .then(() => {
      console.log("... successfully disconnected database");
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

module.exports={connect, disconnect}