const {DataTypes} = require('sequelize');
const { sequelize } = require('../config/Database');

const CentroFormacion = sequelize.define('centro_formacion', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    regional_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    }
},{
    sequelize,
    modelName: 'centro_formacion',
    freezeTableName: true,  // Evita la pluralización del nombre de la tabla
    indexes: [
        {
            unique: true,
            fields: ['id']
        }
    ],
});

module.exports = CentroFormacion;