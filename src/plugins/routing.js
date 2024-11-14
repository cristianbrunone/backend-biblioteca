// Importar las rutas de admin
const adminRoutes = require('../routes/adminRoutes');

// Función que configura todas las rutas
module.exports = function (app) {
    // Usar las rutas de admin
    const adminRouter = require('express').Router();
    adminRoutes(adminRouter); // Cargar las rutas de admin

    // Usar el enrutador de admin en el prefijo '/api'
    app.use('/api', adminRouter);
};
