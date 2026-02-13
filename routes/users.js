const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, roleMiddleware('ADMIN'), userController.getAllUsers);
router.get('/me', authMiddleware, userController.getMe);
router.put('/me', authMiddleware, userController.updateMe);
router.delete('/me', authMiddleware, userController.deleteMe);

module.exports = router;
