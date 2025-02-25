const mongoose = require('mongoose')
const len = process.argv.length;
if(len < 3){
    console.log('give password as argument')
    process.exit(1)
}



const password = process.argv[2]

const url = `mongodb+srv://parmarkuldeep246:${password}@cluster0.sqwab.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strict',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name : String,
    number : String,
}) 


const Person = mongoose.model('Person',personSchema)

if(len < 5) {

    Person.find({}).then(result => {
        console.log('Phonebook')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })

        mongoose.connection.close();
    })  
}
else{
    const person = new Person({
        name : process.argv[3],
        number: process.argv[4],
    })
    
    person.save().then(result => {
        console.log(
            `Added ${result.name} number ${result.number} to phonebook`
        )
        mongoose.connection.close()
    })

}

