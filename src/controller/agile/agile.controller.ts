import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";

const prisma = new PrismaClient()

export const CreateAgile = async (req: Request, res: Response): Promise<void> => {
  const { userId, projectId, sprintNumber } = req.body

  try {
    const users = await prisma.user.findUnique({
      where: { 
        id: userId
       }
    })

    const projects = await prisma.project.findUnique({
      where: {
        id: projectId
      }
    })

    if (!users || !projects) {
      res.status(400).json({
        message: 'id is not found',
      })
    }

    const agiled = await prisma.agile.create({
      data: {
        userId,
        projectId,
        sprintNumber
      }
    })

    res.status(201).json({
      success: true,
      message: 'sprint has been created',
      data: agiled
    })

  } catch (err) {
    res.status(500).json({
      message: 'failed create agile',
      error: err
    })
  }
} 

export const findAllSprint = async (res: Response): Promise<void> => {
  try {
    const agiles = await prisma.agile.findMany()
    res.status(200).json({
      message: 'find all sprint',
      data: agiles
    })
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch users: ${err}` })
  }
}