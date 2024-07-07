const Regional = require("../models/Regional"); // Importar el modelo Regional para su uso.

// Función para registrar una regional.
exports.NewRegional = async (req, res, next) => {
  try {
    // Si la tabla Regional no existe, crearla, si existe dejarla como está para no borrar datos.
    await Regional.sync({ force: false });

    // Verificar que la regional a crear no coincida con el nombre de una regional existente.
    const RegionalExistente = await Regional.findOne({
      where: {
        nombre: req.body.nombre,
      },
    });

    // Si la regional existe enviar mensaje de error al usuario.  
    if (RegionalExistente) return res.status(400).json({ message: "La regional ya está registrada" });

    // Obtner toda la información enviada en el cuerpo de la solicitud.
    const RegionalData = req.body;

    // Registrar una regional con los datos almacenados en RegionalData que vienen del cuerpo de la solicitud.
    const regional = await Regional.create(RegionalData);

    // Envíar respuesta al usuario al registrar la regional exitosamente.
    res.status(201).json({ message: "La regional se ha registrado exitosamente", regional });
  } catch (error) {
    // Mostrar mensaje de error en consola en caso de error al registrar la regional.
    console.error("Hubo un error al registrar la regional", error);
    // Envíar mensaje al usuario en caso de error al registrar la regional.
    res.status(500).json({ message: "Hubo un error al registrar la regional", error });

    // Pasar el control al siguiente middleware en la cadena, en caso de un error.
    next();
  }
};

// Función para obtener todas las regionales.
exports.Regionales = async (req,res) => {
  try {
    // Obtener todas las regionales disponibles en la base de datos.
    const Regionales = await Regional.findAll();

    // Envíar mensaje de error en caso de no encontrar al menos una regional.
    if (!Regionales) return res.status(404).json({ message: 'No se encontró ninguna regional' });

    // Envíar al usuario todas las regionales encontradas.
    res.status(200).json({ Regionales});
  } catch (error) {
    // Mostrar mensaje de error en consola en caso de error al obtener todas las regionales.
    console.error('Hubo un error al obtener todas las regionales', error);
    // Envíar mensaje de error al usuario en caso de error al obtener todas las regionales.
    res.status(500).json({message: 'Hubo un error al obtener todas las regionales', error});
  }
};

// Función para obtener una regional por su ID.
exports.RegionalByID = async (req,res) => {
  try {
    // Extraer el id de la regional obtenido por los parametros de la solicitud.
    const regionalID = req.params.id;
    // Buscar la regional por su primary key, compara que su primary key coincida con el id proporcionado.
    const regional = await Regional.findByPk(regionalID);

    // Si no se encuentra la regional envíar mensaje de error.
    if (!regional) return res.status(404).json({ message: 'No se encontró la regional por el ID proporcionado'});

    // Envíar los datos de la regional encontrada.
    res.status(200).json({ regional });
  } catch (error) {
    // Mostrar mensaje de error en consola en caso de error al obtener la regional.
    console.error('Hubo un error al obtener la regional', error);
    // Envíar mensaje de error al usuario en caso de error al obtener la regional.
    res.status(500).json({
      message: 'Hubo un error al obtener la regional', error
    });
  }
};

// Función para actualizar los datos de una Regional.
exports.UpadateRegional = async (req,res) => {
  try {
    // Obtener el id de la regional a buscar por los parametros de la solicitud.
    const regionalID = req.params.id;
    // Buscar una regional por el id proporcionado.
    const regional = await Regional.findOne({
      // Buscar la regional donde el id de la regional sea igual al id proporcionado por params.
      where: {
        id: regionalID
      }
    });

    // Si no se encuentra la regional enviar mensaje de error.
    if (!regional) return res.status(404).json({ message: 'No se encontró la regional por el ID proporcionado'});

    // Actualizar la regional con los datos enviados en el cuerpo de la solicitud.
    const regionalUpdate = await regional.update(req.body);

    // Envíar respuesta al usuario cuando la regional se actualizó correctamente.
    res.status(201).json({ 
      message: 'La regional se ha actualizado exitósamente',
      regionalUpdate
    });
  } catch (error) {
    // Mostrar mensaje de error en consola en caso de error al actualizar la regional.
    console.error('Hubo un error al actualizar la regional', error);
    // Envíar mensaje de error al usuario en caso de ocurrir un error al actualizar la regional.
    res.status(400).json({ 
      message: 'Hubo un error al actualizar la regional', error
    });
  }
};

// Función para eliminar una regional.
exports.DeleteRegional = async (req,res) => {
  try {
     // Obtener el id de la regional a buscar por los parametros de la solicitud.
     const regionalID = req.params.id;
     // Buscar una regional por el id proporcionado.
     const regional = await Regional.findOne({
       // Buscar la regional donde el id de la regional sea igual al id proporcionado por params.
       where: {
         id: regionalID
       }
     });
 
     // Si no se encuentra la regional enviar mensaje de error.
     if (!regional) return res.status(404).json({ message: 'No se encontró la regional por el ID proporcionado'});

     // Eliminar la regional de la base de datos.
     await regional.destroy();

     // Envíar mensaje al usuario cuando la regional se eliminó exitósamente.
     res.status(200).json({
      message: 'La regional se ha eliminado exitósamente'
     });
  } catch (error) {
    // Mostrar mensaje de error en consola en caso de error al eliminar la regional.
    console.error('Hubo un error al eliminar la regional', error);
    // Envíar mensaje de error al usuario en caso de error al eliminar la regional.
    res.status(500).json({
      message: 'Hubo un error al eliminar la regional', error
    });
  }
};