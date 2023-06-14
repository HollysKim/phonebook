const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'Unknown endpoint'
  })
}

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(bodyParser.json())
app.use(cors())


let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  const generateId = () => {
    const maxId = persons.length > 0
    ? Math.random()*100
    : 0
    return maxId + 1
  }

  app.post('/api/persons', bodyParser.json(), (request, response) => {
    const body = request.body
    if(!body.name) {
      return response.status(400).json({
        error: `Name missing!`
      })
    }

    else if(!body.number) {
      return response.status(400).json({
        error: 'Number missing!'
      })
    }

    else if(persons.filter(person => person.name == body.name).length > 0) {
      return response.status(400).json({
        error: 'Name already exists!'
      })
    }

    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
    morgan.token('body', request => 
    JSON.stringify(body))
  })

  
  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
      
    } else {
      response.status(404).end()
    }
  })

  app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <br/> <p>${Date.now()}</p>`)
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
  })

  app.use(unknownEndpoint)
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })