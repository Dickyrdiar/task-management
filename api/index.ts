// api/index.ts

import { type VercelRequest, type VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import projectRoutes from '../src/routes/projectRoutes.js';
import userRouter from '../src/routes/userRoutes.js';
import authRouter from '../src/routes/authRoutes.js';
import ticketRouter from '../src/routes/ticketRoutes.js';
// import lognWithGithub from '../src/routes/githubAuthRoutes.js'
import { authMiddleware } from '../src/middleware/auth.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

// app.use('/api/loginWithGithub', lognWithGithub)
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/projects/:projectId/tickets', authMiddleware, ticketRouter);

app.get('/', (_req, res) => {
  res.status(200).json('Express + TypeScript + Bun + Prisma API');
});

// === Vercel-compatible Handler ===
export default function handler(req: VercelRequest, res: VercelResponse) {
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(503).json({
        error: 'Request timed out. Please try again later.',
      });
    }
  }, 55_000);

  app(req, res); // pass to express

  const originalEnd = res.end;
  res.end = function (
    chunkOrCb?: any | (() => void),
    encodingOrCb?: BufferEncoding | (() => void),
    cb?: () => void
  ) {
    clearTimeout(timeout);
    if (typeof chunkOrCb === 'function') {
      return originalEnd.call(this, chunkOrCb, '' as BufferEncoding, undefined);
    }
    if (typeof encodingOrCb === 'function') {
      return originalEnd.call(this, chunkOrCb, '' as BufferEncoding, encodingOrCb);
    }
    return originalEnd.call(this, chunkOrCb, encodingOrCb ?? '' as BufferEncoding, cb);
  };
}
