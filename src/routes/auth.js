const User = require('../controllers/user');

const passport = require('passport');

const router = require('express').Router()

router.post('/verify', User.verifyUserEmail)

router.post('/signup', User.signup);

router.post('/signin', User.signin);

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback',
    passport.authenticate('google', { failureMessage: "Something went wrong" }),
    async (req, res, next) => {
        return res.send({ message: "User login", token: req.user.accessToken });
    }
)
router.post('/logout', User.logout);

router.post('/email', User.sendResetCode);

router.post('/reset', User.resetPassword);

module.exports = router
