const User = require('../controllers/user');
const authenticateToken = require('../middlewares/auth/authenticateToken');

const { app, admin, provider, signInWithPopup } = require('../middlewares/auth/firebase');


const router = require('express').Router()

router.post('/signup', User.signup);

router.post('/signin', User.signin);

router.post('/logout', User.logout);

// router.post('/firebase', (req, res, next) => { // TODO firebase with google provider
//     try {
//         provider.addScope('profile');
//         provider.addScope('email');
//         signInWithPopup(provider)
//             .then(function (result) {
//                 const credential = result.credential;
//                 const user = result.user;
//                 console.log(user);
//                 // firebase.auth().signInWithRedirect(provider);
//             })
//             .catch((err) => {
//                 const errorCode = err.code;
//                 const errorMessage = err.message;
//                 // The email of the user's account used.
//                 const email = err.email;
//                 // The firebase.auth.AuthCredential type that was used.
//                 const credential = err.credential;
//                 console.log(errorCode, errorMessage, email, credential);
//             })

//     } catch (err) {
//         return next(err);
//     }
// })

module.exports = router