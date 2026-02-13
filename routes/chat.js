const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, chatController.createChat);
router.get('/', authMiddleware, chatController.getAllChats);
router.put('/:id', authMiddleware, chatController.updateChat);
router.delete('/:id', authMiddleware, chatController.deleteChat);

module.exports = router;
