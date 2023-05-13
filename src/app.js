const express = require('express');

const morgan = require('morgan');

const path = require('path');

require('dotenv').config();

const passport = require('passport');

require('./utils/func/passport');

const db = require('./models/index');

const compression = require('compression');

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
app.use(compression())
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

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(passport.initialize());
app.use(passport.session());





const User = db.user;
const Job = db.job;
const Req = db.req;
const Application = db.application;
const Saved = db.saved;
const Notification = db.notification;


//Relations

User.hasMany(Job);
Job.belongsTo(User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

User.hasMany(Application);
Application.belongsTo(User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});


Job.hasMany(Application);
Application.belongsTo(Job);

User.hasMany(Req);
Req.belongsTo(User, {
    onDelete: 'CASCADE',
});

User.hasMany(Saved);
Saved.belongsTo(User, {
    onDelete: 'CASCADE',
});

Saved.belongsTo(Job);
Job.hasMany(Saved, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

User.hasMany(Notification);
Notification.belongsTo(User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Job.hasMany(Notification);
Notification.belongsTo(Job, {
    onDelete: 'CASCADE',
});





app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public/uploads')))

process.env.ENV == 'dev' && app.use(morgan('dev'));


app.get('/google', async (req, res, next) => {
    try {
        return res.render('pages/auth')
    } catch (err) {
        next(err);
    }
})

app.use('/admin', require('./routes/admin'));

app.use('/auth', require('./routes/auth'));

app.use('/me', require('./routes/user.js'));

app.use('/content', require('./routes/content'));




module.exports = app;