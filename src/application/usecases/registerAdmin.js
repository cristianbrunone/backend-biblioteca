const bcrypt = require('bcrypt');
const AdminResponse = require('../response/adminResponse');

class RegisterAdmin {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }

    async execute(currentAdminId, username, password) {
        // Verificar si el usuario autenticado es un administrador
        const currentAdmin = await this.adminRepository.findById(currentAdminId);
        if (!currentAdmin) {
            throw new Error('Permisos insuficientes: solo administradores pueden crear otros administradores');
        }

        // Encriptar la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Crear la entidad de administrador
        const newAdmin = await this.adminRepository.create({
            username,
            passwordHash,
        });

        return new AdminResponse(newAdmin);
    }
}

module.exports = RegisterAdmin;