import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import { generatePassword } from "../../shared/generatePassword";

const prisma = new PrismaClient()

export const findAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany()
    res.status(200).json({
      message: 'find all users',
      users
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: `Failed to fetch users: ${err}` })
  }
}

export const findUsersById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const findUserById = await prisma.user.findUnique({
      where: { id },
      include: {
        projectMemberShip: true,
        tickets: true,
        Comment: true
      }
    });

    console.log("user", findUserById)
    
    if (!findUserById) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.status(200).json({
      message: 'success',
      user: findUserById
    });
  } catch (err) {
    res.status(500).json({ error: `failed get user by id ${err}` });
  }
};


export const createUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, username, password, role } = req.body;
    
    // Validasi input
    if (!name || !email || !username || !password || !role) {
      res.status(400).json({
        success: false,
        message: "Semua field harus diisi"
      });
      return;
    }

    const users = await prisma.user.create({
      data: {
        name,
        email,
        username,
        password: await generatePassword(password),
        role
      }
    });

    res.status(201).json({
      success: true,
      message: "User berhasil dibuat",
      data: users
    });

  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({
      success: false,
      message: "Gagal membuat user"
    });
  }
};