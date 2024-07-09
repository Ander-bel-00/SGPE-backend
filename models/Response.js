// models/Response.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/Database');

const Response = sequelize.define('Response', {
  formId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Response;