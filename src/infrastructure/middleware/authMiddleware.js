// src/infrastructure/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Cargar el archivo .env
dotenv.config({ path: '../.env' });

// Obtener el valor de JWT_SECRET_KEY del archivo .env
const { JWT_SECRET_KEY } = process.env;

// Middleware para verificar que el usuario está autenticado y tiene un token válido
function isAuthenticatedAdmin(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del header Authorization

    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, JWT_SECRET_KEY);

        // Almacenar la información del admin en req para usarla en las rutas
        req.admin = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
}

// Middleware para verificar que el admin tiene permisos de superadmin (ejemplo: rol=superadmin)
function isSuperAdmin(req, res, next) {
    // Verificar que el admin tiene el rol adecuado
    if (req.admin && req.admin.role === 'superadmin') {
        return next(); // Solo los superadministradores pueden realizar esta acción
    } else {
        return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    }
}

module.exports = { isAuthenticatedAdmin, isSuperAdmin };
