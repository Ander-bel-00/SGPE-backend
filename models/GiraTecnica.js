const {DataTypes} = require('sequelize');
const { sequelize } = require('../config/Database');

const GiraTecnica = sequelize.define('gira_tecnica', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    regional_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    centro_formacion_id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    fuente_financiacion_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    objetivo_general: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resultado_esperado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    valor_total: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    observaciones: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Observaciones generales'
    }
}, {
    sequelize,
    modelName: 'gira_tecnica',
    freezeTableName: true,  // Evita la pluralización del nombre de la tabla
    indexes: [
        {
            unique: true,
            fields: ['id']
        }
    ],
});

module.exports = GiraTecnica;