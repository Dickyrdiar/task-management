import express from "express";
import cors from 'cors';
import projectRoutes from './routes/projectRoutes'
import userRouter from './routes/userRoutes'
import authRouter from './routes/authRoutes'
import ticketRouter from './routes/ticketRoutes'
import { authMiddleware } from "./middleware/auth.middleware";
import http from 'http'
import { Server } from "socket.io";

const app  = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(cors())
app.use(express.json())

// socket .IO connection
io.on('connection', (socket) => {
  console.log(' a user connection')

  socket.on('new comment', (comment) => {
    io.emit('commentAdd', comment)
  })

  socket.on('disconnect', () => {
    console.log('User disconnect')
  })
})

// routes
app.use('/api/projects', authMiddleware, projectRoutes)
app.use('/api/users', authMiddleware, userRouter)
app.use('/api/auth', authRouter)
app.use('/api/projects/:projectId/tickets', authMiddleware, ticketRouter)

app.get("/", (req, res) => {
  res.status(200).json("Express + TypeScript + Bun + Prisma API");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
})