const {DataTypes} = require('sequelize');
const { sequelize } = require('../config/Database');

const TipoDocumento = sequelize.define('tipos_de_documento', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    persona_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    tipo_documento: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    modelName: 'tipos_de_documento',
    freezeTableName: true,
});

module.exports = TipoDocumento;