const express = require('express');
const router = express.Router();
const {getCategories, createCategories, deleteCategories, updateCategories} = require('../controller/categoryController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');


router.get('/category',getCategories);

router.post('/category', auth, authAdmin, createCategories);

router.delete('/category/:id', auth, authAdmin, deleteCategories);

router.put('/category/:id', auth, authAdmin, updateCategories);

module.exports = router;