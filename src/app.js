const express = require('express');

const morgan = require('morgan');

const path = require('path');

const fs = require("fs");

require('dotenv').config();

const db = require('./models/index');

const { env } = process;

const session = require('express-session');

const app = express();

const { createClient } = require('redis');

const RedisStore = require('connect-redis').default;

const rateLimit = require('express-rate-limit');

let redisClient = createClient({
});

redisClient.connect().catch(err => console.log(err))

let redisStore = new RedisStore({
    client: redisClient,
    prefix: 'dapps'
})

const limiter = rateLimit({
    windowMs: 1000,
    max: 10,
});



app.use(limiter);
app.use(session({
    secret: env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: redisStore,
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 365 * 10
    }
}));





const User = db.user;
const Job = db.job;
const Req = db.req;
const Application = db.application;
const Saved = db.saved;



//Relations

User.hasMany(Job);
Job.belongsTo(User);

User.hasMany(Application);
Application.belongsTo(User);


Job.hasMany(Application);
Application.belongsTo(Job);

User.hasMany(Req);
Req.belongsTo(User);

User.hasMany(Saved);
Saved.belongsTo(User);

Saved.belongsTo(Job);
Job.hasMany(Saved);



app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public/uploads')))

process.env.ENV == 'dev' && app.use(morgan('dev'));


app.use(async (req, res, next) => {
    console.log(req.session);
    next();
});

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