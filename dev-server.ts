// dev-server.ts
import { createServer } from 'http'
import { Server } from 'socket.io'
import app from './api/app'

const handler = app
const server = createServer(handler)
const io = new Server(server, {
  cors: { origin: '*' },
})

server.setTimeout(55_000)

io.on('connection', (socket) => {
  console.log('a user connected')
})

// Removed unused timeout block as 'res' is not defined in this context

server.listen(3001, () => {
  console.log('🚀 Local dev server: http://localhost:3001')
})
