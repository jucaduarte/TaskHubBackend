const request = require('supertest');
const express = require('express');

jest.mock('../models/Task');
jest.mock('../utils/validateExists', () => jest.fn());
jest.mock('../utils/asyncHandler', () => fn => fn);

const Task = require('../models/Task');
const validateExists = require('../utils/validateExists');
const taskController = require('../controllers/taskController');

const app = express();
app.use(express.json());
app.get('/tasks', taskController.listTasks);
app.post('/tasks', taskController.createTask);
app.get('/tasks/:id', taskController.getTask);
app.put('/tasks/:id', taskController.updateTask);
app.delete('/tasks/:id', taskController.deleteTask);

describe('taskController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('listTasks', () => {
        it('deve retornar todas as tarefas', async () => {
            const tasks = [{ id: 1, title: 'Tarefa 1' }];
            Task.findAll.mockResolvedValue(tasks);

            const res = await request(app).get('/tasks');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(tasks);
        });
    });

    describe('createTask', () => {
        it('deve criar uma tarefa e retornar 201', async () => {
            const task = { id: 1, userId: 1, title: 'Nova Tarefa', description: '', done: false };
            Task.create.mockResolvedValue(task);

            const res = await request(app)
                .post('/tasks')
                .send({ userId: 1, title: 'Nova Tarefa', description: '', done: false });

            expect(res.status).toBe(201);
            expect(res.body).toEqual(task);
            expect(Task.create).toHaveBeenCalledWith({ userId: 1, title: 'Nova Tarefa', description: '', done: false });
        });
    });

    describe('getTask', () => {
        it('deve retornar uma tarefa pelo id', async () => {
            const task = { id: 1, title: 'Tarefa 1' };
            Task.findByPk.mockResolvedValue(task);

            const res = await request(app).get('/tasks/1');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(task);
        });

        it('deve retornar 404 se a tarefa não for encontrada', async () => {
            Task.findByPk.mockResolvedValue(null);

            const res = await request(app).get('/tasks/999');
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Tarefa não encontrada.' });
        });
    });

    describe('updateTask', () => {
        it('deve retornar 404 se a tarefa não existir', async () => {
            validateExists.mockResolvedValue(false);

            const res = await request(app)
                .put('/tasks/999')
                .send({ title: 'Atualizada' });

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Tarefa não encontrada.' });
        });

        it('deve retornar 400 se o corpo estiver vazio', async () => {
            validateExists.mockResolvedValue(true);

            const res = await request(app)
                .put('/tasks/1')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Corpo da requisição vazio ou inválido.' });
        });

        it('deve atualizar e retornar a tarefa', async () => {
            validateExists.mockResolvedValue(true);
            const task = {
                id: 1,
                update: jest.fn(function (updateObj) {
                    Object.assign(this, updateObj);
                    return Promise.resolve();
                }),
                userId: 1,
                title: 'Antiga',
                description: '',
                done: false
            };
            Task.findByPk.mockResolvedValue(task);

            const updated = { userId: 2, title: 'Atualizada', description: 'desc', done: true };
            const res = await request(app)
                .put('/tasks/1')
                .send(updated);

            expect(res.status).toBe(200);
            expect(task.update).toHaveBeenCalledWith(updated);
            expect(res.body).toEqual({
                id: 1,
                userId: 2,
                title: 'Atualizada',
                description: 'desc',
                done: true,
            });
        });
    });

    describe('deleteTask', () => {
        it('deve retornar 404 se a tarefa não existir', async () => {
            validateExists.mockResolvedValue(false);

            const res = await request(app).delete('/tasks/999');
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Tarefa não encontrada.' });
        });

        it('deve deletar a tarefa e retornar mensagem de sucesso', async () => {
            validateExists.mockResolvedValue(true);
            const task = { destroy: jest.fn().mockResolvedValue() };
            Task.findByPk.mockResolvedValue(task);

            const res = await request(app).delete('/tasks/1');
            expect(res.status).toBe(200);
            expect(task.destroy).toHaveBeenCalled();
            expect(res.body).toEqual({ message: 'Tarefa deletada com sucesso.' });
        });
    });
});