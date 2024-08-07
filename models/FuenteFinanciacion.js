const {DataTypes} = require('sequelize');
const { sequelize } = require('../config/Database');

const FuenteFinanciacion = sequelize.define('fuentes_de_financiacion', {
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
    modelName: 'fuentes_de_financiacion',
    freezeTableName: true,  // Evita la pluralización del nombre de la tabla
    indexes: [
        {
            unique: true,
            fields: ['id']
        }
    ],
});

module.exports = FuenteFinanciacion;