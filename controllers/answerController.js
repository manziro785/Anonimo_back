const { UserAnswer, User, Question } = require('../models');

// Сохранить ответ на вопрос
exports.saveAnswer = async (req, res) => {
  try {
    const { text, user, question } = req.body;
    
    const answer = await UserAnswer.create({
      text,
      userId: user.id,
      questionId: question.id
    });
    
    const createdAnswer = await UserAnswer.findByPk(answer.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        },
        {
          model: Question
        }
      ]
    });
    
    res.status(201).json(createdAnswer);
  } catch (error) {
    res.status(500).json({ message: 'Error saving answer', error: error.message });
  }
};

// Получить ответы пользователя
exports.getUserAnswers = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const answers = await UserAnswer.findAll({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        },
        {
          model: Question
        }
      ]
    });
    
    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user answers', error: error.message });
  }
};

// Получить все ответы на опросы
exports.getAllSurveyResponses = async (req, res) => {
  try {
    const responses = await UserAnswer.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        },
        {
          model: Question
        }
      ]
    });
    
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching survey responses', error: error.message });
  }
};
