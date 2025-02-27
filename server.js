const express = require('express')

const app = express()

let clients = new Map()

app.get('/sse-endpoint', (req, res) => {
  // Set headers to establish SSE
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // Send a comment to keep the connection alive in some proxies
  res.write(':\n\n')

  const clientId = "Junerey"

  clients.set(clientId, res)
  console.log(`Client ${clientId} connected`)

  // Remove the client when the connection is closed
  req.on('close', () => {
    clients.delete(clientId)
    console.log(`Client ${clientId} disconnected`)
  })
})

const sendEvent = (data) => {
  const client = clients.get("Junerey")
  if (client) {
    client.write(`data: ${JSON.stringify(data)}\n\n`)
  }
}

app.post('/send-message', (_, res) => {
  const eventData = {
    type: 'export_complete',
    downloadUrl: 'https://plus.unsplash.com/premium_photo-1682125748265-d362c809ba04?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }

  // send the event after 5 seconds
  setTimeout(() => {
    sendEvent(eventData)
  }, 5000)

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
