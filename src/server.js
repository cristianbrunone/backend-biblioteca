const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const config = require('./infrastructure/config/dbConfig'); // Asegúrate de que esta es la ruta correcta

// Crear la conexión con la base de datos
const connection = mysql.createConnection(config.db);

// Verificar si la conexión a la base de datos es exitosa
connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos: ', err.message);
        process.exit(1); // Terminar el proceso si no se puede conectar a la base de datos
    }
    console.log('Conexión exitosa a la base de datos');
});

const app = express();

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());

// Cargar las rutas a través del archivo routing.js
require('./plugins/routing')(app);  // Aquí estamos usando routing.js para configurar todas las rutas

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
