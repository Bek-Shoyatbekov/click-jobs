const express = require('express');

const morgan = require('morgan');

const path = require('path');

const fs = require("fs");

require('dotenv').config();

const db = require('./models/index');

const { env } = process;

// const session = require('express-session');


const app = express();


const User = db.user;
const Job = db.job;
const Req = db.req;
const Application = db.application;
const Image = db.image;
const Resume = db.resume;


//Relations

User.hasMany(Job);
Job.belongsTo(User);

User.hasMany(Application);
Application.belongsTo(User);


Job.hasMany(Application);
Application.belongsTo(Job);

User.hasMany(Req);
Req.belongsTo(User);


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public/uploads')))

process.env.ENV == 'dev' && app.use(morgan('dev'));




// For Session
// app.use(session({
//     secret: env.SESSION_KEY,

//     resave: false,

//     saveUninitialized: true
// }));

// app.use(async (req, res, next) => {
//     if (req.session.email && !req.session.user) {
//         req.session.user = await User.findOne({ where: { email: req.session.email } });
//     }
//     next();
// });

app.get('/', (req, res, next) => {
    try {
        return res.send(
            `
        <h1>Home</h1>
        `
        )
    } catch (err) {
        next(err);
    }
})

app.use('/admin', require('./routes/admin'));

app.use('/auth', require('./routes/auth'));

app.use('/me', require('./routes/user.js'));

app.use('/content', require('./routes/content'));




module.exports = app;