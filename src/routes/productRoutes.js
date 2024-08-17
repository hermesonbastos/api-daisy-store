const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/products', productController.getProducts);
router.post('/products', productController.createProduct);
router.put('/products', productController.updateProduct);
router.delete('/products', productController.deleteProduct);

module.exports = router;