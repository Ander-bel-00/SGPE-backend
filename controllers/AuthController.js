const Usuarios = require("../models/Users");
const Personas = require("../models/Personas");
const TipoDocumento = require("../models/TipoDocumento");
const BlacklistToken = require("../models/BlacklistToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Clave secreta para cifrado y descifrado (debe ser de 32 bytes)
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY ||
  crypto.randomBytes(32).toString("hex").slice(0, 32); // Genera una clave de 32 bytes si no se proporciona una

const IV_LENGTH = 16; // Tamaño del vector de inicialización

// Función para cifrar texto
function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

// Función para descifrar texto
function decrypt(text) {
  let textParts = text.split(":");
  let iv = Buffer.from(textParts.shift(), "hex");
  let encryptedText = Buffer.from(textParts.join(":"), "hex");
  let decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

exports.authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ message: "Acceso denegado. No se proporcionó token." });

  try {
    // Verificar si el token está en la lista negra
    const blacklistedToken = await BlacklistToken.findOne({ where: { token } });
    if (blacklistedToken) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET_KEY || "SECRETKEY"
    );
    const decryptedPayload = JSON.parse(decrypt(decoded.data));
    req.user = decryptedPayload; // Agregar los datos del usuario a la solicitud

    next();
  } catch (error) {
    console.error("Token no válido", error);
    res.status(401).json({ message: "Token no válido" });
  }
};

// Función para iniciar sesión
exports.iniciarSesion = async (req, res, next) => {
  try {
    const { tipo_documento, numero_documento, contrasena } = req.body;

    // Verificar si el número de documento y la contraseña están vacíos
    if (!tipo_documento) {
      return res.status(400).json({
        message: "El tipo de documento es requerido",
      });
    }

    // Verificar si el número de documento y la contraseña están vacíos
    if (!numero_documento || !contrasena) {
      return res.status(400).json({
        message: "El número de documento y la contraseña son requeridos",
      });
    }

    // Buscar al usuario por número de documento
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

    const DataUser = await Usuarios.findOne({
      where: {
        id: usuario.user_id,
      },
    });

    // Verificar la contraseña
    const contrasenaValida = await bcrypt.compare(
      contrasena,
      DataUser.contrasena
    );

    if (!contrasenaValida) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Datos del payload
    const payload = JSON.stringify({
      id: usuario.id,
      tipo_documento: DataDocument.tipo_documento,
      numero_documento: usuario.numero_documento,
      rol: DataUser.rol,
    });

    // Cifrar el payload
    const encryptedPayload = encrypt(payload);

    // Generar token JWT con el payload cifrado
    const token = jwt.sign(
      {
        data: encryptedPayload,
      },
      process.env.TOKEN_SECRET_KEY || "SECRETKEY",
      {
        expiresIn: "4h",
      }
    );

    // Enviar respuesta con token
    res.json({
      message: `Inicio de sesión exitoso como ${DataUser.rol}`,
      token,
      usuario: {
        id: usuario.id,
        tipo_documento: DataDocument.tipo_documento,
        numero_documento: usuario.numero_documento,
        rol: DataUser.rol,
      },
    });
  } catch (error) {
    // Mostrar error en consola en caso de error al iniciar sesión.
    console.error("Error al iniciar sesión", error);
    // Mostrar mensaje de error 500 si hubo error al procesar la solicitud.
    res
      .status(500)
      .json({ message: "Hubo un error al procesar la solicitud", error });
    // Continuar a la siguiente función después de error.
    next();
  }
};

// Función para obtener usuario por número de documento
async function obtenerUsuarioPorNumeroDocumento(numero_documento) {
  let usuario;
  usuario = await Personas.findOne({ where: { numero_documento } });
  return usuario; // Devolver null si no se encuentra el usuario
}

// Función para cerrar sesión.
exports.cerrarSesion = async (req, res) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "Token no proporcionado" });
    }

    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET_KEY || "SECRETKEY"
    );
    const expiresAt = new Date(decoded.exp * 1000); // Obtener la fecha de expiración del token

    // Almacenar el token en la lista negra
    await BlacklistToken.create({ token, expiresAt });

    res.status(200).json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    console.error("Error al cerrar sesión", error);
    res.status(500).json({ message: "Error al cerrar sesión", error });
  }
};
