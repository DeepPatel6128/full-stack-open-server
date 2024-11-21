require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGO_URI;
mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then((res) => {
    console.log("Connected");
  })
  .catch((e) => {
    console.log(e);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

module.exports = mongoose.model("Person", personSchema);
