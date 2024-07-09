const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/Database');

const Form = sequelize.define('Form', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  }
});

module.exports = Form;
