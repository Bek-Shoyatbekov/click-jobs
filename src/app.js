const express = require('express');

const morgan = require('morgan');

const path = require('path');

const fs = require("fs");

require('dotenv').config();

const db = require('./models/index');

const { env } = process;

const session = require('express-session');


const app = express();




const User = db.user;
const Token = db.token;
const Job = db.job;
const Req = db.req;


//Relations

User.hasOne(Token, { onDelete: 'cascade' });
Token.hasOne(User);

User.hasMany(Job, { onDelete: 'cascade' });
Job.belongsTo(User);

User.hasMany(Req, { onDelete: 'cascade' });
Req.belongsTo(User);



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public/uploads')))

process.env.ENV == 'dev' && app.use(morgan('dev'));




// For Session
app.use(session({
    secret: env.SESSION_KEY,

    resave: false,

    saveUninitialized: true
}));

app.use(async (req, res, next) => {
    // FIXME  it's important part
    if (req.session.email && !req.session.user) {
        req.session.user = await User.findOne({ where: { email: req.session.email } });
    }
    next();
});


app.use('/auth', require('./routes/auth'));

app.use('/me', require('./routes/user.js'));




module.exports = app;