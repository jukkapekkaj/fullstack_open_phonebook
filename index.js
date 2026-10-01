require('dotenv').config()
const express = require("express");
let morgan = require('morgan')
const Person = require('./models/person')

const app = express();

app.use(express.static('dist'))

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
    Person.find({}).then(response => {
        res.json(response)
    })
    // res.json(persons);
})

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }
      response.json(person)
    })
    .catch(error => next(error))
})

app.get("/api/info", (req, res) => {
    const date = new Date();
    Person.find({}).then(response => {
        res.send(`<p>Phonebook has info for ${response.length} people</p><p>${date}</p>`)
    })
    
})


app.delete("/api/persons/:id", (req, res) => {
    Person.findByIdAndDelete(req.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/api/persons", (req, res) => {
    console.log("new person: ", req.body);

    let newUser = req.body;
    if (!newUser.name) {
        res.status(400).send("username must be used");
        return;
    }

    if (!newUser.number) {
        res.status(400).send("number must be used");
        return;
    }

    newUser.id = Math.round(Math.random() * 100000);

    const newPerson = new Person({
        name: newUser.name,
        number: newUser.number
    })

    newPerson.save().then(result => {
        console.log(result)
        res.json(newUser);
    })

    // persons.push(newUser);
})


app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})


console.log("hello")