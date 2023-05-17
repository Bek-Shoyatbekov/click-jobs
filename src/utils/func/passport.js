const db = require('../../models/index');

const generateToken = require('../../middlewares/auth/generateAccessToken');

const passport = require('passport');

const User = db.user;
const Network = db.network;

const u4 = require('uuid');

const GoogleStrategy = require('passport-google-oauth2').Strategy;

require('dotenv').config();

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: process.env.client_id,
    clientSecret: process.env.client_secret,
    callbackURL: `${process.env.BASE_URL}/auth/google/callback`
},
    (accessToken, refreshToken, profile, done) => {
        let user;
        Network.findOne({ where: { provider_id: profile.id } })
            .then(async (data) => {
                if (data) {
                    data.accessToken = generateToken(data.id, data.email);
                    return done(null, data);
                } else {
                    const userId = u4.v4();
                    const user = await User.create({
                        id: userId,
                        username: profile.name.givenName,
                        email: profile.emails[0].value,
                        image: profile._json.picture,
                        password: '',
                        accessToken: generateToken(userId, profile.emails[0].value),
                        refreshToken: generateToken(userId, profile.emails[0].value)
                    })
                    await user.save();
                    const network = await Network.create({
                        userId: userId,
                        provider: "Google",
                        provider_id: profile.id,
                        username: profile.name.givenName,
                        email: profile.emails[0].value,
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    })
                   
                    await network.save();
                    return done(null, user);
                }
            }).catch(err => {
                console.log(err);
                return;
            })

    }
))

module.exports = passport;