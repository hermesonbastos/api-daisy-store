const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/categories', categoryController.getCategories);
router.post('/categories', categoryController.createCategory);
router.put('/categories', categoryController.updateCategory);
router.delete('/categories', categoryController.deleteCategory);

module.exports = router;