import cors from 'cors'
import express from 'express'
import { clearInterval, setInterval } from 'timers'
import { generateData } from './utils.js'

const app = express()
app.use(cors())
const PORT = 3000

let intervalId = null // Initialize with null for clarity
let client = undefined

// Add logging middleware to see incoming requests
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`)
  next()
})

app.get('/events', (req, res) => {
  console.log('Handling /events request')
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  })

  client = res

  // Handle client disconnection
  req.on('close', () => {
    client = undefined
    clearInterval(intervalId) // Clear interval if client disconnects
    intervalId = null
  })

  req.on('error', () => {
    client = undefined
    clearInterval(intervalId) // Clear interval on error
    intervalId = null
  })

  res.on('close', () => {
    client = undefined
    clearInterval(intervalId) // Clear interval on response close
    intervalId = null
  })

  if (!intervalId) {
    intervalId = setInterval(() => {
      if (client) {
        // Check if client exists before writing
        const dataToTransmit = generateData()
        client.write(`data: ${dataToTransmit}\n\n`)
      } else {
        clearInterval(intervalId) // Clear interval if no client
        intervalId = null
      }
    }, 2000)
  }
})

app.get('/close', (req, res) => {
  console.log('Handling /close request')
  clearInterval(intervalId)
  intervalId = null
  client = undefined // Reset client
  res.send('Connection closed')
})

app.get('/retry', (req, res) => {
  console.log('Handling /retry request')
  if (!intervalId) {
    intervalId = setInterval(() => {
      if (client) {
        // Check if client exists before writing
        const dataToTransmit = generateData()
        client.write(`data: ${dataToTransmit}\n\n`)
      } else {
        clearInterval(intervalId) // Clear interval if no client
        intervalId = null
      }
    }, 2000)
  }
  res.send('Connection retried')
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send('Internal Server Error')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
