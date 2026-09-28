const express = require("express");
let morgan = require('morgan')

const app = express();

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

morgan.token('body', function getBody (req) {
  return JSON.stringify(req.body);
})

app.use(express.json());
app.use(morgan(':method :url :response-time :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]





app.get("/", (req, res) => {
    res.send("hello");
})

app.get("/api/persons", (req, res) => {
    res.json(persons);
})

app.get("/api/persons/:id", (req, res) => {
    let person = persons.find((person) => person.id === req.params.id);
    if (person) {
        res.json(person);
    }
    else {
        res.status(404).end();
    }
})

app.get("/api/info", (req, res) => {
    const date = new Date();
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})


app.delete("/api/persons/:id", (req, res) => {
    let person = persons.find((person) => person.id === req.params.id);
    if (person) {
        persons = persons.filter(person => person.id !== req.params.id);
        res.status(204).end();
    }
    else {
        res.status(404).end();
    }
})

app.post("/api/persons", (req, res) => {
    console.log("new person: ", req.body);

    let newUser = req.body;
    if (!newUser.name) {
        res.status(400).send("username must be used");
        return;
    }

    const existingUser = persons.find(person => person.name === newUser.name);
    if (existingUser) {
        res.status(400).send("username must be unique");
        return;
    }

    if (!newUser.number) {
        res.status(400).send("number must be used");
        return;
    }

    newUser.id = Math.round(Math.random() * 100000);
    persons.push(newUser);
    res.json(newUser);
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})


console.log("hello")