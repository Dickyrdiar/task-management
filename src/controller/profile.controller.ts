import { Prisma, PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";

const prisma = new PrismaClient()

export const findMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User is not found'
      })
    
    }
  } catch (err) {
    res.status(500).json({
      message: err,
      sucess: false
    })
  }
}