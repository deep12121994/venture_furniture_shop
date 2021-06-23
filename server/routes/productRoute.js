const express = require('express');
const router = express.Router();
const {getProducts, createProducts, updateProducts, deleteProducts} = require('../controller/productController');

router.get('/products', getProducts);

router.post('/products', createProducts);

router.put('/products/:id',updateProducts);

router.delete('/products/:idno', deleteProducts);



module.exports = router;