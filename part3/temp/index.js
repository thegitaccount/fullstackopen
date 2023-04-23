const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(express.static("build"));

morgan.token('data', (request, res) => {
  return request.method === "POST" ? JSON.stringify(request.body) : " "
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

let persons = [
    { id: 1,
      name: 'Arto Hellas', 
      number: '040-123456'
    },
    { id: 2,
      name: 'Ada Lovelace', 
      number: '39-44-5323523'
    },
    { 
      id: 3, 
      name: 'Dan Abramov', 
      number: '12-43-234345'
    },
    { 
      id: 4,
      name: 'Mary Poppendieck', 
      number: '39-23-6423122'
    }
]

app.get('/info', (request, res) => {
  const date = new Date()
  const message = `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
  res.send(message)
})

app.get('/api/persons', (request, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, res) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.send(person)
  } else {
    res.status(404).end()
  }
})

const generateId = () => {
  return Math.floor(Math.random() * 10 ** 6 + 1)
}

app.post('/api/persons', (request, res) => {

  const { name,number } = request.body
  console.log("request.body:", name, number)

  if (!name || !number) {
    return res.status(400).json({ 
      error: 'name or number is missing' 
    })
  }

  const notUnique = persons.find(person => person.name === name)
  if (notUnique) {
    return res.status(400).json({ 
      error: 'name must be unique' 
    })
  }  

  const person = {
    id: generateId(),
    name: name,
    number: number,
  }

  persons = persons.concat(person)
  res.json(person)
})

app.delete('/api/persons/:id', (request, res) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})
