var express = require('express')
var morgan = require('morgan')
var cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.use(morgan('tiny'))

morgan.token('type', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':type'))

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

const generateId = () => {
    const id = Math.floor(Math.random()*1000)

    return String(id)
}

app.get('/api/persons', (request,response) => {
    response.json(persons)
})

app.get('/info' , (request,response) => {
     const message = `<p>PhoneBook has info of ${persons.length} people</p>
                      <p>${new Date()}</p>`

    response.send(message);
})

app.get('/api/persons/:id',(request,response) => {
    const id  = request.params.id;
    const person = persons.find(person => person.id === id);

    if(!person){
        response.statusMessage = "NOT FOUND"
        response.status(404).end()
    }
    else{
        response.json(person)
    }

})

app.delete('/api/persons/:id',(request,response) => {
    const id = request.params.id;
    
    persons = persons.filter(person => person.id != id)

    response.status(204).end()
})

app.post('/api/persons',(request,response) => {
    const body = request.body

    if(!body.name){
        return response.status(400).json({
            error : "name missing"
        })
    }

    if(!body.number){
        return response.status(404).json({
            error : "number missing"
        })
    }

    if(persons.find(person => person.name == body.name)){
        return  response.status(404).json({
            error: "name must be unique"
        })
    }

    const person = {
        name : body.name,
        number: body.number,
        id : generateId()
    }

    persons = persons.concat(person);

    response.json(person)


})

const unknownEndpoint = (request,response) => {
    response.status(404).send({
        error : "unknown endpoint"
    })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT)
console.log(`Server is running on PORT ${PORT}`)