const GiraTecnicaModel = require('../models/GiraTecnica');

// Función para registrar una nueva gira técnica.
exports.NewGiraTecnica = async (req, res, next) => {
    try {
        await GiraTecnicaModel.sync({ force: false });

        const GiraTecnicaData = req.body;
        
        const GiraTecnica = await GiraTecnicaModel.create(GiraTecnicaData);

        res.status(201).json({
            message: 'La gira técnica se ha registrado exitosamente',
            GiraTecnica
        });
    } catch (error) {
        console.error('Hubo un error al registrar la gira técnica', error);
        res.status(400).json({
            message: 'Hubo un error al registrar la gira técnica', error
        });
    }
};

// Función para obtener todas las giras técnicas.
exports.getAllGirasTecnicas = async (req, res) => {
  try {
    // Obtener todas las giras técnicas de la base de datos.
    const girasTecnicas = await GiraTecnicaModel.findAll();
    // Devolver una respuesta exitosa con todas las giras técnicas.
    res.status(200).json({ girasTecnicas });
  } catch (error) {
    // Mostrar un mensaje de error en la consola.
    console.error('Hubo un error al obtener las giras técnicas', error);
    // Devolver un mensaje de error al cliente.
    res.status(500).json({ message: 'Hubo un error al obtener las giras técnicas', error });
  }
};

// Función para obtener una gira técnica por su ID.
exports.getGiraTecnicaByID = async (req, res) => {
  try {
    // Obtener el ID de la gira técnica de los parámetros de la solicitud.
    const giraTecnicaID = req.params.id;
    // Buscar la gira técnica en la base de datos por su ID.
    const giraTecnica = await GiraTecnicaModel.findByPk(giraTecnicaID);

    // Si no se encuentra la gira técnica, devolver un error.
    if (!giraTecnica) return res.status(404).json({ message: 'No se encontró la gira técnica por el ID proporcionado' });

    // Devolver una respuesta exitosa con los datos de la gira técnica encontrada.
    res.status(200).json({ giraTecnica });
  } catch (error) {
    // Mostrar un mensaje de error en la consola.
    console.error('Hubo un error al obtener la gira técnica', error);
    // Devolver un mensaje de error al cliente.
    res.status(500).json({ message: 'Hubo un error al obtener la gira técnica', error });
  }
};

// Función para actualizar una gira técnica.
exports.updateGiraTecnica = async (req, res, next) => {
  try {
    // Obtener el ID de la gira técnica de los parámetros de la solicitud.
    const giraTecnicaID = req.params.id;
    // Buscar la gira técnica en la base de datos por su ID.
    const giraTecnica = await GiraTecnicaModel.findOne({
      where: {
        id: giraTecnicaID
      }
    });

    // Si no se encuentra la gira técnica, devolver un error.
    if (!giraTecnica) return res.status(404).json({ message: 'No se encontró la gira técnica por el ID proporcionado' });

    // Actualizar los datos de la gira técnica con los nuevos datos proporcionados en el cuerpo de la solicitud.
    await giraTecnica.update(req.body);

    // Devolver una respuesta exitosa indicando que la gira técnica se ha actualizado.
    res.status(200).json({ message: 'La gira técnica se ha actualizado exitosamente',
        giraTecnica
     });
  } catch (error) {
    // Mostrar un mensaje de error en la consola.
    console.error('Hubo un error al actualizar la gira técnica', error);
    // Devolver un mensaje de error al cliente.
    res.status(500).json({ message: 'Hubo un error al actualizar la gira técnica', error });

    // Pasar el control al siguiente middleware en la cadena de manejo de errores.
    next();
  }
};

// Función para eliminar una gira técnica.
exports.deleteGiraTecnica = async (req, res, next) => {
  try {
    // Obtener el ID de la gira técnica de los parámetros de la solicitud.
    const giraTecnicaID = req.params.id;
    // Buscar la gira técnica en la base de datos por su ID.
    const giraTecnica = await GiraTecnicaModel.findOne({
      where: {
        id: giraTecnicaID
      }
    });

    // Si no se encuentra la gira técnica, devolver un error.
    if (!giraTecnica) return res.status(404).json({ message: 'No se encontró la gira técnica por el ID proporcionado' });

    // Eliminar la gira técnica de la base de datos.
    await GiraTecnicaModel.destroy({
      where: {
        id: giraTecnicaID
      }
    });

    // Devolver una respuesta exitosa indicando que la gira técnica se ha eliminado.
    res.status(200).json({ message: 'La gira técnica se ha eliminado exitosamente' });
  } catch (error) {
    // Mostrar un mensaje de error en la consola.
    console.error('Hubo un error al eliminar la gira técnica', error);
    // Devolver un mensaje de error al cliente.
    res.status(500).json({ message: 'Hubo un error al eliminar la gira técnica', error });

    // Pasar el control al siguiente middleware en la cadena de manejo de errores.
    next();
  }
};
