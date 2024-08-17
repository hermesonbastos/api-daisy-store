const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/users', adminController.getAdmins);
router.post('/users', adminController.createAdmin);
router.put('/users', adminController.updateAdmin);
router.delete('/users', adminController.deleteAdmin);

module.exports = router;