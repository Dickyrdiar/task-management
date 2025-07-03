import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";

const prisma = new PrismaClient()

export const CreateAgile = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params
  const { userId, sprintNumber } = req.body

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

    // authority
    if (users?.role !== 'PM') {
      res.status(500).json({
        message: 'cannot create agile system'
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

export const findAllSprint = async (req: Request, res: Response): Promise<void> => {
  try {
    const agiles = await prisma.agile.findMany()
    console.log("agile", agiles)

    res.status(200).json({
      message: 'find all sprint',
      data: agiles
    })
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch users: ${err}` })
  }
}

export const agileSystemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'agile by id is not found'
      })
    }

    const agileSystem = await prisma.agile.findUnique({
      where: { id },
      include: {
        user: true,
        project: {
          select: { 
            name: true, 
            description: true,
            projectMembers: true
          }
        },
        tickets: {
          select: {
            title: true,
            status: true,
            assignments: true
          }
        }
      }
    })

    console.log("agile", agileSystem)

    res.status(200).json({
      success: true,
      data: agileSystem
    })

  } catch (err) {
    res.status(500).json({
      message: 'failed agile by id',
      error: err
    })
  }
}

export const CaryOverTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prevoiuseSrpint, newSprint } = req.body

    const unfinishedTicket = await prisma.ticket.findMany({
      where: {
        agileId: prevoiuseSrpint,
        NOT: {
          status: 'CLOSED'
        }
      }
    })

    const updated = await Promise.all(
      unfinishedTicket.map(ticket => 
        prisma.ticket.update({
          where: { id: ticket.id },
          data: {
            agileId: newSprint
          }
        })
      )
    )

    res.status(200).json({
      message: 'carried ticket is successfuly',
      total: updated.length
    })
  } catch (err) {
    res.status(500).json({
      message: 'cary on sprint is failed'
    })
  }
}