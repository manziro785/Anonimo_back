const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const QuestionAnswer = sequelize.define('QuestionAnswer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'questions',
      key: 'id'
    }
  }
}, {
  timestamps: false,
  tableName: 'question_answers'
});

module.exports = QuestionAnswer;
