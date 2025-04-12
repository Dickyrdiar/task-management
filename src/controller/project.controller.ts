import { PrismaClient, ProjectRole } from "@prisma/client";
import type { Request, Response } from "express";

const prisma = new PrismaClient()

export const findAllProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await prisma.project.findMany({
      include: {
        ProjectMember: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        },
        owner: true,
        tickets: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          }
        }
      }
    })
    res.json(project)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: `failed to cathc all project, ${err}`  })
  }
}

export const findProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({ 
        success: false,
        message: 'Project ID is required' 
      });
      return;
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: true,
        ProjectMember: {
          include: {
            user: true
          }
        },
        tickets: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          }
        }
      }
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get project'
    });
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "user not found"
      })
      return
    }


    const { name, description } = req.body;
    const findUser = await prisma.user.findUnique({
      where: { 
        id: userId,
        role: "PM" 
      }
    })

    if (findUser?.role !== "PM" && findUser?.role !== "QA") {
      res.status(500).json({ message: 'cannot create project you are not PM' })
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: userId,
      }
    });

    res.status(201).json({
      success: true,
      data: {
        project,
        owner: findUser,
      }
    })

  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat membuat project"
    });
  }
}

export const addUserToProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, userId, role } = req.body

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project) {
       res.status(400).json({
        success: false,
        message: 'Project not found'
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'User not found'
      })
    }

    const existingMembers = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId
        }
      }
    })

    if (existingMembers) {
      res.status(400).json({
        success: false,
        message: 'User has members in his project'
      })
    }

    const projectMember = await prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role: role as ProjectRole
      },
      include: {
        user: true,
        project: true
      }
    })

    res.status(201).json({
      success: true,
      data: projectMember
    })

  } catch (err) {
    console.log("error", err)
  }
}

export const deletedProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projeId } = req.params
    const { userId } = req.body
    const users = prisma.user.findUnique({
      where: {
        id: userId,
        role: 'PM'
      }
    })

    if (!users) {
      res.status(400).json({
        message: 'only PM can deleted project'
      })
    }

    const deletedProject = prisma.project.delete({
      where: {
        id: projeId
      }
    })

    res.status(200).json({
      success: true,
      data: deletedProject,
      message: 'project success deleted'
    })

  } catch (err) {
    console.log("error", err)
  }
}