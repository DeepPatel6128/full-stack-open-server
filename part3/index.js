//data
let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

//this middleware is used to parse data sent via request
//express middlewares are used to handle request response objects and modify them according to our need
//we can use multiple middlewares at once but they will be executed orderly by which they are placed in the application
app.use(express.json());

const validDomain = "http://localhost:5173";
app.use(cors(validDomain));

// //our own middleware
// const requestLogger = (request, response, next) => {
//   console.log("Method", request.method);
//   console.log("Path", request.path);
//   console.log("Body", request.body);
//   next();
// };

//app.use(requestLogger);

//log
app.use(
  morgan("combined", {
    skip: function (req, res) {
      return req.method != "POST";
    },
  })
);

//log info
app.get("/info", (req, res) => {
  const currentTime = new Date().toString();
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${currentTime}</p>`);
});

//get all phone numbers
app.get("/api/persons", (req, res) => {
  res.send(persons);
});

//get a single contact
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id == id);
  if (person) {
    res.send(person);
  } else res.status(404).end();
});

//delete a single contact
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id != id);
  res.status(204, id).end();
});

//post request
app.post("/api/persons", (req, res) => {
  //there is a possibility that ids might overlap but we are not focusing on that
  //right now
  let id = Math.floor(Math.random() * 1000) + 1;
  id = id.toString();
  const body = { id, ...req.body };

  //we need to check if the name we are getting doesn't already exist in the data we have
  if (body.name != "") {
    const name = persons.find((name) => name.name == body.name);
    if (name) {
      return res.status(409).json({ error: "name already exists" });
    } else {
      persons.push(body);
      res.status(201);
      res.send(persons);
    }
  } else {
    res.status(404).json({ error: "please enter a valid name" });
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Listening"));
