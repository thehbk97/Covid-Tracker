const mongoose = require('mongoose')

const covidSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  county: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true,
  },
  cases: {
    type: String,
    required: true
  },
  deaths: {
    type: String,
    required: true
  }
}, {collection: 'Covid'})

module.exports = mongoose.model('covid', covidSchema)