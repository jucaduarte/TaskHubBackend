const sequelize = require('../sequelize');
const User = require('../models/User');
const Task = require('../models/Task');

async function seed() {
  try {
    await sequelize.sync({ force: true });

    // Usuários de exemplo
    const user = await User.create({
      name: 'Admin',
      email: 'admin@taskhub.com',
      password: 'senha123'
    });

    // Tarefas de exemplo
    await Task.create({
      title: 'Primeira tarefa',
      description: 'Esta é uma tarefa de exemplo',
      userId: user.id
    });

    console.log('Seed realizado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao rodar seed:', error);
    process.exit(1);
  }
}

seed();