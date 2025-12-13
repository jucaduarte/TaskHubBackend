const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validateExists = require('../utils/validateExists');
const asyncHandler = require('../utils/asyncHandler');

const JWT_SECRET = 'taskhub';

exports.register = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const exists = await validateExists(User, { email });
    if (exists) {
        return res.status(409).json({ error: 'Email já registrado.' });
    }
    const { name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, id: user.id, name: user.name, email: user.email });
});