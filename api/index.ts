import { type VercelRequest, type VercelResponse } from '@vercel/node'
import app from './app'

export default function (req: VercelRequest, res: VercelResponse) {
  app(req, res) 
}