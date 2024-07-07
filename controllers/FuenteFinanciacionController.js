const FuenteFinacionModel = require('../models/FuenteFinanciacion');

// Función para registrar una nueva fuente de financiación.
exports.NewFuenteFinanciacion = async (req, res, next) => {
    try {
        // Sincronizar el modelo FuenteFinacionModel con la base de datos sin forzar la recreación de la tabla si ya existe.
        await FuenteFinacionModel.sync({ force: false });

        // Buscar si ya existe una fuente de financiación con el mismo nombre.
        const FuenteFinanciacionExistente = await FuenteFinacionModel.findOne({
            where: {
                nombre: req.body.nombre
            }
        });

        // Si ya existe una fuente de financiación con ese nombre, devolver un error.
        if (FuenteFinanciacionExistente) return res.status(400).json({
            message: 'La fuente de financiación ya está registrada'
        });

        // Obtener los datos de la nueva fuente de financiación del cuerpo de la solicitud.
        const FuenteFinanciacionData = req.body;

        // Crear una nueva fuente de financiación en la base de datos.
        const FuenteFinanciacion = await FuenteFinacionModel.create(FuenteFinanciacionData);

        // Devolver una respuesta exitosa con los datos de la nueva fuente de financiación.
        res.status(201).json({
            message: 'La fuente de financiación se ha registrado exitosamente',
            FuenteFinanciacion
        });
    } catch (error) {
        // Mostrar un mensaje de error en la consola.
        console.error('Hubo un error al registrar la fuente de financiación', error);
        // Devolver un mensaje de error al cliente.
        res.status(500).json({
            message: 'Hubo un error al registrar la fuente de financiación', error
        });

        // Pasar el control al siguiente middleware en la cadena de manejo de errores.
        next();
    }
};

// Función para obtener todas las fuentes de financiación.
exports.getAllFuentesFinanciacion = async (req, res) => {
    try {
        // Obtener todas las fuentes de financiación de la base de datos.
        const fuentes = await FuenteFinacionModel.findAll();
        // Devolver una respuesta exitosa con todas las fuentes de financiación.
        res.status(200).json({ fuentes });
    } catch (error) {
        // Mostrar un mensaje de error en la consola.
        console.error('Hubo un error al obtener las fuentes de financiación', error);
        // Devolver un mensaje de error al cliente.
        res.status(500).json({ message: 'Hubo un error al obtener las fuentes de financiación', error });
    }
};

// Función para obtener una fuente de financiación por su ID.
exports.getFuenteFinanciacionByID = async (req, res) => {
    try {
        // Obtener el ID de la fuente de financiación de los parámetros de la solicitud.
        const fuenteID = req.params.id;
        // Buscar la fuente de financiación en la base de datos por su ID.
        const fuente = await FuenteFinacionModel.findByPk(fuenteID);

        // Si no se encuentra la fuente de financiación, devolver un error.
        if (!fuente) return res.status(404).json({ message: 'No se encontró la fuente de financiación por el ID proporcionado' });

        // Devolver una respuesta exitosa con los datos de la fuente de financiación encontrada.
        res.status(200).json({ fuente });
    } catch (error) {
        // Mostrar un mensaje de error en la consola.
        console.error('Hubo un error al obtener la fuente de financiación', error);
        // Devolver un mensaje de error al cliente.
        res.status(500).json({ message: 'Hubo un error al obtener la fuente de financiación', error });
    }
};

// Función para actualizar una fuente de financiación.
exports.updateFuenteFinanciacion = async (req, res, next) => {
    try {
        // Obtener el ID de la fuente de financiación de los parámetros de la solicitud.
        const fuenteID = req.params.id;
        // Buscar la fuente de financiación en la base de datos por su ID.
        const fuente = await FuenteFinacionModel.findOne({
            where: {
                id: fuenteID
            }
        });

        // Si no se encuentra la fuente de financiación, devolver un error.
        if (!fuente) return res.status(404).json({ message: 'No se encontró la fuente de financiación por el ID proporcionado' });

        // Actualizar la fuente de financiación con los nuevos datos proporcionados en el cuerpo de la solicitud.
        await fuente.update(req.body);

        // Devolver una respuesta exitosa indicando que la fuente de financiación se ha actualizado.
        res.status(200).json({ message: 'La fuente de financiación se ha actualizado exitosamente', fuente});
    } catch (error) {
        // Mostrar un mensaje de error en la consola.
        console.error('Hubo un error al actualizar la fuente de financiación', error);
        // Devolver un mensaje de error al cliente.
        res.status(500).json({ message: 'Hubo un error al actualizar la fuente de financiación', error });

        // Pasar el control al siguiente middleware en la cadena de manejo de errores.
        next();
    }
};

// Función para eliminar una fuente de financiación.
exports.deleteFuenteFinanciacion = async (req, res, next) => {
    try {
        // Obtener el ID de la fuente de financiación de los parámetros de la solicitud.
        const fuenteID = req.params.id;
        // Buscar la fuente de financiación en la base de datos por su ID.
        const fuente = await FuenteFinacionModel.findOne({
            where: {
                id: fuenteID
            }
        });

        // Si no se encuentra la fuente de financiación, devolver un error.
        if (!fuente) return res.status(404).json({ message: 'No se encontró la fuente de financiación por el ID proporcionado' });

        // Eliminar la fuente de financiación de la base de datos.
        await fuente.destroy();

        // Devolver una respuesta exitosa indicando que la fuente de financiación se ha eliminado.
        res.status(200).json({ message: 'La fuente de financiación se ha eliminado exitosamente' });
    } catch (error) {
        // Mostrar un mensaje de error en la consola.
        console.error('Hubo un error al eliminar la fuente de financiación', error);
        // Devolver un mensaje de error al cliente.
        res.status(500).json({ message: 'Hubo un error al eliminar la fuente de financiación', error });

        // Pasar el control al siguiente middleware en la cadena de manejo de errores.
        next();
    }
};
