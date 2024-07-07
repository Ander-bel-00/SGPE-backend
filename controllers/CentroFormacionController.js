const  Regional = require('../models/Regional');
const CentroFormacion = require('../models/CentroFormacion');
const { Op } = require('sequelize');

exports.NewCentroFormacion = async (req,res,next) => {
    try {
        // Si la tabla Centro_formacion no existe, crearla, si existe dejarla como está para no borrar datos.
        await CentroFormacion.sync({ force: false });

        // Extraer el id y el nombre del cuerpo de la solicitud.
        const {id, nombre} = req.body;
        // Verificar que el centro de formacion a crear no coincida con el nombre de un centro de formacion existente.
        const CentroFormacionExistente = await CentroFormacion.findOne({
            where: {
                [Op.or]: [
                    {id},
                    {nombre}
                ]
            }
        });

        const regional = await Regional.findOne({
            where: {
                id: req.body.regional_id
            }
        });

        if (!regional) return res.status(400).json({
            message: 'No se encontró la regional con el id proporcionado'
        });

        // Si el centro de formacion existe enviar mensaje de error.
        if (CentroFormacionExistente) return res.status(400).json({ message: 'El centro de formación ya está registrado'});

        // Obtner toda la información enviada en el cuerpo de la solicitud.
        const CentroFormData = req.body;

        // Registrar el centro de formación con los datos enviados del cuerpo de la solicitud.
        const centroForm = await  CentroFormacion.create(CentroFormData);

        // Envíar mensaje al usuario al registrar exitósamente el centro de formación.
        res.status(201).json({
            message: "El centro de formación ha sido registrado exitosamente",
            centroForm
        });
    } catch (error) {
        // Mostrar mensaje de error en consola en caso de error al registrar el centro de formación.
        console.error('Hubo un error al registrar el centro de formación', error);
        // Envíar mensaje al usuario en caso de error al registrar el centro de formación.
        res.status(500).json({
            message: "Hubo un error al registrar el centro de formación",
            error
        });
        
        // Pasar el control al siguiente middleware en la cadena, en caso de un error.
        next();
    }
};

// Función para obtener todos los centros de formación.
exports.CentrosFormacion = async (req,res) => {
    try {
        // Obtenere todos los centros de formación disponibles en la base de datos.
        const centrosFormacion = await CentroFormacion.findAll();
        // Si no se encuentra al menos un centro de formación envíar mensaje de error.
        if (!centrosFormacion) return res.status(404).json({
            message: 'No se encontró ningún centro de formación'
        });

        // Envíar los centros de formación obtenidos.
        res.status(200).json({
            centrosFormacion
        });
    } catch (error) {
        // Mostrar mensaje de error en consola en caso de error al obtener los centro de formacion.
        console.error('Hubo un error al obtener los centros de formación', error);
        // Envíar mensaje al usuario en caso de error al obtener los centro de formacion.
        res.status(500).json({
            message: 'Hubo un error al obtener los centros de formación', error
        });
    }
};

// Función para obtener un centro de formación por su id.
exports.centrosFormacionByID = async (req,res) => {
    try {
        // Obtener un centro de formación por su id obtenido de los parametros de la solicitud.
        const centroFormacionExists = await CentroFormacion.findOne({
            where: {
                id: req.params.id
            }
        });
        
        // Envíar mensaje de error en caso de no encontrar el centro de formación por el id proporcionado.
        if (!centroFormacionExists) return res.status(404).json({
            message: 'No se ha encontrado un centro de formacion con el id proporcionado'
        });

        // Envíar los datos del centro de formación encontrado.
        res.status(200).json({
            centroFormacionExists
        });
    } catch (error) {
        // Mostrar mensaje de error en consola en caso de error al obtener el centro de formación.
        console.error('Hubo un error al obtener el centro de formación', error);
        // Envíar mensaje de error al usuario en caso de error al obtener el centro de formación.
        res.status(500).json({
            message: 'Hubo un error al obtener el centro de formación', error
        });
    }
};

// Función para actualizar los datos de un centro de formación.
exports.updateCentroFormacion = async (req,res) => {
    try {
        // Obtener un centro de formación por su id obtenido de los parametros de la solicitud.
        const centroFormacionExists = await CentroFormacion.findOne({
            where: {
                id: req.params.id
            }
        });
        
        // Envíar mensaje de error en caso de no encontrar el centro de formación por el id proporcionado.
        if (!centroFormacionExists) return res.status(404).json({
            message: 'No se ha encontrado un centro de formacion con el id proporcionado'
        });

        // Actualizar el centro de formación con los datos enviados en el cuerpo de la solicitud.
        const centroFormUpdate = await centroFormacionExists.update(req.body);

        // Envíar mensaje al usuario al actualizar correctamente los datos del centro de formación.
        res.status(201).json({
            message: 'Se ha actualizado el centro de formación exitósamente',
            centroFormUpdate
        });
    } catch (error) {
        // Mostrar mensaje de error en consola en caso de error al actualizar el centro de formación.
        console.error('Hubo un error al actualizar los datos del centro de formación', error);
        // Envíar mensaje de error al usuario en caso de error al actualizar el centro de formación.
        res.status(500).json({
            message: 'Hubo un error al actualizar los datos del centro de formación', error
        });
    }
};


// Función para eliminar un centro de formación.
exports.DeleteCentroFormacion = async (req,res) => {
    try {
        // Obtener un centro de formación por su id obtenido de los parametros de la solicitud.
        const centroFormacionExists = await CentroFormacion.findOne({
            where: {
                id: req.params.id
            }
        });
        
        // Envíar mensaje de error en caso de no encontrar el centro de formación por el id proporcionado.
        if (!centroFormacionExists) return res.status(404).json({
            message: 'No se ha encontrado un centro de formacion con el id proporcionado'
        });

        // Eliminar el centro de formación de la base de datos.
        await centroFormacionExists.destroy();

        // Envíar mensaje al eliminar un centro de formación.
        res.status(200).json({
            message: 'El centro de formación se ha eliminado exitosamente'
        });
    } catch (error) {
        // Mostrar mensaje de error en consola en caso de error al eliminar el centro de formación.
        console.error('Hubo un error al eliminar el centro de formación', error);
        // Envíar mensaje de error al usuario en caso de error al eliminar el centro de formación.
        res.status(500).json({
        message: 'Hubo un error al eliminar el centro de formación', error
        });
    }
};