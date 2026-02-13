const { Survey, Question, QuestionAnswer, User } = require("../models");

// Создать опрос (MANAGER)
exports.createSurvey = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    // Только MANAGER может создавать опросы
    if (req.user.role !== "MANAGER") {
      return res
        .status(403)
        .json({ message: "Only MANAGER can create surveys" });
    }

    const survey = await Survey.create({
      title,
      description,
      createdBy: req.user.id,
    });

    if (questions && questions.length > 0) {
      for (const q of questions) {
        const question = await Question.create({
          text: q.text,
          type: q.type,
          surveyId: survey.id,
        });

        if (q.answers && q.answers.length > 0) {
          for (const a of q.answers) {
            await QuestionAnswer.create({
              text: a.text,
              questionId: question.id,
            });
          }
        }
      }
    }

    const createdSurvey = await Survey.findByPk(survey.id, {
      include: [
        {
          model: Question,
          as: "questions",
          include: [
            {
              model: QuestionAnswer,
              as: "answers",
            },
          ],
        },
      ],
    });

    res.status(201).json(createdSurvey);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating survey", error: error.message });
  }
};

// Получить все опросы (с фильтрацией по роли)
exports.getAllSurveys = async (req, res) => {
  try {
    let whereClause = {};

    // Если USER - показываем только опросы его менеджера
    if (req.user.role === "USER") {
      if (!req.user.assignedManagerCode) {
        return res.json([]); // У USER нет менеджера - пустой список
      }

      // Находим менеджера по коду
      const manager = await User.findOne({
        where: { managerCode: req.user.assignedManagerCode },
      });

      if (!manager) {
        return res.json([]); // Менеджер не найден - пустой список
      }

      whereClause.createdBy = manager.id;
    }

    // Если MANAGER - показываем только его опросы
    if (req.user.role === "MANAGER") {
      whereClause.createdBy = req.user.id;
    }

    // ADMIN видит все опросы (whereClause остается пустым)

    const surveys = await Survey.findAll({
      where: whereClause,
      include: [
        {
          model: Question,
          as: "questions",
          include: [
            {
              model: QuestionAnswer,
              as: "answers",
            },
          ],
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "username", "email", "role", "managerCode"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(surveys);
  } catch (error) {
    console.error("Error fetching surveys:", error);
    res
      .status(500)
      .json({ message: "Error fetching surveys", error: error.message });
  }
};

// Получить опрос по ID (с проверкой доступа)
exports.getSurveyById = async (req, res) => {
  try {
    const { id } = req.params;

    const survey = await Survey.findByPk(id, {
      include: [
        {
          model: Question,
          as: "questions",
          include: [
            {
              model: QuestionAnswer,
              as: "answers",
            },
          ],
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "username", "email", "role", "managerCode"],
        },
      ],
    });

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    // Проверка доступа
    if (req.user.role === "USER") {
      // USER может видеть только опросы своего менеджера
      if (!req.user.assignedManagerCode) {
        return res
          .status(403)
          .json({ message: "You are not assigned to any manager" });
      }

      const manager = await User.findOne({
        where: { managerCode: req.user.assignedManagerCode },
      });

      if (!manager || survey.createdBy !== manager.id) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    if (req.user.role === "MANAGER") {
      // MANAGER может видеть только свои опросы
      if (survey.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    // ADMIN может видеть все

    res.json(survey);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching survey", error: error.message });
  }
};

// Обновить опрос (только создатель)
exports.updateSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const survey = await Survey.findByPk(id);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    // Только создатель (MANAGER) или ADMIN могут обновлять
    if (req.user.role !== "ADMIN" && survey.createdBy !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only survey creator can update it" });
    }

    if (title) survey.title = title;
    if (description) survey.description = description;

    await survey.save();

    const updatedSurvey = await Survey.findByPk(id, {
      include: [
        {
          model: Question,
          as: "questions",
          include: [
            {
              model: QuestionAnswer,
              as: "answers",
            },
          ],
        },
      ],
    });

    res.json(updatedSurvey);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating survey", error: error.message });
  }
};

// Удалить опрос (только создатель)
exports.deleteSurvey = async (req, res) => {
  try {
    const { id } = req.params;

    const survey = await Survey.findByPk(id);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    // Только создатель (MANAGER) или ADMIN могут удалять
    if (req.user.role !== "ADMIN" && survey.createdBy !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only survey creator can delete it" });
    }

    await survey.destroy();

    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting survey", error: error.message });
  }
};
