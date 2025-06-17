import { type VercelRequest, type VercelResponse } from '@vercel/node'
import app from '../src/app'

export default function (req: VercelRequest, res: VercelResponse) {
  app(req, res) // langsung proxy request ke Express
}