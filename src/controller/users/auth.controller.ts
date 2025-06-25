import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import bcrypt from 'bcrypt'
import { generateRefreshToken, generateToken, verifyRefreshToken } from "../../utils/jwt";
// import { generateToken } from "../utils/jwt";

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

    const accessToken = generateToken(users)
    const RefreshToken = generateRefreshToken(users)

    await prisma.user.update({
      where: { id: users.id },
      data: { 
        refreshTokens: {
          create: {
            token: RefreshToken,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        }
      }
    })

    res.setHeader('X-User-ID', users.id)

    res.status(200).json({
      message: 'Login success',
      accessToken,
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

export const RefreshTokn = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    res.status(400).json({
      error: "Refresh token required"
    })
  }

  try {

    const payload = verifyRefreshToken(refreshToken) as { id: string };

    const user = await prisma.user.findUnique({
      where: {id: payload.id}
    })

    if (!user || !user.id || !user.username || !user.role) {
      res.status(401).json({
        error: "Invalid user or user data missing"
      });
      return;
    }

    const newAccessToken = generateToken(user)

    res.json({ accessToken: newAccessToken });

  } catch (err) {
    res.status(500).json({
      message: 'failed refresh token',
      error:  err
    })
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
      error: err,
      message: 'logout is failed'
    })
  }
}