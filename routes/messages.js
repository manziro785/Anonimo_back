const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, messageController.sendMessage);
router.post('/ai', authMiddleware, messageController.sendAiMessage);
router.get('/chat/:chatId', authMiddleware, messageController.getChatMessages);
router.get('/chat/:chatId/recent', authMiddleware, messageController.getRecentMessages);
router.delete('/:messageId', authMiddleware, messageController.deleteMessage);

module.exports = router;
