const {DataTypes} = require('sequelize');
const { sequelize } = require('../config/Database');

const GiraTecnica = sequelize.define('giras_tecnicas', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    centro_formacion_id:{
        type: DataTypes.UUID,
        allowNull: false,
    },
    fuente_financiacion_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    objetivo_general: {
        type: DataTypes.STRING(1500),
        allowNull: false
    },
    resultado_esperado: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    valor_total: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    observacion: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Observaciones generales'
    }
}, {
    sequelize,
    modelName: 'giras_tecnicas',
    indexes: [
        {
            unique: true,
            fields: ['id']
        }
    ],
});

module.exports = GiraTecnica;