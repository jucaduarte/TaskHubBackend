const request = require('supertest');
const app = require('../index');
const User = require('../models/User');
const Task = require('../models/Task');
const sequelize = require('../sequelize');

let token;
let userId;

beforeAll(async () => {
  await Task.destroy({ where: {} });
  await User.destroy({ where: {} });

  const userRes = await request(app)
    .post('/auth/register')
    .send({
      name: 'TaskUser',
      email: 'taskuser@exemplo.com',
      password: 'senha123'
    });
  if (!userRes.body.id) throw new Error('Usuário não foi criado corretamente');
  userId = userRes.body.id;

  const loginRes = await request(app)
    .post('/auth/login')
    .send({
      email: 'taskuser@exemplo.com',
      password: 'senha123'
    });
  if (!loginRes.body.token) throw new Error('Token não foi retornado');
  token = loginRes.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Rotas de Task', () => {
  let taskId;

  it('deve criar uma nova task', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId,
        title: 'Minha Task',
        description: 'Descrição da task',
        done: false
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Minha Task');
    taskId = res.body.id;
  });

  it('deve listar todas as tasks', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('deve buscar uma task pelo id', async () => {
    const res = await request(app)
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', taskId);
  });

  it('deve retornar 404 ao buscar task inexistente', async () => {
    const res = await request(app)
      .get('/tasks/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Tarefa não encontrada.');
  });

  it('deve atualizar uma task', async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId,
        title: 'Task Atualizada',
        description: 'Nova descrição',
        done: true
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Task Atualizada');
    expect(res.body.done).toBe(true);
  });

  it('deve retornar erro ao atualizar task inexistente', async () => {
    const res = await request(app)
      .put('/tasks/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId,
        title: 'Qualquer',
        description: 'Qualquer',
        done: false
      });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Tarefa não encontrada.');
  });

  it('deve retornar erro ao atualizar sem body', async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Corpo da requisição vazio ou inválido.');
  });

  it('deve deletar uma task', async () => {
    const res = await request(app)
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Tarefa deletada com sucesso.');
  });

  it('deve retornar erro ao deletar task inexistente', async () => {
    const res = await request(app)
      .delete('/tasks/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Tarefa não encontrada.');
  });
});