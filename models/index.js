const User = require('./User');
const Chat = require('./Chat');
const Message = require('./Message');
const Survey = require('./Survey');
const Question = require('./Question');
const QuestionAnswer = require('./QuestionAnswer');
const UserAnswer = require('./UserAnswer');

// User <-> Chat (One to Many)
User.hasMany(Chat, { foreignKey: 'userId', onDelete: 'CASCADE' });
Chat.belongsTo(User, { foreignKey: 'userId' });

// Chat <-> Message (One to Many)
Chat.hasMany(Message, { foreignKey: 'chatId', onDelete: 'CASCADE' });
Message.belongsTo(Chat, { foreignKey: 'chatId' });

// User <-> Message (One to Many)
User.hasMany(Message, { foreignKey: 'userId', onDelete: 'SET NULL' });
Message.belongsTo(User, { foreignKey: 'userId' });

// Survey <-> Question (One to Many)
Survey.hasMany(Question, { foreignKey: 'surveyId', onDelete: 'CASCADE', as: 'questions' });
Question.belongsTo(Survey, { foreignKey: 'surveyId' });

// Question <-> QuestionAnswer (One to Many)
Question.hasMany(QuestionAnswer, { foreignKey: 'questionId', onDelete: 'CASCADE', as: 'answers' });
QuestionAnswer.belongsTo(Question, { foreignKey: 'questionId' });

// User <-> UserAnswer (One to Many)
User.hasMany(UserAnswer, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserAnswer.belongsTo(User, { foreignKey: 'userId' });

// Question <-> UserAnswer (One to Many)
Question.hasMany(UserAnswer, { foreignKey: 'questionId', onDelete: 'CASCADE' });
UserAnswer.belongsTo(Question, { foreignKey: 'questionId' });

module.exports = {
  User,
  Chat,
  Message,
  Survey,
  Question,
  QuestionAnswer,
  UserAnswer
};
