const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/Database");

const BlacklistToken = sequelize.define(
  "BlacklistToken",
  {
    token: {
      type: DataTypes.STRING(512),
      allowNull: false,
      unique: true
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
