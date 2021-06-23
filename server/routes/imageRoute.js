const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const {uploadImage} = require('../controller/imageUploadController');


router.post('/upload', uploadImage);

//router.post('/destroy', auth, authAdmin, deleteImage);

module.exports = router;