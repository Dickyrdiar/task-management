import request from 'supertest';
import express from 'express';
import { findAllTicket, findTicketById, createTicket, changeStatusAndPrio, deletedTicket } from '../../src/controller/tickets/ticket.controller'; // Replace with actual file path
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    ticket: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    project: {
      findUnique: jest.fn(),
    }
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.get('/tickets', findAllTicket);
app.get('/tickets/:ticketId', findTicketById);
app.post('/tickets', createTicket);
app.put('/tickets/:ticketId', changeStatusAndPrio);
app.delete('/tickets/:ticketId', deletedTicket);

describe('Ticket API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('GET /tickets harus mengembalikan semua tiket', async () => {
    prisma.ticket.findMany = jest.fn().mockResolvedValue([{ id: '1', title: 'Bug Fix' }]);
    const res = await request(app).get('/tickets');
    expect(res.status).toBe(200);
    expect(res.body.data.tickets).toHaveLength(1);
  });
  test('GET /tickets/:ticketId should return a ticket', async () => {
    prisma.ticket.findUnique = jest.fn().mockResolvedValue({ id: '1', title: 'Bug Fix' });
    const res = await request(app).get('/tickets/1');
    expect(res.status).toBe(200);
    expect(res.body.data.findTicket.id).toBe('1');
  });
  test('POST /tickets should create a ticket', async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue({ id: '1', role: 'PM' });
    prisma.project.findUnique = jest.fn().mockResolvedValue({ id: '100' });
    prisma.ticket.create = jest.fn().mockResolvedValue({ id: '10', title: 'New Ticket' });
    const res = await request(app).post('/tickets').send({ projectId: '100', title: 'New Ticket', status: 'Open', priority: 'High' }).set('Authorization', 'Bearer 1');
    expect(res.status).toBe(201);
    expect(res.body.data.ticket.id).toBe('10');
    
  test('PUT /tickets/:ticketId should update a ticket', async () => {
    prisma.ticket.update = jest.fn().mockResolvedValue({ id: '1', title: 'Updated Ticket' });
    const res = await request(app).put('/tickets/1').send({ title: 'Updated Ticket', status: 'Closed', priority: 'Medium', projectId: '100', userId: '1' });
    expect(res.status).toBe(200);
    expect(res.body.data.updatedTicket.title).toBe('Updated Ticket');
  });
  test('DELETE /tickets/:ticketId should delete a ticket', async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue({ id: '1', role: 'PM' });
    prisma.ticket.delete = jest.fn().mockResolvedValue({ id: '1' });
    const res = await request(app).delete('/tickets/1').send({ userId: '1' });
    expect(res.status).toBe(200);
  })})})
