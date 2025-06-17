// /api/index.ts
import { createServer } from 'http'
import express from 'express'
import { Server } from 'socket.io'
import { handler } from '../src/app' // We move your Express app to a separate file
import { type VercelRequest, type VercelResponse } from '@vercel/node'

const app = handler()

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  console.log(' a user connection')

  socket.on('new comment', (comment) => {
    io.emit('commentAdd', comment)
  })

  socket.on('disconnect', () => {
    console.log('User disconnect')
  })
})


// local run 
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001
  server.listen(PORT, () => {
    console.log(`🚀 Local server running at http://localhost:${PORT}`)
  })
}

export default (req: VercelRequest, res: VercelResponse) => {
  app(req, res)
}
