const { sequelize } = require('../config/Database');
const Regional = require('./Regional');
const CentroFormacion = require('./CentroFormacion');
const FuenteFinanciacion = require('./FuenteFinanciacion');
const GiraTecnica = require('./GiraTecnica');
const Personas = require('./Personas');
const TipoDocumento = require('./TipoDocumento');
const Usuarios = require('./Users');
const Form = require('./Form');
const Question = require('./Question');

// Definir las relaciones

// Relación: Una región puede tener muchos centros de formación
Regional.hasMany(CentroFormacion, {
  foreignKey: 'regional_id', // Clave foránea en la tabla CentroFormacion que referencia a la región
  onUpdate: 'CASCADE', // Actualizar en cascada
  onDelete: 'CASCADE', // Eliminar en cascada
});
CentroFormacion.belongsTo(Regional, {
  foreignKey: 'regional_id', // Clave foránea en la tabla CentroFormacion que referencia a la región
});

// Relación: Un centro de formación puede tener muchas giras técnicas
CentroFormacion.hasMany(GiraTecnica, {
  foreignKey: 'centro_formacion_id', // Clave foránea en la tabla GiraTecnica que referencia al centro de formación
  onUpdate: 'CASCADE', // Actualizar en cascada
  onDelete: 'RESTRICT', // Restringir la eliminación (requiere eliminación de dependencias)
});
GiraTecnica.belongsTo(CentroFormacion, {
  foreignKey: 'centro_formacion_id', // Clave foránea en la tabla GiraTecnica que referencia al centro de formación
});

// Relación: Una fuente de financiación puede financiar muchas giras técnicas
FuenteFinanciacion.hasMany(GiraTecnica, {
  foreignKey: 'fuente_financiacion_id', // Clave foránea en la tabla GiraTecnica que referencia a la fuente de financiación
  onUpdate: 'CASCADE', // Actualizar en cascada
  onDelete: 'CASCADE', // Eliminar en cascada
});
GiraTecnica.belongsTo(FuenteFinanciacion, {
  foreignKey: 'fuente_financiacion_id', // Clave foránea en la tabla GiraTecnica que referencia a la fuente de financiación
});

// Relación: Una gira técnica puede tener muchas personas asociadas (participantes)
GiraTecnica.hasMany(Personas, {
  foreignKey: 'gira_tecnica_id', // Clave foránea en la tabla Personas que referencia a la gira técnica
  onUpdate: 'CASCADE', // Actualizar en cascada
  onDelete: 'RESTRICT', // Restringir la eliminación (requiere eliminación de dependencias)
});
Personas.belongsTo(GiraTecnica, {
  foreignKey: 'gira_tecnica_id', // Clave foránea en la tabla Personas que referencia a la gira técnica
});

// Relación: Un usuario puede tener asociada una persona (relación uno a uno)
Usuarios.hasOne(Personas, {
  foreignKey: 'user_id', // Clave foránea en la tabla Personas que referencia al usuario
  onUpdate: 'CASCADE', // Actualizar en cascada
  onDelete: 'RESTRICT', // Restringir la eliminación (requiere eliminación de dependencias)
});
Personas.belongsTo(Usuarios, {
  foreignKey: 'user_id', // Clave foránea en la tabla Personas que referencia al usuario
});

// Relación: Un tipo de documento pertenece a una persona (relación uno a uno)
TipoDocumento.belongsTo(Personas, {
  foreignKey: 'persona_id', // Clave foránea en la tabla TipoDocumento que referencia a la persona
});
Personas.hasOne(TipoDocumento, {
  foreignKey: 'persona_id', // Clave foránea en la tabla TipoDocumento que referencia a la persona
});

// Relación: Un formulario puede tener muchas preguntas
Form.hasMany(Question, {
  foreignKey: 'formId', // Clave foránea en la tabla Question que referencia al formulario
});

// Exportar los modelos y sequelize
module.exports = {
  sequelize,
  Regional,
  CentroFormacion,
  FuenteFinanciacion,
  GiraTecnica,
  Personas,
  TipoDocumento,
  Usuarios,
  Form,
  Question
};
