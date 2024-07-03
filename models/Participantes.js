const {DataTypes} = require('sequelize');
const { sequelize } = require('../config/Database');

const Participantes = sequelize.define('Participantes', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    gira_tecnica_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Participantes',
    indexes: [
        {
            unique: true,
            fields: ['id']
        }
    ],
});

module.exports = Participantes;