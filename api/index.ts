import { type VercelRequest, type VercelResponse } from '@vercel/node';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import app from './app';

// === Vercel Handler ===
export default function handler(req: VercelRequest, res: VercelResponse) {
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(503).json({
        error: 'Request timed out. Please try again later.',
      });
    }
  }, 55_000);

  // Run express as middleware
  app(req, res)

  // Clear timeout after response ends
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
