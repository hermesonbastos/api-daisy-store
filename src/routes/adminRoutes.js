const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getAdmins);
router.post('/', adminController.createAdmin);
router.put('/', adminController.updateAdmin);
router.delete('/', adminController.deleteAdmin);

module.exports = router;