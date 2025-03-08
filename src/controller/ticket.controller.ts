import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";

const prisma = new PrismaClient()

export const findAllTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const tickets = await prisma.ticket.findMany()
    res.status(200).json({
      message: 'success',
      data: {
        tickets
      }
    })
  } catch (err) {
    res.status(500).json({
      message: 'fetch all ticket is failed'
    })
  }
}

export const findTicketById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params

    const findTicket = await prisma.ticket.findUnique({
      where: {
        id: ticketId
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
      message: 'fetch ticket by id is failed'
    })
  }
}

export const createTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    // Check if userId exists
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User is not found',
      });
      return; // Ensure the function exits after sending the response
    }

    // Find the user in the database
    const findUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // Check if the user has the required role (PM or QA)
    if (!findUser || (findUser?.role !== 'PM' && findUser?.role !== 'QA')) {
      res.status(403).json({ message: 'Cannot create a ticket; you are not a PM or QA' });
      return; // Ensure the function exits after sending the response
    }

    const { projectId } = req.body;

    // Check if projectId is provided
    if (!projectId) { // Fix: Check if projectId is falsy
      res.status(400).json({
        message: 'Project ID is required',
      });
      return; // Ensure the function exits after sending the response
    }

    // Find the project in the database
    const findProject = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    // Check if the project exists
    if (!findProject) {
      res.status(404).json({
        message: 'Project not found',
      });
      return; // Ensure the function exits after sending the response
    }

    // Extract ticket details from the request body
    const { status, title, priority } = req.body;

    // Create the ticket in the database
    const ticket = await prisma.ticket.create({
      data: {
        title,
        status,
        priority,
        userId,
        projectId,
      },
    });

    // Send a success response
    res.status(201).json({
      message: 'Ticket created successfully',
      data: {
        ticket,
      },
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({
      message: 'Failed to create ticket',
    });
  }
};

export const changeStatusAndPrio = async (req: Request, res: Response): Promise<void> => {
  try {

    const { projecId, userId } = req.body

    if (!projecId) {
      res.status(404).json({
        message: 'project is not found'
      })
    }

    const project = prisma.project.findUnique({
      where: {
        id: projecId
      }
    })

    if (!project) {
      res.status(404).json({
        message: 'project is not found'
      })
    }

    if (!userId) {
      res.status(404).json({
        message: 'User is not found'
      })
    }

    const user = prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user) {
      res.status(404).json({
        message: 'User is not found'
      })
    }


  } catch (err) {
    res.status(500).json({
      message: 'failed to update ticket'
    })
  }

  const { status, title, priority } = req.body;
  const { ticketId } = req.params

  const updatedTicket = await prisma.ticket.update({
    where: {
      id: ticketId
    },
    data: {
      title,
      status,
      priority
    }
  })

  res.status(200).json({
    success: true,
    message: 'ticket has been update',
    data: { 
      updatedTicket
    }
  })
}

export const deletedTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body

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
  } catch (err) {
    res.status(500).json({
      message: 'ticket cannot deleted'
    })
  }
}