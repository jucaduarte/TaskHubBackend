const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

exports.listUsers = asyncHandler(async (req, res) => {
    const users = await User.findAll({
        attributes: ['id', 'name', 'email']
    });
    res.json(users);
});