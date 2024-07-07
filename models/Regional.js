const {DataTypes} = require('sequelize');
const { sequelize } = require('../config/Database');

const Regional = sequelize.define("Regionales", {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Regionales',
    indexes: [
        {
            unique: true,
            fields: ['id']
        }
    ],
});

// Exportar el modelo para permitir su uso.
module.exports = Regional;