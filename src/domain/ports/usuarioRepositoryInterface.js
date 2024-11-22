const AdminRepositoryInterface = require("./adminRepositoryInterface");

class UsuarioRepositoryInterface {
    // Crear un nuevo usuario
    async create(usuarioEntity) {
        throw new Error('Method "create" not implemented');
    }

    // Leer un usuario por ID
    async read(id) {
        throw new Error('Method "read" not implemented');
    }

    // Actualizar un usuario por ID
    async update(id, usuarioEntity) {
        throw new Error('Method "update" not implemented');
    }

    // Eliminar un usuario por ID
    async delete(id) {
        throw new Error('Method "delete" not implemented');
    }

    // Leer todos los usuarios (opcional)
    async readAll() {
        throw new Error('Method "readAll" not implemented');
    }
}

module.exports = AdminRepositoryInterface;
