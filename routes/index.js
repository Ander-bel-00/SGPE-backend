const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const RegionalController = require("../controllers/RegionalController");
const CentroFormacionController = require("../controllers/CentroFormacionController");
const FuenteFinanciacionController = require("../controllers/FuenteFinanciacionController");
const GiraTecnicaController = require("../controllers/GiraTecnicaController");
const UsersController = require("../controllers/PersonasController");
const FormsController = require('../controllers/FormsController');

module.exports = function () {
  // *** Rutas para Regionales. ***

  // *** Rutas para la autenticación. ***
  router.post("/api/auth/login", AuthController.iniciarSesion);
  // Ruta para cerrar sesión
  router.post("/api/auth/logout", AuthController.cerrarSesion);
  // Ruta para obtener la información del usuario autenticado.
  router.get("/api/usuario", AuthController.authenticateToken, (req, res) => {
    res.json({ usuario: req.user }); // req.user contiene el payload decodificado
  });

  // Ruta para la creación de regionales.
  router.post("/api/register/regional", RegionalController.NewRegional);
  // Ruta para obtener todas las regionales.
  router.get(
    "/api/regionales",
    AuthController.authenticateToken,
    RegionalController.Regionales
  );
  // Ruta para obtener una regional por su ID.
  router.get("/api/regional/:id", RegionalController.RegionalByID);
  // Ruta para actualizar los datos de una regional.
  router.put("/api/update/regional/:id", RegionalController.UpadateRegional);
  // Ruta para eliminar una regional.
  router.delete("/api/delete/regional/:id", RegionalController.DeleteRegional);

  // *** Rutas para Centros de Formación. ***

  // Ruta para la creación de centros de formación.
  router.post(
    "/api/register/centro_formacion",
    CentroFormacionController.NewCentroFormacion
  );
  // Ruta para obtener todos los centros de formación.
  router.get(
    "/api/centros_formacion",
    CentroFormacionController.CentrosFormacion
  );
  // Ruta para obtener un centro de formación por su ID.
  router.get(
    "/api/centro_formacion/:id",
    CentroFormacionController.centrosFormacionByID
  );
  // Ruta para actualizar los datos de un centro de formación.
  router.put(
    "/api/update/centro_formacion/:id",
    CentroFormacionController.updateCentroFormacion
  );
  // Ruta para eliminar un centro de formación.
  router.delete(
    "/api/delete/centro_formacion/:id",
    CentroFormacionController.DeleteCentroFormacion
  );

  // *** Rutas para Fuentes de Financiación. ***

  // Ruta para la creación de fuentes de financiación.
  router.post(
    "/api/register/fuente_financiacion",
    FuenteFinanciacionController.NewFuenteFinanciacion
  );
  // Ruta para obtener todas las fuentes de financiación.
  router.get(
    "/api/fuentes_financiacion",
    FuenteFinanciacionController.getAllFuentesFinanciacion
  );
  // Ruta para obtener una fuente de financiación por su ID.
  router.get(
    "/api/fuente_financiacion/:id",
    FuenteFinanciacionController.getFuenteFinanciacionByID
  );
  // Ruta para actualizar los datos de una fuente de finanaciación.
  router.put(
    "/api/update/fuente_financiacion/:id",
    FuenteFinanciacionController.updateFuenteFinanciacion
  );
  // Ruta para eliminar una fuente de financiación.
  router.delete(
    "/api/delete/fuente_financiacion/:id",
    FuenteFinanciacionController.deleteFuenteFinanciacion
  );

  // *** Rutas para Giras Técnicas. ***

  // Ruta para la creación de giras técnicas.
  router.post(
    "/api/register/gira_tecnica",
    GiraTecnicaController.NewGiraTecnica
  );
  // Ruta para obtener todas las giras técnicas.
  router.get("/api/giras_tecnicas", GiraTecnicaController.getAllGirasTecnicas);
  // Ruta para obtener una gira técnica por su id.
  router.get("/api/gira_tecnica/:id", GiraTecnicaController.getGiraTecnicaByID);
  // Ruta para actualizar los datos de una gira técnica.
  router.put(
    "/api/update/gira_tecnica/:id",
    GiraTecnicaController.updateGiraTecnica
  );
  // Ruta para eliminar una gira técnica.
  router.delete(
    "/api/delete/gira_tecnica/:id",
    GiraTecnicaController.deleteGiraTecnica
  );

  // *** Rutas para Usuarios. ***

  // Ruta para la creación de usuarios.
  router.post("/api/auth/register/users", UsersController.NewUser);
  // Ruta para obtener todos los usuarios de la base de datos.
  router.get("/api/users", UsersController.GetAllUsers);
  // Ruta para obtener un usuario por su ID.
  router.get("/api/user/:id", UsersController.UsuarioID);
  // Ruta para actualizar los datos de un usuario.
  router.put("/api/update/user/:id", UsersController.updateUser);
  // Ruta para eliminar un usuario de la base de datos.
  router.delete("/api/delete/user/:id", UsersController.DeleteUser);

  // *** Rutas para el constructor de formularios. ***
  router.post('/api/new-form', FormsController.newForm);
  router.get('/api/forms', FormsController.getForms);

  return router;
};
