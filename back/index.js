const express = require('express');

const sequelize = require('./sequelize');
const authMiddleware = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const taskRouter = require('./routes/tasks');
const cors = require('cors');


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


app.get('/', (req, res) => {
    res.send('Task Hub Backend');
});

// Rotas públicas
app.use('/auth', authRouter);

// Rotas protegidas
app.use('/users', authMiddleware, userRouter);
app.use('/tasks', authMiddleware, taskRouter);

// Middleware de tratamento centralizado de erros
app.use(errorHandler);

sequelize.sync();

// para validar rotas nos testes
module.exports = app;