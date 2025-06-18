import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import Redis from "ioredis";
import redis from "../../shared/redisClient";



const prisma = new PrismaClient()

export const searchTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paramsSearch } = req.params


    // const reasultSearch = await prisma.ticket.findUnique({
    //   where: {  }
    // })
  } catch (err) {
    res.status(500).json({
      message: 'fetch all ticket is failed'
    })
  }
}

export const findAllTicket = async (req: Request, res: Response): Promise<void> => {
  try {

    const tickets = await prisma.ticket.findMany({
      include: {
        project: true,
      }
    })
    
    const ticket = await redis.get(`ticket: ${tickets}`)
    res.status(200).json({
      message: 'success',
      data: {
       tickets
      },
    })
  } catch (err) {
    res.status(500).json({
      message: 'fetch all ticket is failed'
    })
  }
}

export const findTicketById = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticketId = req.params.id

    const findTicket = await prisma.ticket.findUnique({
      where: {
        id: String(ticketId)
      }
    })  
    
    res.status(200).json({
      success: true,
      data: {
        findTicket
      }
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'fetch ticket by id is failed',
      error: err
    })
  }
}

export const createTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const {  status, title, priority, assignments = [] } = req.body; // Default assignments to an empty array
    const { projectId } = req.params;


    // Check if projectId is provided
    if (!projectId) {
       res.status(400).json({ message: 'Project ID is required' });
    }

    // Find the project by projectId
    const findProject = await prisma.project.findUnique({ where: { id: projectId } });

    // Check if project exists
    if (!findProject) {
       res.status(404).json({ message: 'Project not found' });
    }


    // Create the ticket
    const ticket = await prisma.ticket.create({
      data: {
        title,
        status,
        priority,
        projectId,
        assignments: {
          connect: assignments.map((id: string) => ({ id })) // Ensure you are mapping over the correct field
        }
      },
    });

    res.status(201).json({ message: 'Ticket created successfully', data: { ticket } });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: 'Failed to create ticket' });
  }
};


export const changeStatusAndPrio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, id } = req.params;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId
      }
    });

    const { status, title, priority, assignments } = req.body;


    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', ' CRITICAL']
    if (priority || !validPriorities.includes(priority)) {
      res.status(400).json({ message: 'Invalid priority value' });
    }

    const updatedTicket = await prisma.ticket.update({
      where: {
        id: id
      },
      data: {
        title,
        status,
        priority,
        projectId,
        assignments: {
          connect: assignments.map((id: string) => ({ id }))
        }
      }
    })

    res.status(200).json({
      success: true,
      message: 'ticket has been update',
      data: { 
        updatedTicket
      }
    })

    if (!project) {
      res.status(404).json({
        message: 'project is not found'
      })
    }


  } catch (err) {
    console.error("error", err)
    res.status(500).json({
      message: 'failed to update ticket'
    })
  }
  
}

export const CommentTicker =  async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId, userId, content } = req.body

    const tickets = await prisma.ticket.findUnique({
      where: { id: ticketId }
    })

    if (!tickets) {
      res.status(404).json({
        message: 'tickets is not found'
      })
    }

    const users = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!users) {
       res.status(404).json({
        message: 'users is not found'
      })
    }

    const commentTicket = await prisma.comment.create({
      data: {

        ticketId,
        userId,
        content
      }
    })

    res.status(201).json({
      message: 'comment has been added',
      data: {
        commentTicket
      }
    })

  } catch (err) {
    res.status(500).json({
      message: 'comment is not send'
    })
  }
}

export const findAllCommentByticket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params
    console.log("id", ticketId)

    const findTicket = await prisma.ticket.findUnique({
      where: {
        id: ticketId
      }
    })

    if (!findTicket) {
      res.status(400).json({
        message: 'Ticket not found'
      });
    }

    const allComment = await prisma.comment.findMany({
      where: {
        ticketId: ticketId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        ticket: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          }
        }
      },
    })

    res.status(200).json({
      message: 'get all data',
      data: allComment
    })
  } catch (err) {
    res.status(500).send({
      message: 'Cannot fetch comment',
      error: err
    })
  } finally {
    await prisma.$disconnect()
  }
}

export const deletedTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body
    const { ticketId } = req.params;

    const ticketWithId = await prisma.ticket.findUnique({
      where: {
        id: ticketId
      }
    })

    const users = await prisma.user.findUnique({
      where: {
       id: userId,
       role: {
         in: ['PM', 'QA']
       }
      }
    })

    if (!users ) {
      res.status(400).json({
        message: 'only PM or QA cant deleted ticket '
      })
    }

    const deleteTicket = prisma.ticket.delete({
      where: {
        id: ticketWithId?.id
      }
    })

    res.status(200).json({
      success: true,
      message: 'ticket has been deleted',
      data: {
        deleteTicket
      }
    })
  } catch (err) {
    res.status(500).json({
      message: 'ticket cannot deleted'
    })
  }
}