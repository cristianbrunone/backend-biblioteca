const RegistrarEmprestimo = require('../application/usecases/registrarEmprestimo');
const { isAuthenticatedAdmin } = require('../infrastructure/middleware/authMiddleware');
const EmprestimoRepository = require('../infrastructure/repository/emprestimoRepositoryImpl');
const FinalizarEmprestimosVencidos = require('../application/usecases/finalizarEmprestimosVencidos');

// Inicia o cron job
const finalizarEmprestimosVencidos = new FinalizarEmprestimosVencidos();
finalizarEmprestimosVencidos.iniciarCron();

// Criar instância do repositório
const emprestimoRepository = new EmprestimoRepository();

// Instância do caso de uso
const registrarEmprestimo = new RegistrarEmprestimo();

module.exports = function (emprestimosRouter) {
    // Registrar um novo empréstimo
    emprestimosRouter.post('/emprestimos', isAuthenticatedAdmin, async (req, res) => {
        try {
            const { id_usuario, id_livro } = req.body;

            // Verifica os dados recebidos
            console.log("Dados recebidos:", req.body);

            // Verifica campos obrigatórios
            if (!id_usuario || !id_livro) {
                return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
            }

            // Chama o caso de uso RegistrarEmprestimo
            const emprestimoResponse = await registrarEmprestimo.execute(id_usuario, id_livro);

            res.status(201).json(emprestimoResponse);
        } catch (error) {
            console.error('Erro ao registrar empréstimo:', error.message);
            res.status(500).json({ message: error.message });
        }
    });

    // Obter empréstimo por ID
    emprestimosRouter.get('/emprestimos/:id', isAuthenticatedAdmin, async (req, res) => {
        try {
            const { id } = req.params;
            const emprestimo = await emprestimoRepository.findById(id);

            if (!emprestimo) {
                return res.status(404).json({ message: 'Empréstimo não encontrado' });
            }

            res.status(200).json(emprestimo);
        } catch (error) {
            console.error('Erro ao buscar empréstimo:', error.message);
            res.status(500).json({ message: 'Erro ao buscar empréstimo' });
        }
    });

    // Finalizar empréstimo (devolução)
    emprestimosRouter.put('/emprestimos/:id/finalizar', isAuthenticatedAdmin, async (req, res) => {
        try {
            const { id } = req.params;
            const resultado = await emprestimoRepository.finalizarEmprestimo(id);

            res.status(200).json({ message: 'Empréstimo finalizado com sucesso' });
        } catch (error) {
            console.error('Erro ao finalizar empréstimo:', error.message);
            res.status(500).json({ message: 'Erro ao finalizar empréstimo' });
        }
    });

    // Listar todos os empréstimos
    emprestimosRouter.get('/emprestimos', isAuthenticatedAdmin, async (req, res) => {
        try {
            const emprestimos = await emprestimoRepository.findAll();
            res.status(200).json(emprestimos);
        } catch (error) {
            console.error('Erro ao listar empréstimos:', error.message);
            res.status(500).json({ message: 'Erro ao listar empréstimos' });
        }
    });


        // Listar empréstimos ativos por livro
    emprestimosRouter.get('/emprestimos/ativos/:id_livro', isAuthenticatedAdmin, async (req, res) => {
        try {
            const { id_livro } = req.params;
            const emprestimosAtivos = await emprestimoRepository.findActiveByLivro(id_livro);

            if (emprestimosAtivos.length === 0) {
                return res.status(404).json({ message: 'Nenhum empréstimo ativo encontrado para este livro' });
            }

            res.status(200).json(emprestimosAtivos);
        } catch (error) {
            console.error('Erro ao buscar empréstimos ativos:', error.message);
            res.status(500).json({ message: 'Erro ao buscar empréstimos ativos' });
        }
    });

    // Obter o último empréstimo de um livro
    emprestimosRouter.get('/emprestimos/ultimo/:id_livro', isAuthenticatedAdmin, async (req, res) => {
        try {
            const { id_livro } = req.params;
            const ultimoEmprestimo = await emprestimoRepository.findLastByLivro(id_livro);

            if (!ultimoEmprestimo) {
                return res.status(404).json({ message: 'Nenhum empréstimo encontrado para este livro' });
            }

            res.status(200).json(ultimoEmprestimo);
        } catch (error) {
            console.error('Erro ao buscar último empréstimo:', error.message);
            res.status(500).json({ message: 'Erro ao buscar último empréstimo' });
        }
    });
};
