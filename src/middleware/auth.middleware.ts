import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';


interface User {
  id: string;
  email: string;
  role: string;
  username: string;
}

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: string;
      username: string;
    }
  }
}
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    console.log('[AUTH] Incoming Header:', authHeader);

    if (!authHeader?.startsWith('Bearer ')) {
      console.log('[AUTH] Missing Bearer token');
      res.status(401).json({ message: 'you are not authorized' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    console.log('[AUTH] Decoded:', decoded);

    if (!decoded) {
      console.log('[AUTH] Token invalid or expired');
      res.status(401).json({ message: 'you are not authorized' });
      return;
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      username: decoded.username
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
