const User = require('../controllers/user');
const authenticateToken = require('../middlewares/auth/authenticateToken');

const { app, admin, provider, signInWithPopup } = require('../middlewares/auth/firebase');


const router = require('express').Router()

/**
 * @swagger
 * /auth/signup:
 *  post:
 *   summary: "Create a new user account"
 *   description: ""
 *   parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "User object that needs to be created"
 *       required: true
 *    
 *   responses:
 *     200:
 *       description: "User created successfully"
 *    
 *       
 *     400:
 *       description: "Invalid input or user already exists"
 *     500:
 *       description: "Internal server error"
 */

router.post('/signup', User.signup);

/**
 * @swagger
 * /auth/signin:
 *  post:
 *   summary: "Log in with an existing user account"
 *   description: ""
 *   parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "User credentials that need to be verified"
 *       required: true

 *   responses:
 *     200:
 *       description: "User logged in successfully"
 *       schema:
 *           
 *     401:
 *       description: "Invalid credentials or user not found"
 *     500:
 *       description: "Internal server error"
 */

router.post('/signin', User.signin);

router.post('/logout', User.logout);

router.post('/email', User.sendResetCode);

router.post('/reset', User.resetPassword);


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