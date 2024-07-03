// Importa el módulo Express, que es un framework para crear aplicaciones web y APIs en Node.js.
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars').create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
});
// Importa el módulo CORS (Cross-Origin Resource Sharing), que permite gestionar solicitudes de recursos 
// de diferentes orígenes en la aplicación.
const cors = require('cors');

const { sequelize, TestConnection } = require('./config/Database');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const models = require('./models');

// Inicializar instancia de express.
const app = express();

// Testear la conexión a la base de datos.
TestConnection();

// Middlewares.
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true}));
app.use(cookieParser());


// Habilitar el uso de CORS.
app.use(cors({
    origin: 'url-front',
    credentials: true
}));

// Configura Handlebars como el motor de plantillas para la aplicación.
// 'hbs' es el nombre que se le da al motor de plantillas y 'exphbs.engine' es la función que lo configura.
app.engine('hbs', exphbs.engine);

// Establece 'hbs' como el motor de vistas predeterminado para la aplicación.
// Esto significa que los archivos con extensión '.hbs' se renderizarán usando Handlebars.
app.set('view engine', 'hbs');

// Configura la ubicación de la carpeta de vistas.
// 'views' es el directorio donde se almacenan las plantillas de vista y se usa 'path.join' para crear una ruta absoluta a esa carpeta, basada en el directorio actual del archivo.
app.set('views', path.join(__dirname, 'views'));


const port = process.env.PORT || 5000;

async function startServer() {
    try {
        await sequelize.sync({ force: false});
        console.log('Database synchronized');
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
}


// LLamar a la función startServer.
startServer();
