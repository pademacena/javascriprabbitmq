require('dotenv').config()
const express = require('express')
const producerQueue = require('./infrastructure/rabbit/producer')
const consumerQueue = require('./infrastructure/rabbit/consumer')
const testerQueue = require('./infrastructure/rabbit/tester')

const consumeTesterQueue = require('./infrastructure/rabbit/consumeTester')

const app = express()

app.use(express.json())
app.post('/message', async (req, res) => {
  try{
    await producerQueue(req.body)
    res.status(202).json('message')
  } catch (error) {
    console.log(error)
    res.sendStatus(500) 
  }
})

app.post('/tester', async (req, res) => {
  try{
    await testerQueue(req.body)
    res.status(202).json('tester')
  } catch (error) {
    console.log(error)
    res.sendStatus(500) 
  }
})

// 
consumerQueue();
consumeTesterQueue();
app.listen(3001, () => console.log('listening on port 3001'))