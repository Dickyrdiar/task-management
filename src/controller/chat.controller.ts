import { Prisma, PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import type { Server } from "socket.io";

const prisma = new PrismaClient()
let io: Server

export const setSocketIO = (socketServer: Server) => {
  io = socketServer
}

export const findAllChatController = async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await prisma.comment.findMany()
    res.status(200).json({
      message: 'success',
      data: messages
    })
  } catch (err) {
    res.status(500).json({
      message: 'cannot fetch all message'
    })
  }
}

export const createComment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { content, ticketId, userId } = req.body

    if (!content || !ticketId || !userId) {
      res.status(400).json({ message: 'Content, ticketId, and userId are required' });
    }
    const comment = await prisma.comment.create({
      data: {
        content,
        ticketId: ticketId.toString(),
        userId: userId.toString(),
      }
    })

    io.emit('newComment', comment)

    res.status(200).json({
      success: true,
      data: comment
    })

  } catch (err) {
    res.status(500).json({
      message: 'failed to create comment'
    })
  }
}