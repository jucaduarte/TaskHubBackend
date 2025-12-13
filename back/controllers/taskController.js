const Task = require('../models/Task');
const validateExists = require('../utils/validateExists');
const asyncHandler = require('../utils/asyncHandler');

exports.listTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.findAll();
    res.json(tasks);
});

exports.createTask = asyncHandler(async (req, res) => {
    const { userId, title, description, done } = req.body;
    const task = await Task.create({ userId, title, description, done });
    res.status(201).json(task);
});

exports.getTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
        return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    res.json(task);
});

exports.updateTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const exists = await validateExists(Task, { id });
    if (!exists) {
        return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Corpo da requisição vazio ou inválido.' });
    }
    const { userId, title, description, done } = req.body;
    const task = await Task.findByPk(id);
    await task.update({ userId, title, description, done });
    res.status(200).json(task);
});

exports.deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const exists = await validateExists(Task, { id });
    if (!exists) {
        return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    const task = await Task.findByPk(id);
    await task.destroy();
    res.status(200).json({ message: 'Tarefa deletada com sucesso.' });
});