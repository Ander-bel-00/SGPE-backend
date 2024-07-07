const Usuarios = require('../models/Users');
const Personas = require('../models/Personas');
const Admin = require('../models/Admin');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Función para iniciar sesión.
exports.iniciarSesion = async (req,res,next) => {
    try {
        const { numero_documento, contrasena } = req.body;

        // Verificar si el número de documento y la contraseña están vacíos
        if (!numero_documento || !contrasena) {
            return res.status(400).json({
                message: "El número de documento y la contraseña son requeridos",
            });
        }


    } catch (error) {
        
    }
};

// Función para obtener usuario por número de documento y rol
async function obtenerUsuarioPorNumeroDocumento(numero_documento) {
    let usuario;
    usuario = await Personas.findOne({ where: { numero_documento } });
    if (!usuario) {
      return res.status(400).json({ 
        message: 'Usuario no encontrado'
      });
    }
    if (!usuario) {
      usuario = await Instructores.findOne({ where: { numero_documento } });
    }
    return usuario;
}