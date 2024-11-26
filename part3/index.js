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

// Morgan token for request body
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

// Custom Morgan format
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body",
    {
      skip: (req, res) =>
        req.method !== "POST" || res.statusCode < 200 || res.statusCode >= 300, // Log only POST requests
    }
  )
);

///////////////////////////////////////
//Error handling middleware
function errorHandler(err, req, res, next) {
  if (err.name == "CastError") {
    res.status(400).json({ message: "ID not valid" });
  } else if (err.name == "ValidationError") {
    res.status(400).json({ message: err.message });
  } else if (err.name == "ConflictError") {
    res.status(409).json({ message: err.message });
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//log info
app.get("/info", async (req, res) => {
  const currentTime = new Date().toString();
  const people = await Person.find();
  res.send(`<p>Phonebook has info for ${people.length} people</p>
    <p>${currentTime}</p>`);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//get all phone numbers
app.get("/api/persons", async (req, res) => {
  await Person.find()
    .then((numbers) => {
      res.status(200).json(numbers);
    })
    .catch((e) => {
      res.status(404).json({ message: "Nothing found here" });
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//get a single contact
app.get("/api/persons/:id", async (req, res, next) => {
  const id = req.params.id;
  await Person.findOne({ _id: id })
    .then((person) => {
      if (person) res.send(person);
      else res.status(404).end();
    })
    .catch((e) => {
      next(e);
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//delete a single contact
app.delete("/api/persons/:id", async (req, res) => {
  const id = req.params.id;
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
app.post("/api/persons", async (req, res, next) => {
  const people = await Person.find();
  //we need to check if the name we are getting doesn't already exist in the data we have
  const individual = people.find(
    (person) => person.name == req.body.name || person.number == req.body.number
  );
  try {
    //if person already exists in the database, we create a custom error and send it to frontend
    if (individual) {
      if (individual.name == req.body.name) {
        const error = new Error("Name already exists.");
        error.name = "ConflictError";
        error.status = 400; // Set an appropriate status code
        return next(error);
      } else if (individual.number == req.body.number) {
        res
          .status(500)
          .json({ message: "Number is already registered for some name" });
      }
    }
    const person = new Person(req.body);
    await person.save();
    const updatedPeople = await Person.find();
    res.status(201).json(updatedPeople);
  } catch (e) {
    next(e);
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//put request to update the number of an existing contact
app.put("/api/persons/:id", async (req, res, next) => {
  const { name, number } = req.body;
  const existingContact = await Person.findOne({ number: number });

  if (!number) {
    return res.status(400).json({ message: "No number entered in the field" });
  }

  if (existingContact) {
    return res
      .status(400)
      .json({ message: "Number already exists for some other contact" });
  }
  try {
    const person = await Person.findOneAndUpdate(
      { name: name },
      { number: number },
      { runValidators: true }
    );
    if (person) {
      const updatedPeople = await Person.find();
      res.status(200).json(updatedPeople);
    } else {
      res.status(404).json({ message: "Person not found." });
    }
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Listening"));
