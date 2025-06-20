import { Prisma, PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";

const prisma = new PrismaClient()

export const findMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const findUsers = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        ownedProjects: true,
        projectMemberShip: {
          include: {
            user: true
          }
        },
        tickets: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true
          }
        }
      }
    })

    if (findUsers) {
      res.status(404).json({
        message: 'user is not found'
      })
    }

    res.status(200).json({
      success: true,
      data: { 
        findUsers
      }
    })

  } catch (err) {
    res.status(500).json({
      message: err,
      sucess: false
    })
  }
}