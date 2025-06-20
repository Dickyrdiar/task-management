import { loginUser, logout } from '../../src/controller/users/auth.controller';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken } from '../../src/utils/jwt';

jest.mock('@prisma/client', () => {
  const mPrisma = {
    user: {
      findUnique: jest.fn(),
    },
    tokenBlacklist: {
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

jest.mock('bcrypt');
jest.mock('../src/utils/jwt');

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn();
  return res;
};

describe('Auth Controller', () => {
  const prisma = new PrismaClient() as any;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should login successfully', async () => {
      const req: any = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };

      const userMock = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        role: 'user',
        password: 'hashedPassword123',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue('mockToken');

      const res = mockResponse();

      await loginUser(req, res);

      expect(res.setHeader).toHaveBeenCalledWith('X-User-ID', '1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login success',
        token: 'mockToken',
        user: {
          id: userMock.id,
          name: userMock.name,
          email: userMock.email,
          username: userMock.username,
          role: userMock.role,
        },
      });
    });

    it('should fail if user not found', async () => {
      const req: any = {
        body: {
          email: 'wrong@example.com',
          password: 'password123',
        },
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const res = mockResponse();
      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'authentication failed',
        message: 'email is not found',
      });
    });

    it('should fail if password is incorrect', async () => {
      const req: any = {
        body: {
          email: 'test@example.com',
          password: 'wrongpass',
        },
      };

      const userMock = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        role: 'user',
        password: 'hashedPassword123',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const res = mockResponse();
      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Autentikasi gagal',
        message: 'kata sandi salah',
      });
    });
  });

  describe('logout', () => {
    it('should logout successfully with token', async () => {
      const req: any = {
        headers: {
          authorization: 'Bearer mocktoken123',
        },
      };

      const res = mockResponse();

      await logout(req, res);

      expect(prisma.tokenBlacklist.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          token: 'mocktoken123',
        }),
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logout success',
      });
    });

    it('should fail logout if no token provided', async () => {
      const req: any = {
        headers: {},
      };

      const res = mockResponse();
      await logout(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'token not found',
        message: 'you must login first',
      });
    });
  });
});
