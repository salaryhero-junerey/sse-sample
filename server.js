const express = require('express')

const app = express()

let clients = []

app.get('/sse-endpoint', (req, res) => {
  // Set headers to establish SSE
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // Send a comment to keep the connection alive in some proxies
  res.write(':\n\n')

  const clientId = Date.now()

  const newClient = {
    id: clientId,
    res
  }

  clients.push(newClient)
  console.log(`Client ${clientId} connected`)

  // Remove the client when the connection is closed
  req.on('close', () => {
    clients = clients.filter(client => client.id !== clientId)
  })
})

const sendEvent = (data) => {
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify(data)}\n\n`)
  })
}

app.post('/send-message', (req, res) => {
  const eventData = {
    type: 'referral_registration',
    message: 'User has registered using your referral code'
  }

  sendEvent(eventData)

  res.status(200).send('Event sent')
})

app.get('/', (req, res) => {
  // respond with the client.html file
  res.sendFile(__dirname + '/client.html')
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
