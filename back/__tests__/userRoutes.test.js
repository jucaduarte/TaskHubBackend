const request = require('supertest');
const express = require('express');
const userRouter = require('../routes/users');

// Mock do controller
jest.mock('../controllers/userController', () => ({
  listUsers: (req, res) => res.json([{ id: 1, name: 'Test User' }]),
}));

describe('User Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/users', userRouter);
  });

  it('GET /users deve retornar lista de usuários', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
  });
});