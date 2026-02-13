const { Survey, Question, QuestionAnswer } = require('../models');

// Создать опрос
exports.createSurvey = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    
    const survey = await Survey.create({ title, description });
    
    if (questions && questions.length > 0) {
      for (const q of questions) {
        const question = await Question.create({
          text: q.text,
          type: q.type,
          surveyId: survey.id
        });
        
        if (q.answers && q.answers.length > 0) {
          for (const a of q.answers) {
            await QuestionAnswer.create({
              text: a.text,
              questionId: question.id
            });
          }
        }
      }
    }
    
    const createdSurvey = await Survey.findByPk(survey.id, {
      include: [{
        model: Question,
        as: 'questions',
        include: [{
          model: QuestionAnswer,
          as: 'answers'
        }]
      }]
    });
    
    res.status(201).json(createdSurvey);
  } catch (error) {
    res.status(500).json({ message: 'Error creating survey', error: error.message });
  }
};

// Получить все опросы
exports.getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.findAll({
      include: [{
        model: Question,
        as: 'questions',
        include: [{
          model: QuestionAnswer,
          as: 'answers'
        }]
      }]
    });
    
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching surveys', error: error.message });
  }
};

// Получить опрос по ID
exports.getSurveyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const survey = await Survey.findByPk(id, {
      include: [{
        model: Question,
        as: 'questions',
        include: [{
          model: QuestionAnswer,
          as: 'answers'
        }]
      }]
    });
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    res.json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching survey', error: error.message });
  }
};

// Обновить опрос
exports.updateSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    
    const survey = await Survey.findByPk(id);
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    if (title) survey.title = title;
    if (description) survey.description = description;
    
    await survey.save();
    
    const updatedSurvey = await Survey.findByPk(id, {
      include: [{
        model: Question,
        as: 'questions',
        include: [{
          model: QuestionAnswer,
          as: 'answers'
        }]
      }]
    });
    
    res.json(updatedSurvey);
  } catch (error) {
    res.status(500).json({ message: 'Error updating survey', error: error.message });
  }
};

// Удалить опрос
exports.deleteSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    
    const survey = await Survey.findByPk(id);
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    await survey.destroy();
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting survey', error: error.message });
  }
};
