const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../utils/validateExists', () => jest.fn());
jest.mock('../utils/asyncHandler', () => fn => fn);

const User = require('../models/User');
const validateExists = require('../utils/validateExists');
const authController = require('../controllers/authController');

const app = express();
app.use(express.json());
app.post('/register', authController.register);
app.post('/login', authController.login);

describe('authController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should return 409 if email already exists', async () => {
            validateExists.mockResolvedValue(true);

            const res = await request(app)
                .post('/register')
                .send({ name: 'Test', email: 'test@example.com', password: '123456' });

            expect(res.status).toBe(409);
            expect(res.body).toEqual({ error: 'Email já registrado.' });
        });

        it('should create user and return 201', async () => {
            validateExists.mockResolvedValue(false);
            bcrypt.hash.mockResolvedValue('hashedpass');
            User.create.mockResolvedValue({ id: 1, name: 'Test', email: 'test@example.com' });

            const res = await request(app)
                .post('/register')
                .send({ name: 'Test', email: 'test@example.com', password: '123456' });

            expect(res.status).toBe(201);
            expect(res.body).toEqual({ id: 1, name: 'Test', email: 'test@example.com' });
            expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
        });
    });

    describe('login', () => {
        it('should return 401 if user not found', async () => {
            User.findOne.mockResolvedValue(null);

            const res = await request(app)
                .post('/login')
                .send({ email: 'notfound@example.com', password: '123456' });

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ error: 'Usuário ou senha inválidos.' });
        });

        it('should return 401 if password is invalid', async () => {
            User.findOne.mockResolvedValue({ id: 1, email: 'test@example.com', password: 'hashedpass' });
            bcrypt.compare.mockResolvedValue(false);

            const res = await request(app)
                .post('/login')
                .send({ email: 'test@example.com', password: 'wrongpass' });

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ error: 'Usuário ou senha inválidos.' });
        });

        it('should return token and user info on success', async () => {
            const user = { id: 1, name: 'Test', email: 'test@example.com', password: 'hashedpass' };
            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mocktoken');

            const res = await request(app)
                .post('/login')
                .send({ email: 'test@example.com', password: '123456' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                token: 'mocktoken',
                id: 1,
                name: 'Test',
                email: 'test@example.com'
            });
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 1, email: 'test@example.com' },
                'taskhub',
                { expiresIn: '1h' }
            );
        });
    });
});