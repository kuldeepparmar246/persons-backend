require('dotenv').config()
var express = require('express')
var morgan = require('morgan')
var cors = require('cors')
const app = express()
const Person = require('./modules/person')

morgan.token('type', function (req, res) { return JSON.stringify(req.body) })

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(morgan(':type'))


app.get('/api/persons', (request,response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
})

app.get('/info' ,async (request,response) => {
    const totalDocument = await Person.estimatedDocumentCount();
    const message = `<p>PhoneBook has info of ${totalDocument} people</p>
                      <p>${new Date()}</p>`

    response.send(message);
})

app.get('/api/persons/:id',(request,response,next) => {
    Person.findById(request.params.id)
    .then(returnedPerson => {
        if(returnedPerson){
            response.json(returnedPerson)
        }
        else{
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id',(request,response,next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons',(request,response,next) => {
    const body = request.body
    const person = new Person({
        name : body.name,
        number : body.number
    })

    person.save().then(savedPerson => {
        response.json(person)
    })
    .catch(error => next(error))


})

app.put('/api/persons/:id',(request,response,next) => {
    const body = request.body;

    const person = {
        name : body.name,
        number : body.number
    }

    Person.findByIdAndUpdate(request.params.id,person,{new : true, runValidators : true, context : 'query'})
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request,response) => {
    response.status(404).send({
        error : "unknown endpoint"
    })
}

app.use(unknownEndpoint)

const errorHandler = (error,request,response,next) => {
    console.log(error.message)
    if(error.name == 'CastError'){
        return response.status(400).send({
            error : 'malformated id (error in id) !!'
        })
    }
    else if(error.name == 'ValidationError') {
        return response.status(400).send({
            error : error.message
        })
    }

    next(error);
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server is running on PORT ${PORT}`)