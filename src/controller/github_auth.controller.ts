import type { Request, Response } from "express"
import { generateToken } from "../utils/jwt"

export const authGithubController = (req: Request, res: Response): void => {
  const { id, email, name } = req.body
  try {
    if (!id || !email || !name) {
      res.status(401).json({ message: 'Authentication failed' })
    }
    const token = generateToken(id && email && name)

    res.json({
      success: true,
      token,
      user: {
        id: id,
        email: email, 
        name: name
      }
    })
  } catch (error) {
    console.error('Error dalam callback GitHub:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}