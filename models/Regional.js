const {DataTypes} = require('sequelize');
const { sequelize } = require('../config/Database');

const Regional = sequelize.define("Regional", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Regional',
    freezeTableName: true,  // Evita la pluralización del nombre de la tabla
    indexes: [
        {
            unique: true,
            fields: ['id']
        }
    ],
});

// Exportar el modelo para permitir su uso.
module.exports = Regional;