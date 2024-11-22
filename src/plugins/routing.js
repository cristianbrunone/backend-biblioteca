// Importar las rutas de admin
const adminRoutes = require('../routes/adminRoutes');
const usuarioRoutes = require('../routes/usuarioRoutes');

// Función que configura todas las rutas
module.exports = function (app) {
    // Usar las rutas de admin
    const adminRouter = require('express').Router();
    adminRoutes(adminRouter); // Cargar las rutas de admin

    const usuarioRouter = require('express').Router();
    usuarioRoutes(usuarioRouter);

    // Aquí, eliminamos el prefijo '/usuario'
    app.use('/api/', usuarioRouter); // Cambiado de '/api/usuario' a '/api'

    // Usar el enrutador de admin en el prefijo '/api'
    app.use('/api', adminRouter);
};
