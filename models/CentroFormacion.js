const {DataTypes} = require('sequelize');
const { sequelize } = require('../config/Database');

const CentroFormacion = sequelize.define('centros_de_formacion', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    regional_id: {
        type: DataTypes.UUID,
        allowNull: false,
    }
},{
    sequelize,
    modelName: 'centros_de_formacion',
    freezeTableName: true,  // Evita la pluralización del nombre de la tabla
    indexes: [
        {
            unique: true,
            fields: ['id']
        }
    ],
});

module.exports = CentroFormacion;