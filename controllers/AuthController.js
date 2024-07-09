const Usuarios = require("../models/Users");
const Personas = require("../models/Personas");
const TipoDocumento = require("../models/TipoDocumento");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies.token;

  if (!authHeader) {
    return res.status(401).json({ message: "Acceso denegado. No se proporcionó token." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY || "SECRETKEY");

    if (token !== cookieToken) {
      return res.status(401).json({ message: "Token inválido" });
    }

    req.user = decoded; // El payload decodificado está disponible en req.user
    next();
  } catch (error) {
    console.error("Error de autenticación de token", error);
    return res.status(401).json({ message: "Token no válido", error: error.message });
  }
};

exports.iniciarSesion = async (req, res, next) => {
  try {
    const { tipo_documento, numero_documento, contrasena } = req.body;

    if (!tipo_documento || !numero_documento || !contrasena) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    const usuario = await obtenerUsuarioPorNumeroDocumento(numero_documento);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const DataDocument = await TipoDocumento.findOne({
      where: {
        persona_id: usuario.id,
        tipo_documento,
      },
    });

    if (!DataDocument) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    const DataUser = await Usuarios.findOne({
      where: {
        id: usuario.user_id,
      },
    });

    const contrasenaValida = await bcrypt.compare(contrasena, DataUser.contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const payload = {
      id: usuario.id,
      gira_tecnica_id: usuario.gira_tecnica_id,
      tipo_documento: DataDocument.tipo_documento,
      numero_documento: usuario.numero_documento,
      rol: DataUser.rol,
    };

    const token = jwt.sign(payload, process.env.TOKEN_SECRET_KEY || "SECRETKEY", { expiresIn: "4h" });

    res.cookie("token", token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return res.json({
      message: `Inicio de sesión exitoso como ${DataUser.rol}`,
      token,
      usuario: {
        id: usuario.id,
        gira_tecnica_id: usuario.gira_tecnica_id,
        tipo_documento: DataDocument.tipo_documento,
        numero_documento: usuario.numero_documento,
        rol: DataUser.rol,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión", error);
    return res.status(500).json({ message: "Hubo un error al procesar la solicitud", error });
  }
};

async function obtenerUsuarioPorNumeroDocumento(numero_documento) {
  try {
    const usuario = await Personas.findOne({ where: { numero_documento } });
    return usuario;
  } catch (error) {
    console.error("Error al buscar usuario por número de documento", error);
    throw error;
  }
}

exports.cerrarSesion = async (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  return res.sendStatus(200);
};
