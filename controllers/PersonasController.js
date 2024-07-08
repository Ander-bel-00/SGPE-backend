const Usuarios = require("../models/Users");
const Personas = require("../models/Personas");
const TipoDocumento = require('../models/TipoDocumento');
const bcrypt = require("bcryptjs");
const GiraTecnica = require("../models/GiraTecnica");
const { Op } = require("sequelize");
// Función para registrar usuarios.
exports.NewUser = async (req, res, next) => {
  try {
    // Si la tabla Usuarios no existe, crearla, si existe dejarla como está para no borrar datos.
    await Usuarios.sync({ force: false });
    // Si la tabla Personas no existe, crearla, si existe dejarla como está para no borrar datos.
    await Personas.sync({ force: false });
    // Si la tabla Tipos de documentos no existe, crearla, si existe dejarla como está para no borrar datos.
    await TipoDocumento.sync({ force: false});
    // Obtener todos los campos y sus valores del cuerpo de la solicitud.
    const {
      id_person,
      id_user,
      id_tipo_documento,
      nombre,
      apellido,
      rol,
      correo_electronico,
      tipo_documento,
      numero_documento,
      gira_tecnica_id,
    } = req.body;

    // Variable que toma el valor de la contraseña envíada en el cuerpo de la solictud.
    let contrasena = req.body.contrasena;

    // Verificar si la gira técnica existe.
    const giraTecnica = await GiraTecnica.findByPk(gira_tecnica_id);

    if (req.body.gira_tecnica_id) {
      if(!giraTecnica) return res.status(404).json({
        message: 'No se encontró la gira técnica con el id proporcionado'
      });
    }

    // Verificar si el usuario ya existe con el mismo número de documento o correo electrónico.
    const userExists = await Usuarios.findOne({
      where: {
        [Op.or]: [
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

    // Crea el usuario
    const newUser = await Usuarios.create({
      id: id_user,
      nombre,
      apellido,
      correo_electronico,
      rol,
      contrasena,
    });

    // Crea el participante asociado al usuario.
    const newPerson = await Personas.create({
      id: id_person,
      user_id: id_user,
      numero_documento,
      gira_tecnica_id,
    });

    const newTipoDocumento = await TipoDocumento.create({
      id: id_tipo_documento,
      persona_id: newPerson.id,
      tipo_documento,
    });

    // Combina los datos del usuario y del participante
    const userData = {
      id: newPerson.id,
      usuario_id: newUser.id,
      tipo_documento: newTipoDocumento.tipo_documento,
      numero_documento: newPerson.numero_documento,
      correo_electronico: newUser.correo_electronico,
      nombre: newUser.nombre,
      apellido: newUser.apellido,
      gira_tecnica_id: newPerson.gira_tecnica_id,
      rol: newUser.rol,
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

// Función para obtener todos los usuarios de la base de datos.
exports.GetAllUsers = async (req, res) => {
  try {
    // Obtener todos los Personas y usuarios de la base de datos.
    const personas = await Personas.findAll();
    const users = await Usuarios.findAll();

    // Verificar si no se encontraron Personas o usuarios.
    if (!personas || !users) {
      return res.status(404).json({
        message: 'No se han podido encontrar usuarios',
      });
    }

    // Combinar los datos de usuarios y Personas en un array de objetos.
    const usersInfo = await Promise.all(users.map(async user => {
      // Buscar el participante correspondiente al usuario.
      const participante = personas.find(part => part.user_id === user.id);

      if (participante) {
        const tipoDocumento = await TipoDocumento.findOne({
          where: {
            persona_id: participante.id
          }
        });

        return {
          id: participante.id,
          tipo_documento: tipoDocumento ? tipoDocumento.tipo_documento : null,
          numero_documento: user.numero_documento,
          nombre: user.nombre,
          apellido: user.apellido,
          correo_electronico: user.correo_electronico,
          gira_tecnica_id: participante.gira_tecnica_id,
          rol: user.rol,
        };
      } else {
        return {
          id: null,
          tipo_documento: null,
          numero_documento: user.numero_documento,
          nombre: user.nombre,
          apellido: user.apellido,
          correo_electronico: user.correo_electronico,
          gira_tecnica_id: null,
          rol: user.rol,
        };
      }
    }));

    // Enviar la respuesta con la información de los usuarios.
    res.status(200).json({ usersInfo });
  } catch (error) {
    // Mostrar un mensaje de error en la consola.
    console.error('Hubo un error al obtener los usuarios', error);
    // Enviar un mensaje de error al cliente.
    res.status(500).json({
      message: 'Hubo un error al obtener los usuarios',
      error,
    });
  }
};

// Función para obtener todos los usuarios.
exports.UsuarioID = async (req,res) => {
  try {
    const Persona = await Personas.findOne({
      where: {
        id: req.params.id
      }
    });

    const tipoDeDocumento = await TipoDocumento.findOne({
      where: {
        persona_id: req.params.id
      }
    });

    const usuarios = await Usuarios.findOne({
      where: {
        id: Persona.user_id
      }
    });

    if(!Persona && !usuarios) return res.status(404).json({
      message: 'No se ha encontrado el usuario con el id proporcionado'
    });

    const usersInfo = {
      id: usuarios.user_id,
      tipo_documento: tipoDeDocumento.tipo_documento,
      numero_documento: Persona.numero_documento,
      nombre: usuarios.nombre,
      apellido: usuarios.apellido,
      correo_electronico: usuarios.correo_electronico,
      gira_tecnica_id: Persona.gira_tecnica_id,
      rol: usuarios.rol,
    }

    res.status(200).json({
      usersInfo
    });
  } catch (error) {
    console.error('Hubo un error al obtener el usuario', error);
    res.status.json({
      message: 'Hubo un error al obtener el usuario', error
    });
  }
};

// Función para actualizar los datos de un usuario.
exports.updateUser = async (req, res, next) => {
  try {
    // Obtener el ID del usuario de los parámetros de la solicitud.
    const userId = req.params.id;

    // Buscar el participante correspondiente al usuario.
    const participante = await Personas.findByPk(userId);

    // Si no se encuentra el participante, devolver un error.
    if (!participante) {
      return res.status(404).json({ message: 'No se encontró el participante correspondiente al usuario' });
    }

    // Buscar el tipo de documento por el id de la persona.
    const tipoDocumento = await TipoDocumento.findOne({
      where: {
        persona_id: participante.id
      }
    });

    // Buscar el usuario en la base de datos por su ID.
    const user = await Usuarios.findOne({
      where: {
        id: participante.user_id
      }
    });

    // Si no se encuentra el usuario, devolver un error.
    if (!user) {
      return res.status(404).json({ message: 'No se encontró el usuario por el ID proporcionado' });
    }

    // Verificar que el correo electrónico no coincida con el de otro usuario, excluyendo el usuario actual.
    const correoUsed = await Usuarios.findOne({
      where: {
        correo_electronico: req.body.correo_electronico,
        id: { [Op.ne]: user.id }
      }
    });

    // Si el correo coincide con el de otro usuario enviar mensaje de error.
    if (correoUsed) {
      return res.status(400).json({
        message: "El correo electrónico ya está en uso"
      });
    }

    // Actualizar los datos del usuario.
    await user.update({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      correo_electronico: req.body.correo_electronico,
      rol: req.body.rol,
    });

    // Actualizar los datos del participante.
    await participante.update({
      numero_documento: req.body.numero_documento,
      gira_tecnica_id: req.body.gira_tecnica_id,
    });

    // Actualizar el tipo de documento.
    await tipoDocumento.update({
      tipo_documento: req.body.tipo_documento,
    });

    // Combinar los datos actualizados del usuario.
    const updatedUserInfo = {
      id: participante.id,
      tipo_documento: tipoDocumento.tipo_documento,
      numero_documento: participante.numero_documento,
      correo_electronico: user.correo_electronico,
      nombre: user.nombre,
      apellido: user.apellido,
      gira_tecnica_id: participante.gira_tecnica_id,
      rol: user.rol,
    };

    // Enviar la respuesta con los datos combinados actualizados.
    res.status(200).json({
      message: 'El usuario se ha actualizado exitosamente',
      updatedUserInfo,
    });
  } catch (error) {
    // Mostrar un mensaje de error en la consola.
    console.error('Hubo un error al actualizar el usuario', error);
    // Enviar un mensaje de error al cliente.
    res.status(500).json({
      message: 'Hubo un error al actualizar el usuario',
      error,
    });

    // Pasar el control al siguiente middleware en la cadena de manejo de errores.
    next();
  }
};

// Función para eliminar un usuario por su id.
exports.DeleteUser = async (req, res) => {
  try {
    // Obtener el ID del usuario de los parámetros de la solicitud.
    const userId = req.params.id;

    // Buscar el participante correspondiente al usuario.
    const participante = await Personas.findOne({
      where: {
        id: userId
      }
    });

    // Si no se encuentra el participante, devolver un error.
    if (!participante) {
      return res.status(404).json({ message: 'No se encontró el participante correspondiente al usuario' });
    }

    // Buscar el usuario en la base de datos por su ID.
    const user = await Usuarios.findOne({
      where: {
        id: participante.user_id
      }
    });

    // Si no se encuentra el usuario, devolver un error.
    if (!user) {
      return res.status(404).json({ message: 'No se encontró el usuario por el ID proporcionado' });
    }

    // Buscar el tipo de documento correspondiente al participante.
    const tipoDocumento = await TipoDocumento.findOne({
      where: {
        persona_id: participante.id
      }
    });

    // Eliminar el tipo de documento relacionado al participante.
    if (tipoDocumento) {
      await tipoDocumento.destroy();
    }

    // Eliminar el participante relacionado al usuario.
    await participante.destroy();

    // Eliminar el usuario de la base de datos.
    await user.destroy();

    // Enviar mensaje al eliminar exitosamente un usuario.
    res.status(200).json({
      message: 'El usuario se ha eliminado exitosamente'
    });
  } catch (error) {
    // Mostrar mensaje de error en consola en caso de error al eliminar un usuario.
    console.error('Hubo un error al eliminar un usuario', error);
    res.status(500).json({
      message: 'Hubo un error al eliminar un usuario', error
    });
  }
};