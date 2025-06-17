import { type VercelRequest, type VercelResponse } from '@vercel/node'
import { handler } from '../src/app'

const app = handler()

export default function (req: VercelRequest, res: VercelResponse) {
  app(req, res)
}


