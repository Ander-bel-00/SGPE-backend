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
  },
  headerColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  questionBorderColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  backgroundColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  publicLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Form;
