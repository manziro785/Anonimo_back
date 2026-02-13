const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserAnswer = sequelize.define('UserAnswer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
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
  timestamps: true,
  tableName: 'user_answers'
});

module.exports = UserAnswer;
