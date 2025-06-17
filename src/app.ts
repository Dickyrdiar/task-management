import express from 'express'
import cors from 'cors'
import projectRoutes from './routes/projectRoutes'
import userRouter from './routes/userRoutes'
import authRouter from './routes/authRoutes'
import ticketRouter from './routes/ticketRoutes'
import LoginGithub from './routes/githubAuthRoutes'
import { authMiddleware } from './middleware/auth.middleware'

export const handler = () => {
  const app = express()
  app.use(cors())
  app.use(express.json())

  // routes
  app.use('/api/githubLogin', LoginGithub)
  app.use('/api/projects', authMiddleware, projectRoutes)
  app.use('/api/users', userRouter)
  app.use('/api/auth', authRouter)
  app.use('/api/projects/:projectId/tickets', authMiddleware, ticketRouter)

  app.get("/", (req, res) => {
    res.status(200).json("Express + TypeScript + Bun + Prisma API");
  })

  return app
}
