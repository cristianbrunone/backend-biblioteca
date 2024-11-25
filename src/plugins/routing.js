// Importar las rutas de admin
const adminRoutes = require('../routes/adminRoutes');
const usuarioRoutes = require('../routes/usuarioRoutes');
const livroRoutes = require('../routes/livroRoutes');
const emprestimoRoutes = require('../routes/emprestimoRoutes');

// Función que configura todas las rutas
module.exports = function (app) {
    // Usar las rutas de admin
    const adminRouter = require('express').Router();
    adminRoutes(adminRouter); // Cargar las rutas de admin

    const usuarioRouter = require('express').Router();
    usuarioRoutes(usuarioRouter);

    const livroRouter = require('express').Router();
    livroRoutes(livroRouter);

    const emprestimoRouter = require('express').Router();
    emprestimoRoutes(emprestimoRouter);

    app.use('/api/', usuarioRouter); 

    app.use('/api', adminRouter);

    app.use('/api', livroRouter);
    
    app.use('/api', emprestimoRouter);
};
