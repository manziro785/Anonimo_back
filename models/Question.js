const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TEXT'),
    allowNull: false
  },
  surveyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'surveys',
      key: 'id'
    }
  }
}, {
  timestamps: false,
  tableName: 'questions'
});

module.exports = Question;
