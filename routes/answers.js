const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, answerController.saveAnswer);
router.get('/user/:userId', authMiddleware, answerController.getUserAnswers);

module.exports = router;
