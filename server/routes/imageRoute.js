const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const {uploadImage, deleteImage} = require('../controller/imageUploadController');


router.post('/upload',auth, authAdmin, uploadImage);

router.post('/destroy', auth, authAdmin, deleteImage);

module.exports = router;