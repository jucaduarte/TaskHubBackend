const request = require('supertest');
const app = require('../index');
const User = require('../models/User');
const sequelize = require('../sequelize'); // importe sua instância do sequelize

beforeAll(async () => {
  // lipar tabela
  await User.destroy({ where: {} });
});

afterAll(async () => {
  await sequelize.close(); // fecha a conexão com o banco
});

describe('Rotas de autenticação', () => {
  const userData = {
    name: 'Teste',
    email: 'teste@exemplo.com',
    password: 'senha123'
  };

  it('deve registrar um novo usuário', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toMatchObject({
      name: userData.name,
      email: userData.email
    });
  });

  it('não deve registrar um usuário com email já existente', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(userData);

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error', 'Email já registrado.');
  });

  it('deve fazer login com sucesso', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('não deve fazer login com senha errada', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: userData.email,
        password: 'senhaErrada'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Usuário ou senha inválidos.');
  });

  it('não deve fazer login com email inexistente', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'naoexiste@exemplo.com',
        password: 'qualquer'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Usuário ou senha inválidos.');
  });
});