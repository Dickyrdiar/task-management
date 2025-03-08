import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

// Extend Request type untuk menyimpan data user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        username: string;
      }
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Ambil token dari header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'you are not authorized' });
      return;
    }

    // Verifikasi token
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({ message: 'you are not authorized' });
      return;
    }

    // Simpan data user ke request
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
