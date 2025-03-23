import type { Request, Response } from "express"

export const authGithubController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication failed' })
    }
  } catch (err) {
    
  }
}