require('dotenv').config();

const jwt = require('jsonwebtoken');


const generateAccessToken = (email, role, userId) => jwt.sign({ email: email, role: role, userId: userId }, process.env.TOKEN_SECRET, { expiresIn: '180h' });


module.exports = generateAccessToken;