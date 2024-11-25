class LivroRepositoryInterface {
    // Crear un nuevo usuario
    async create(livroEntity) {
        throw new Error('Method "create" not implemented');
    }


    async read(id) {
        throw new Error('Method "read" not implemented');
    }


    async update(id, livroEntity) {
        throw new Error('Method "update" not implemented');
    }


    async delete(id) {
        throw new Error('Method "delete" not implemented');
    }


    async readAll() {
        throw new Error('Method "readAll" not implemented');
    }

    async findAvailableBooks() {
        throw new Error('Method " findAvailableBooks" not implemented');
    }
}

module.exports = LivroRepositoryInterface;