import { handler } from '../src/app'
import { type VercelRequest, type VercelResponse } from '@vercel/node'

const app = handler()

export default function (req: VercelRequest, res: VercelResponse) {
  app(req, res)
}


