const mongoose = require("mongoose");
require("dotenv").config({path:".env"})


//This is implementation of sign in only
const options = { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
 };


async function connect() {
  try{
    await mongoose
    .connect(process.env.MONGO_URI, options)
    .then(() => {
      console.log("successfully connected database...");
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
  }catch(error){
    console.log(error);
  }
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

module.exports = { connect, disconnect }