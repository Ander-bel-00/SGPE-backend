const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/Database');

const Usuarios = sequelize.define('Usuarios', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    correo_electronico: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    rol: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    contrasena: {
        type: DataTypes.STRING(65),
        allowNull: false,
        validate: {
            len: {
                args: [8],
                msg: "La contraseña debe ser mínimo de 8 dígitos"
            }
          },
    }
}, {
    sequelize,
    modelName: 'Usuarios',
    indexes: [
        {
            unique: true,
            fields: ['id','correo_electronico']
        }
    ],
});

module.exports = Usuarios;
