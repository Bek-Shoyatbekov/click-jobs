const User = require('../controllers/user');
const authenticateToken = require('../middlewares/auth/authenticateToken');


const router = require('express').Router()

router.get('/verify/:code', User.verifyUserEmail)

router.post('/signup', User.signup);

router.post('/signin', User.signin);

router.post('/logout', User.logout);

router.post('/email', User.sendResetCode);

router.post('/reset', User.resetPassword);

module.exports = router