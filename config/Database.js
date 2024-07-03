const { Sequelize } = require('sequelize');
const Database = process.env.DATABASE || 'sgpe';
const UserDB = process.env.USER|| 'root';
const PasswordDB = process.env.PASSWORD || "root";
const PortDB = process.env.PORTDB || 3306;
const HostDB = process.env.HOST || 'localhost';

const sequelize = new Sequelize(Database, UserDB, PasswordDB, {
    host: HostDB,
    dialect: 'mysql',
    port: PortDB,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

async function TestConnection () {
    try {
        await sequelize.authenticate();
        console.log('Connection established successfully');
    } catch (error) {
        console.error('Unable to connect to database', error);
    }
};

module.exports = { sequelize, TestConnection };