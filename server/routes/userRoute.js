const express = require('express');
const router = express.Router();
const {userRegistration, userLogin, getUser, refreshToken, userLogout} = require('../controller/userController');
const auth = require('../middleware/auth');

/*router.post('/register', (req,res) => {
    console.log("from user router")
    res.json({msg:"router testing......"});
})*/

router.post('/registration', userRegistration);

router.post('/login', userLogin);

router.get('/logout', userLogout);

router.get('/refresh_token', refreshToken);

router.get('/protected', auth, getUser);

module.exports = router;