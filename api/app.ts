import express from 'express'
import cors from 'cors'
import projectRoutes from '../src/routes/projectRoutes'
import userRouter from '../src/routes/userRoutes'
import authRouter from '../src/routes/authRoutes'
import ticketRouter from '../src/routes/ticketRoutes'
import lognWithGithub from '../src/routes/githubAuthRoutes'
import { authMiddleware } from '../src/middleware/auth.middleware'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/loginWithGithub', lognWithGithub)
app.use('/api/projects', authMiddleware, projectRoutes)
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/projects/:projectId/tickets', authMiddleware, ticketRouter)

app.get("/", (req, res) => {
  res.status(200).json("Express + TypeScript + Bun + Prisma API")
})

export default app
