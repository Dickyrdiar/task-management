import { PrismaClient, ProjectRole } from "@prisma/client";
import type { Request, Response } from "express";

const prisma = new PrismaClient()

export const findAllProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await prisma.project.findMany({
      include: {
        projectMembers: {
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
        projectMembers: {
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
    const userId = req?.user

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "user not found"
      })
      return
    }

    const { name, description } = req.body;

    if (userId?.role !== 'PM' && userId?.role !== 'QA') {
       res.status(500).json({ message: 'cannot create project you are not PM' })
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: userId.id,
      },
      include: {
        owner: true
      }
    });

    const addCreatorIntoMember = await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: project.ownerId,
        role: project.ownerId !== null ? 'OWNER' : 'MEMBER'
      }
    })

    res.status(201).json({
      success: true,
      data: {
        project,
        owner: addCreatorIntoMember,
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
    const { userId, role} = req.body;
    const { projectId } = req.params;

    console.log('params:', projectId);

    if (!projectId) {
      res.status(400).json({
        success: false,
        message: 'Project ID is required in URL parameters',
      });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: true,
        projectMembers: {
          include: {
            user: true
          }
        },
        tickets: true
      }
    });

    console.log("project", project)

    if (!project) {
      res.status(400).json({
        success: false,
        message: 'Project not found'
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId
        }
      }
    });

    if (existingMember) {
      res.status(400).json({
        success: false,
        message: 'User is already a member of this project'
      });
    }

    const isOwner = project.ownerId === userId;

    const projectMember = await prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role: isOwner ? 'OWNER' : (role as ProjectRole || 'MEMBER')
      },
      include: {
        user: true,
        project: true
      }
    });

    console.log("project", projectMember)

    const updatedProject = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: true,
        projectMembers: {
          include: {
            user: true
          }
        },
        tickets: true
      }
    });

    res.status(201).json({
      success: true,
      data: updatedProject
    });
  } catch (err) {
    console.error('Error adding user to project:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deletedMemberProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId  } = req.params
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user) {
      res.status(404).json({
        message: 'user is not found'
      })
    }

    const deletedMember = await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId: req.params.projectId,
          userId: userId
        }
      }
    })

    res.status(201).json({
      message: 'user has been delete from member proeject',
      data: deletedMember
    })
  } catch (err) {
    res.status(500).json({
      message: 'failed deleted member'
    })
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