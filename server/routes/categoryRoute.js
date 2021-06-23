const express = require('express');
const router = express.Router();
const {getCategories, createCategories} = require('../controller/categoryController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');


router.get('/category',getCategories);

router.post('/category', auth, authAdmin, createCategories);

module.exports = router;