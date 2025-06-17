import { type VercelRequest, type VercelResponse } from '@vercel/node'
import { handler } from '@/app'

const app = handler()

export default function (req: VercelRequest, res: VercelResponse) {
  app(req, res)
}


