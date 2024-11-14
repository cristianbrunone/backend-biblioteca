// src/application/services/authService.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getAdminByUsername } = require('../../infrastructure/repository/userRepository');
const { JWT_SECRET_KEY } = require('../../resources/.env'); // Asegúrate de tener una clave secreta en tu archivo .env

/**
 * Autentica al administrador con su nombre de usuario y contraseña.
 * @param {string} username - El nombre de usuario.
 * @param {string} password - La contraseña.
 * @returns {Promise<string>} - Un JWT si la autenticación es exitosa.
 */
async function authenticateAdmin(username, password) {
    const admin = await getAdminByUsername(username);

    if (!admin) {
        throw new Error('Usuario no encontrado');
    }

    const isMatch = await bcrypt.compare(password, admin.senha_hash);
    if (!isMatch) {
        throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign({ id: admin.id_admin, username: admin.username }, JWT_SECRET_KEY, { expiresIn: '1h' });
    return token;
}

module.exports = { authenticateAdmin };
