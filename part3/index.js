const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/phoneBook");
const app = express();

//this middleware is used to parse data sent via request
//express middlewares are used to handle request response objects and modify them according to our need
//we can use multiple middlewares at once but they will be executed orderly by which they are placed in the application
app.use(express.json());
app.use(express.static("dist"));
const validDomain = "http://localhost:5173";
app.use(cors(validDomain));

//app.use(requestLogger);

//log
app.use(
  morgan("combined", {
    skip: function (req, res) {
      return req.method != "POST";
    },
  })
);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//log info
app.get("/info", (req, res) => {
  const currentTime = new Date().toString();
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${currentTime}</p>`);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//get all phone numbers
app.get("/api/persons", async (req, res) => {
  const people = await Person.find();
  res.status(200).json(people);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//get a single contact
app.get("/api/persons/:id", async (req, res) => {
  const id = req.params.id;
  const person = await Person.findOne({ _id: id });
  if (person) {
    res.send(person);
  } else res.status(404).end();
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//delete a single contact
app.delete("/api/persons/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const result = await Person.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).end(); // No document found to delete
    }
    res.status(204).end(); // Successfully deleted
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the contact." });
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//post request
app.post("/api/persons", async (req, res) => {
  const people = await Person.find();
  //we need to check if the name we are getting doesn't already exist in the data we have
  if (req.body.name != "") {
    const name = people.find((person) => person.name == req.body.name);
    if (name) {
      return res.status(409).json({ error: "name already exists" });
    } else {
      try {
        const person = new Person(req.body);
        await person.save();
        const updatedPeople = await Person.find();
        res.status(201).json(updatedPeople);
      } catch (e) {
        console.log(e.message);
        res.status(500);
      }
    }
  } else {
    res.status(404).json({ error: "please enter a valid name" });
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//put request to update the number of an existing contact
app.put("/api/persons/:id", async (req, res) => {
  const { name, number } = req.body;

  if (!number) {
    return res.status(400).json({ error: "No number here" });
  }
  try {
    const person = await Person.findOneAndUpdate(
      { name: name },
      { number: number }
    );
    if (person) {
      const updatedPeople = await Person.find();
      res.status(200).json(updatedPeople);
    } else {
      res.status(404).json({ error: "Person not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the contact." });
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Listen"));
