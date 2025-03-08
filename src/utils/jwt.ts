import jwt from 'jsonwebtoken'
import type { User } from '@prisma/client'
import type { TokenPayload } from '../lib/schema/token_payload'

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