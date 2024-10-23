const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://deepPatel:${password}@finding.upxe2.mongodb.net/?retryWrites=true&w=majority&appName=Finding`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv[3]) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((res) => {
    console.log(res);
    mongoose.connection.close();
  });
} else {
  try {
    Person.find().then((res) => {
      console.log("phoneBook:");
      res.forEach((person) => {
        console.log(person.name, person.number);
      });
      mongoose.connection.close();
    });
  } catch (error) {
    console.log("Nothing found");
    mongoose.connection.close();
  }
}
