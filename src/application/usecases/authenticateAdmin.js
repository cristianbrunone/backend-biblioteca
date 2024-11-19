require('dotenv').config({ path: '../../.env' });

const bcrypt = require('bcrypt'); // Para comparar contraseñas hash
const jwt = require('jsonwebtoken'); // Asegúrate de tener este paquete instalado

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Caso de uso para la autenticación del administrador
class AuthenticateAdmin {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }

    async execute(username, password) {
        const admin = await this.adminRepository.findByUsername(username);

        // Log para verificar si se encontró el administrador
        if (admin) {
            console.log(`Administrador encontrado: ${admin.username}`);
        } else {
            console.log(`Administrador no encontrado: ${username}`);
        }

        if (!admin) {
            throw new Error('Administrador no encontrado');
        }

        const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Contraseña incorrecta');
        }

        // Generar el token JWT incluyendo el role
        const token = jwt.sign(
            { id: admin.id, username: admin.username, role: admin.role }, // Agregar el role aquí
            JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Retornar el token junto con la respuesta del administrador
        return {
            token: token,
            admin: admin.toResponse() // Esto devolverá el id y el username
        };
    }
}

module.exports = AuthenticateAdmin;
