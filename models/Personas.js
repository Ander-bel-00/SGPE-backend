const {DataTypes} = require('sequelize');
const { sequelize } = require('../config/Database');

const Personas = sequelize.define('Personas', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    gira_tecnica_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    numero_documento: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        unique: true
    },
}, {
    sequelize,
    modelName: 'Personas',
    indexes: [
        {
            unique: true,
            fields: ['id']
        }
    ],
});

module.exports = Personas;