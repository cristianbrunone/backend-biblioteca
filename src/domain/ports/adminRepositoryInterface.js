class AdminRepositoryInterface {
    // Crear un administrador
    async create(adminEntity) {
        throw new Error('Method "create" not implemented');
    }

    // Obtener un administrador por ID
    async findById(id) {
        throw new Error('Method "findById" not implemented');
    }

    // Obtener un administrador por nombre de usuario
    async findByUsername(username) {
        throw new Error('Method "findByUsername" not implemented');
    }

    // Contar los administradores
    async countAdmins() {
        throw new Error('Method "countAdmins" not implemented');
    }
}

module.exports = AdminRepositoryInterface;
