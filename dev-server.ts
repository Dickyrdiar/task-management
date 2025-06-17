// dev-server.ts
import { createServer } from 'http'
import { Server } from 'socket.io'
import { handler } from './src/app'

const app = handler()
const server = createServer(app)
const io = new Server(server, {
  cors: { origin: '*' },
})

io.on('connection', (socket) => {
  console.log('a user connected')
})

server.listen(3001, () => {
  console.log('🚀 Local dev server: http://localhost:3001')
})
