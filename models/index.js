const { sequelize } = require('../config/Database');
const Regional = require('./Regional');
const CentroFormacion = require('./CentroFormacion');
const FuenteFinanciacion = require('./FuenteFinanciacion');
const GiraTecnica = require('./GiraTecnica');
const Participantes = require('./Participantes');

// Aquí se definen las relaciones de las tablas.

// *** Relaciones para la tabla Regional. ***

// Una regional puede tener muchos centros de formación.
Regional.hasMany(CentroFormacion, {
    foreignKey: 'regional_id',
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});

// Una regional puede tener muchas giras técnicas.
Regional.hasMany(GiraTecnica, {
    foreignKey: 'regional_id',
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});

// *** Relaciones para la tabla centro_formacion. ***

// Un centro de formación pertenece a una regional.
CentroFormacion.belongsTo(Regional, {
    foreignKey: 'regional_id',
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});

// Un centro de formación puede tener muchas giras técnicas.
CentroFormacion.hasMany(GiraTecnica, {
    foreignKey: 'centro_formacion_id',
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});


// *** Relaciones para la tabla gira_tecnica. ***

// Una gira técnica pertenece a una regional.
GiraTecnica.belongsTo(Regional, {
    foreignKey: 'regional_id',
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});

// Una gira técnica pertenece a un centro de formación.
GiraTecnica.belongsTo(CentroFormacion, {
    foreignKey: 'centro_formacion_id',
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});

// Una gira técnica tiene una fuente de financiación.
GiraTecnica.belongsTo(FuenteFinanciacion, {
    foreignKey: 'fuente_financiacion_id',
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});

// Una gira técnica puede tener muchos participantes.
GiraTecnica.hasMany(Participantes, {
    foreignKey: 'gira_tecnica_id',
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});

// *** Relaciones para la tabla fuente_financiacion. ***

// Una fuente de financiación puede ser para muchas giras técnicas.
FuenteFinanciacion.hasMany(GiraTecnica, {
    foreignKey: 'fuente_financiacion_id',
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});


module.exports = {
    sequelize,
    Regional,
    CentroFormacion
};