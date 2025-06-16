import type { Handler, HandlerResponse } from '@netlify/functions';
import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import projectRoutes from '../../src/routes/projectRoutes';
import userRouter from '../../src/routes/userRoutes';
import authRouter from '../../src/routes/authRoutes';
import ticketRouter from '../../src/routes/ticketRoutes';
import LoginGithub from '../../src/routes/githubAuthRoutes';
import { authMiddleware } from "../../src/middleware/auth.middleware";

// Create Express app instance
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/githubLogin', LoginGithub);
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/projects/:projectId/tickets', authMiddleware, ticketRouter);

app.get("/", (req, res) => {
  res.status(200).json("Express + TypeScript + Bun + Prisma API");
});
// Netlify Function Handler
const handler: Handler = async (event, context) => {
  const result = await serverless(app)(event, context);
  return result as HandlerResponse;
};

export { handler };