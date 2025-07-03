import jwt from 'jsonwebtoken'
import type { User } from '@prisma/client'
import type { TokenPayload } from '../lib/schema/token_payload.js'

export const generateToken = (user: User) => {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    username: user.username,
    password: user.password
  }

  return jwt.sign(
    payload, 
    process.env.JWT_SECRET!, 
    { expiresIn: '24h' }
  )
}

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(
      token, 
      process.env.JWT_SECRET!
    ) as TokenPayload
  } catch (error) {
    return null
  }
}
export const generateRefreshToken = (payload: object) => {
  const secret = process.env.REFRESH_TOKEN;
  if (!secret) {
    throw new Error('REFRESH_TOKEN secret is not defined');
  }
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const verifyRefreshToken = (token: string) => {
  const secret = process.env.REFRESH_TOKEN;
  if (!secret) {
    throw new Error('REFRESH_TOKEN secret is not defined');
  }
  return jwt.verify(token, secret);
};