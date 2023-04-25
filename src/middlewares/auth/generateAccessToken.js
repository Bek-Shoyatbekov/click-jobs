require('dotenv').config();

const jwt = require('jsonwebtoken');


const generateAccessToken = (email) => jwt.sign({ email: email }, process.env.TOKEN_SECRET, { expiresIn: '180h' });


module.exports = generateAccessToken;