class EmprestimoRepositoryInterface {
    // Crear un nuevo usuario
    async create(emprestimoEntity) {
        throw new Error('Method "create" not implemented');
    }

    async  findById(id, emprestimoEntity) {
        throw new Error('Method "update" not implemented');
    }

      async update(id, emprestimoEntity) {
        throw new Error('Method "update" not implemented');
    }

    async associateLivroToEmprestimo(emprestimo_id, livro_id) {
        throw new Error('Method "associateLivroToEmprestimo" not implemented');
    };


    async finalizarEmprestimo(id) {
        throw new Error('Method " findAvailableBooks" not implemented');
    }

     async findAll() {
        throw new Error('Method "readAll" not implemented');
    }

       async findActiveByLivro() {
        throw new Error('Method "findActiveByLivro" not implemented');
    }

       async findLastByLivro() {
        throw new Error('Method "findLastByLivro" not implemented');
    }

}

module.exports = EmprestimoRepositoryInterface;