import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import bcrypt from 'bcrypt'
import { generateToken } from "../utils/jwt";

const prisma = new PrismaClient()

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try{
    const { email, password } = req.body

    const users = await prisma.user.findUnique({
      where: {email}
    })
    if (!users) {
      res.status(400).json({
        error: 'authentication failed',
        message: 'email is not found'
      });
      return;
    }

    const isValidPassword = await bcrypt.compare(
      password,
      users.password
    )
    if (!isValidPassword) {
      res.status(401).json({
        error: 'Autentikasi gagal', 
        message: 'kata sandi salah' 
      });
      return;
    }

    const token = generateToken(users)

    res.setHeader('X-User-ID', users.id)

    res.status(200).json({
      message: 'Login success',
      token,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username,
        role: users.role
      }
    })
  } catch (error) {
    console.log("error", error)
    res.status(500).json({ error: 'Login failed' })
  }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const token  = req.headers.authorization?.split(' ')[1]

    if (!token) {
      res.status(401).json({
        error: 'token not found',
        message: 'you must login first'
      })
    }
    if (token) {
      await prisma.tokenBlacklist.create({
        data: {
          token: token,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      })
    } else {
      throw new Error('Token not found');
    }

    res.status(200).json({
      message: 'Logout success',
    })
  } catch (err) {
    res.status(500).json({
      message: 'logout is failed'
    })
  }
}