const {DataTypes} = require('sequelize');
const { sequelize } = require('../config/Database');

const Admin = sequelize.define("Administradores", {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
}, {
    sequelize,
    modelName: "Administradores",
    indexes: [
        {
            unique: true,
            fields: ['id']
        }
    ],
});

module.exports = Admin;