import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient()

export const findAllCommentByticket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const findTicket = await prisma.ticket.findUnique({
      where: {
        id
      }
    })

    if (!findTicket) {
      res.status(400).json({
        message: 'Ticket not found'
      }); 
    }

    const allComment = await prisma.comment.findMany({
      where: {
        ticketId: id
      },
      include: {
        ticket: {
          select: {
            title: true,
            status: true,
            priority: true,
            projectId: true
          }
        }
      }
    })

  // lanjutkan logikamu di sini
  res.status(200).json({ message: 'success',
    data: allComment
   });
  } catch (err) {
    res.status(500).send({
      message: 'failed to fetch'
    })
  }
};

export const CreateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { content, userId } = req.body

    const users = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!users) {
       res.status(404).json({
        message: 'users is not found'
      })
    }

    const CommentTicket = await prisma.comment.create({
      data: {
        content,
        ticket: {
          connect: { id }
        },
        user: {
          connect: { id: userId }
        }
      }
    })

    res.status(201).json({
      message: 'comment is succed',
      data: CommentTicket
    })

  } catch(err) {
    res.status(500).json({
      message: 'failed to create comment',
      error: err
    })
  }
}

export const DeletedComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { commentId, userId } = req.body

    const findUser = await prisma.user.findUnique({
      where: {
        id: userId,
      }
    })

    if (!findUser) {
       res.status(400).json({
        message: 'only PM or QA cant deleted comment '
      })
    }

    const deletedComment = prisma.comment.delete({
      where: {
        id: commentId
      }
    })

    res.status(200).json({
      success: true,
      message: 'ticket has been deleted',
      data: {
        deletedComment
      }
    })
  } catch (err) {
    res.status(500).json({
      message: 'deleted is failed',
      error: err
    })
  }

}