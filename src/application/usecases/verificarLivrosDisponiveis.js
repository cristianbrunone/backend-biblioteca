// application/usecases/verificarLivrosDisponiveis.js

const LivroRepository = require('../../infrastructure/repository/livroRepositoryImpl');
const LivroResponse = require('../../application/response/livroResponse');

class VerificarLivrosDisponiveis {
    constructor() {
        this.livroRepository = new LivroRepository();
    }

    async execute() {
        try {
            // Consulta livros disponíveis
            const livrosDisponiveis = await this.livroRepository.findAvailableBooks();

            if (livrosDisponiveis.length > 0) {
                return livrosDisponiveis.map(livro => new LivroResponse(livro));
            } else {
                throw new Error('Nenhum livro disponível');
            }
        } catch (error) {
            console.error('Erro ao verificar livros disponíveis:', error.message);
            throw new Error('Erro ao verificar livros disponíveis');
        }
    }
}

module.exports = VerificarLivrosDisponiveis;
