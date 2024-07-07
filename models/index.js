const { sequelize } = require('../config/Database');
const Regional = require('./Regional');
const CentroFormacion = require('./CentroFormacion');
const FuenteFinanciacion = require('./FuenteFinanciacion');
const GiraTecnica = require('./GiraTecnica');
const Personas = require('./Personas');
const TipoDocumento = require('./TipoDocumento');
const Usuarios = require('./Users');
const Admin = require('./Admin');

// Definir las relaciones
Regional.hasMany(CentroFormacion, {
  foreignKey: 'regional_id',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});
CentroFormacion.belongsTo(Regional, {
  foreignKey: 'regional_id',
});

CentroFormacion.hasMany(GiraTecnica, {
  foreignKey: 'centro_formacion_id',
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT',
});
GiraTecnica.belongsTo(CentroFormacion, {
  foreignKey: 'centro_formacion_id',
});

FuenteFinanciacion.hasMany(GiraTecnica, {
  foreignKey: 'fuente_financiacion_id',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});
GiraTecnica.belongsTo(FuenteFinanciacion, {
  foreignKey: 'fuente_financiacion_id',
});

GiraTecnica.hasMany(Personas, {
  foreignKey: 'gira_tecnica_id',
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT',
});
Personas.belongsTo(GiraTecnica, {
  foreignKey: 'gira_tecnica_id',
});

Usuarios.hasOne(Personas, {
  foreignKey: 'user_id',
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT',
});
Personas.belongsTo(Usuarios, {
  foreignKey: 'user_id',
});

TipoDocumento.belongsTo(Personas, {
  foreignKey: 'persona_id',
});
Personas.hasOne(TipoDocumento, {
  foreignKey: 'persona_id',
});

Usuarios.hasOne(Admin, {
  foreignKey: 'user_id',
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT',
});
Admin.belongsTo(Usuarios, {
  foreignKey: 'user_id',
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
  Admin,
};
