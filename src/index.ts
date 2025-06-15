import { type Handler, type HandlerResponse } from '@netlify/functions';
import express from "express";
import cors from 'cors';
import projectRoutes from './routes/projectRoutes'
import userRouter from './routes/userRoutes'
import authRouter from './routes/authRoutes'
import ticketRouter from './routes/ticketRoutes'
import LoginGithub from './routes/githubAuthRoutes'
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
app.use('/api/githubLogin', LoginGithub)
app.use('/api/projects', authMiddleware, projectRoutes)
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/projects/:projectId/tickets', authMiddleware, ticketRouter)

// serverles 



app.get("/", (req, res) => {
  res.status(200).json("Express + TypeScript + Bun + Prisma API");
});


// serverles
export const handler: Handler = async (event, context) => {
  return new Promise<HandlerResponse>((resolve) => {
    const { httpMethod: method, path, headers, queryStringParameters, body } = event;
    
    const req = Object.assign({}, express.request, {
      method,
      originalUrl: path,
      path,
      headers,
      query: queryStringParameters,
      body: body ? JSON.parse(body) : null,
      url: path,
    });
    
    const res = {
      statusCode: 200,
      headers: {} as { [key: string]: string },
      setHeader(key: string, value: string) {
        this.headers[key] = value;
      },
      end(data: string) {
        resolve({
          statusCode: this.statusCode,
          headers: this.headers,
          body: data,
        });
      },
      json(data: any) {
        this.setHeader('Content-Type', 'application/json');
        this.end(JSON.stringify(data));
      }
    };
    
    app(req, res as any, () => {
      (res as any).statusCode = 404;
      (res as any).end('Not Found');
    });
  });
};

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
})