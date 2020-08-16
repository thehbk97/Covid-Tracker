const express = require('express')
var os = require('os');
var util = require('util');
const router = express.Router()
const covid = require('../models/CovidInfo')

// Homepage
router.get('/', async (req, res) => {
  HomeInfo = "<html><body><h1>Zee & Yusuf Covid Tracker</h1></body>"
  HomeInfo += "<label><b>/covidinfo</b>  to get all the data from the database</label><br>"
  HomeInfo += "<label><b>/addinfo</b>  to add entries to the database</label><br>"
  HomeInfo += "<label><b>/findtwenty</b>  to find first 20 entries with a given date and state</label><br>"
  HomeInfo += "<label><b>/findmorethanone</b>  to find entries where the cases are greater than 1 on a given date</label><br>"
  HomeInfo += "<label><b>/delete</b>  to delete an entry at a given county and state</label><br>"
  HomeInfo += "<label><b>/update</b>  to update an entry at a given county and state</label><br>"
  HomeInfo += "<label><b>/totals</b>  to get total cases and deaths in a given county and state</label><br>"
  HomeInfo += "<label><b>/osinfo</b>  to get current OS information</label><br>"
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

// Deleting page display
router.get('/delete', async (req, res) => {
  res.sendFile(__dirname + "/delete.html")
})
// Deleting Method
router.post('/deletevalues', async (req, res) => {
  try {
    values = await covid.findOneAndDelete({county: req.body.county, state: req.body.state})
    covid.save
    res.json({ message: 'Deleted One Entry', values })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Updating page display
router.get('/update', async (req, res) => {
  res.sendFile(__dirname + "/update.html")
})
// Deleting Method
router.post('/updatevalues', async (req, res) => {
  try {
    values = await covid.findOneAndUpdate({county: req.body.county, state: req.body.state}, {cases: req.body.cases, deaths: req.body.deaths, date: req.body.date}, {new: true})
    covid.save
    res.json({ message: 'Updated One Entry', values })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Totals page display
router.get('/totals', async (req, res) => {
  res.sendFile(__dirname + "/totals.html")
})
// Deleting Method
router.post('/totalvalues', async (req, res) => {
  try {
    var cases = 0
    var deaths = 0

    values = await covid.find({county: req.body.county, state: req.body.state})
    values.forEach(function(entry) {
      if(entry["_doc"]["cases"]){
        cases = cases + parseInt(entry["_doc"]["cases"])
      }
      if(entry["_doc"]["deaths"]){
        deaths = deaths + parseInt(entry["_doc"]["deaths"])
      }            
    });
    res.json({ message: `Number of Cases: ${cases} & Number of Deaths: ${deaths}`})
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