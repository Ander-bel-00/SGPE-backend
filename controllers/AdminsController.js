const Admin = require("../models/Admin");
const Usuarios = require("../models/Users");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

// Función para registrar un Admin.
exports.NewAdmin = async (req, res) => {
  try {
    // Si la tabla Usuarios no existe, crearla, si existe dejarla como está para no borrar datos.
    await Usuarios.sync({ force: false });
    // Si la tabla Admin no existe, crearla, si existe dejarla como está para no borrar datos.
    await Admin.sync({ force: false });

    // Obtener todos los campos y sus valores del cuerpo de la solicitud.
    const {
      numero_documento,
      correo_electronico,
      nombre,
      rol,
    } = req.body;

    // Variable que toma el valor de la contraseña envíada en el cuerpo de la solictud.
    let contrasena = req.body.contrasena;

    // Verificar si el usuario ya existe con el mismo número de documento o correo electrónico.
    const userExists = await Usuarios.findOne({
        where: {
          [Op.or]: [
            { numero_documento },
            { correo_electronico }
          ]
        }
    });

    // Si el usuario existe envíar un mensaje de error.
    if (userExists) return res.status(400).json({ 
        message: "El usuario ya está registrado con el número de documento o correo electrónico proporcionado" 
    });

    // Constante que guardará la contraseña encriptada tomando en campo contrasena que es el campo a encriptar y haciendo un salt de 10.
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    // La contraseña envíada en el cuerpo de la solicitud se encriptará antes de enviar a la base de datos.
    contrasena = hashedPassword;

    // Crea el Admin asociado al usuario.
    const newAdmin = await Admin.create({
        nombre,
        rol,
    });

    // Crea el usuario
    const newUser = await Usuarios.create({
        user_id: newAdmin.id,
        numero_documento,
        correo_electronico,
        contrasena,
    });

    // Combina los datos del usuario y del admin.
    const userData = {
      id: newUser.user_id,
      numero_documento: newUser.numero_documento,
      correo_electronico: newUser.correo_electronico,
      nombre: newAdmin.nombre,
      rol: newAdmin.rol,
    };

    // Envíar mensaje al usuario cuando el usuario se registró exitosamente.
    res.status(201).json({
        message: "El usuario ha sido registrado exitósamente",
        userData,
    });

  } catch (error) {
    // Mostrar mensaje de error en consola en caso de error al registrar el usuario.
    console.error("Hubo un error al crear el usuario", error);
    // Envíar respuesta al usuario en caso de error al registrar el usuario.
    res.status(500).json({ message: "Hubo un error al crear el usuario", error });
  }
};
