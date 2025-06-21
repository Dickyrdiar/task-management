import { type VercelRequest, type VercelResponse } from '@vercel/node'
import app from './app'

export default function (req: VercelRequest, res: VercelResponse) {

  const timeout = setTimeout(() => {
    if (res.headersSent) {
      res.status(503).json({
          error: 'Request timed out. Please try again later.',
      })
    }
  }, 55_000)

  app(req, res) 

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