const express = require('express')
var os = require('os');
var util = require('util');
const router = express.Router()
const covid = require('../models/CovidInfo')

// Homepage
router.get('/', async (req, res) => {
  HomeInfo = "<html><body><h1>Zee & Yusuf Covid Tracker</h1></body>"
  res.send(HomeInfo)
})


// Getting all data from db
router.get('/covidinfo', async (req, res) => {
    try {
      const covidData = await covid.find({})
      res.json(covidData)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

//Page to Add Data
router.get('/addinfo', async (req, res) => {
  res.sendFile(__dirname + "/addinfo.html")
})
//Add Data POST Method
router.post('/addcovid', async (req, res) => {
  const entry = new covid({
    date: req.body.date,
    county: req.body.county,
    state: req.body.state,
    cases: req.body.cases,
    deaths: req.body.deaths
  })
  try {
    const newEntry = await entry.save()
    res.status(201).json(newEntry)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Getting first 20
router.get('/findtwenty', async (req, res) => {
  res.sendFile(__dirname + "/first20.html")
})
// Getting first 20 POST
router.post('/foundtwenty', async (req, res) => {
  try {
    const covidData = await covid.find({date: req.body.date, state: req.body.state}).limit(20)
    res.json(covidData)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting more than 1 case
router.get('/findmorethanone', async (req, res) => {
  res.sendFile(__dirname + "/findmorethanone.html")
})
// Getting more than 1 case POST
router.post('/foundndmorethanone', async (req, res) => {
  try {
    const covidData = await covid.find({date: req.body.date, cases: {$gte:"2"}})
    res.json(covidData)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting OS data
router.get('/osinfo', async (req, res) => {
  try {
    sysInfo = "<html><head><title>Operating System Info</title></head>"
    sysInfo += "<body><h1>Operating System Info</h1>"
    sysInfo += "<table>"
    sysInfo += "<tr><th> Tmp Dir </th><td>"
    sysInfo += os.tmpdir()
    sysInfo += "</td></tr>"
    sysInfo += "<tr><th> Host Name </th><td></td>"
    sysInfo += os.hostname()
    sysInfo += "</td></tr>"
    sysInfo += "<tr><th> OS Type</th><td>"
    sysInfo += os.type()
    sysInfo += os.platform()
    sysInfo += os.arch()
    sysInfo += os.release()
    sysInfo += '</td></tr>'
    sysInfo += '<tr><th> Uptime </th><td>'
    sysInfo += (os.uptime())/3600
    sysInfo += 'hours. userInfo'
    sysInfo += util.inspect(os.userInfo())
    sysInfo += '</td></tr>'
    sysInfo += '<tr><th> Memory </th><td> total:'
    sysInfo += os.totalmem()
    sysInfo += ' free:'+os.freemem()
    sysInfo += '</td></tr>'
    sysInfo += '<tr><th> CPU </th><td>'
    sysInfo += util.inspect(os.cpus())
    sysInfo += ' </td></tr>'
    sysInfo += '<tr><th> Network </th><td>'
    sysInfo += util.inspect(os.networkInterfaces())
    sysInfo += ' </td></tr>'
    sysInfo += '</table>'
    sysInfo += '</body></html>'
    res.send(sysInfo)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router