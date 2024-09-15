const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/auth');

router.post('/signup', adminController.createAdmin);
router.post('/login', adminController.adminLogin);
router.post('/validate', adminController.validateAdminToken);
router.get('/', authMiddleware, adminController.getAdmins);
router.put('/:id', authMiddleware, adminController.updateAdmin);
router.delete('/:id', authMiddleware, adminController.deleteAdmin);

module.exports = router;