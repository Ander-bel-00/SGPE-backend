const {DataTypes} = require('sequelize');
const { sequelize } = require('../config/Database');

const FuenteFinanciacion = sequelize.define('fuente_financiacion', {
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
    modelName: 'fuente_financiacion',
    freezeTableName: true,  // Evita la pluralización del nombre de la tabla
    indexes: [
        {
            unique: true,
            fields: ['id']
        }
    ],
});

module.exports = FuenteFinanciacion;