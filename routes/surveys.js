const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, surveyController.createSurvey);
router.get('/', authMiddleware, surveyController.getAllSurveys);
router.get('/:id', authMiddleware, surveyController.getSurveyById);
router.put('/:id', authMiddleware, surveyController.updateSurvey);
router.delete('/:id', authMiddleware, surveyController.deleteSurvey);

module.exports = router;
