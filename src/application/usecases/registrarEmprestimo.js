const EmprestimoRepository = require('../../infrastructure/repository/emprestimoRepositoryImpl');
const LivroRepository = require('../../infrastructure/repository/livroRepositoryImpl');
const EmprestimoResponse = require('../response/EmprestimoResponse');
const EmprestimoRequest = require('../request/EmprestimoRequest');

class RegistrarEmprestimo {
    constructor() {
        this.emprestimoRepository = new EmprestimoRepository();
        this.livroRepository = new LivroRepository();
    }

    async execute(id_usuario, id_livro) {
        try {
            // Verifica se o livro está disponível
            const livro = await this.livroRepository.findById(id_livro);
            if (!livro) {
                throw new Error('Livro não encontrado.');
            }
            

            // Verifica a disponibilidade do livro
            const livroDisponivel = await this.livroRepository.findAvailableBooks(id_livro);
            if (!livroDisponivel) {
                throw new Error('Livro não está disponível para empréstimo.');
            }

            // Cria o objeto de empréstimo
            const data_emprestimo = new Date();  // Fecha de empréstimo atual
            const emprestimoRequest = new EmprestimoRequest(id_usuario, data_emprestimo);
            const emprestimoDomain = emprestimoRequest.toDomain();

            // Cria o empréstimo
            const emprestimo = await this.emprestimoRepository.create(emprestimoDomain);

            // Associa o livro ao empréstimo na tabela livros_has_emprestimos
            await this.emprestimoRepository.associateLivroToEmprestimo(emprestimo.id, id_livro);

            return new EmprestimoResponse(emprestimo);
        } catch (error) {
            console.error('Erro ao registrar empréstimo:', error.message);
            throw new Error('Erro ao registrar empréstimo.');
        }
    }
}

module.exports = RegistrarEmprestimo;


