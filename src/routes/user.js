const express = require('express');

const User = require('../controllers/user');

const router = express.Router();

const cpUpload = require('../utils/file_upload_service/setup');

const isAuth = require('../middlewares/auth/authenticateToken');

router.get('/profile/:userId', User.getProfile);

// FIXME To test file upload 
// router.get('/test', (req, res, next) => {
//     res.send(`
// <form action="/auth/signin" method="post">
//   <div class="container">
//     <label for="email"><b>Email</b></label>
//     <input type="email" id="email" name="email" placeholder="Enter Email" required>

//     <label for="password"><b>Password</b></label>
//     <input type="password" id="password" name="password" placeholder="Enter Password" required>

//     <button type="submit">Login</button>
//   </div>
// </form>

//        `)
// });

// router.get('/update', (req, res, next) => {
//     return res.send(`
//      <form
//   action="http://localhost:4000/me/profile/3e8523ec-4d74-4bb0-bbc0-473758690f02"
//   method="post"
//   enctype="multipart/form-data">
//   <input type="file" name="image" accept="image/*" />
//   <input type="file" name="resume" accept="application/pdf" />
//   <button type="submit">submit</button>
// </form>
//      `)
// })
// until there

router.post('/profile/:userId', isAuth, cpUpload, User.updateProfile);





module.exports = router;