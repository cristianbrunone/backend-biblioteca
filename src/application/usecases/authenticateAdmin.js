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

        if (!admin) {
            throw new Error('Administrador no encontrado');
        }

        const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Contraseña incorrecta');
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            JWT_SECRET_KEY,
            { expiresIn: '1h' } // Puedes ajustar el tiempo de expiración si lo necesitas
        );

        // Retornar el token junto con la respuesta del administrador
        return {
            token: token,
            admin: admin.toResponse() // Esto devolverá el id y el username
        };
    }
}

module.exports = AuthenticateAdmin;
