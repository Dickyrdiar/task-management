// dev-server.ts
import { createServer } from 'http'
import { Server } from 'socket.io'
import app from './api/app'

const handler = app
const server = createServer(handler)
const io = new Server(server, {
  cors: { origin: '*' },
})

io.on('connection', (socket) => {
  console.log('a user connected')
})

server.listen(3001, () => {
  console.log('🚀 Local dev server: http://localhost:3001')
})
