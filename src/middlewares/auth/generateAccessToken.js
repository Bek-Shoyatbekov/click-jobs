require('dotenv').config();

const jwt = require('jsonwebtoken');

const generateAccessToken = (userId, email) => jwt.sign({ userId: userId, email: email }, process.env.TOKEN_SECRET, { expiresIn: '1800h' });

module.exports = generateAccessToken;