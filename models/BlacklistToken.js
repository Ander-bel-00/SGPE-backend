const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/Database");

const BlacklistToken = sequelize.define(
  "BlacklistToken",
  {
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = BlacklistToken;
