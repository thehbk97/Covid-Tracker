const express = require('express')
const app = express()
const mongoose = require('mongoose')

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/CovidDBLess', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const covidInfoRouter = require('./routes/CovidInfo')
app.use('/', covidInfoRouter)

app.listen(3001, () => console.log('Server started on localhost:3001; press Ctrl-C to terminate....'))