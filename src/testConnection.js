const mysql = require('mysql2');
const config = require('./infrastructure/config/dbConfig'); // Ruta correcta hacia db.Config.js

// Crear la conexión usando la configuración de dbConfig.js
const connection = mysql.createConnection(config.db);

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos: ', err.message);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
    connection.end(); // Cierra la conexión después de probarla
});
