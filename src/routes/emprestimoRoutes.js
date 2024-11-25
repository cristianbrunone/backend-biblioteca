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
    

    // Listar empréstimos ativos
    emprestimosRouter.get('/emprestimos/ativos', isAuthenticatedAdmin, async (req, res) => {
        try {
           
        
            const emprestimosAtivos = await emprestimoRepository.listarEmprestimosAtivos();
            
          

            res.status(200).json(emprestimosAtivos);
        } catch (error) {
            // Log de erro
            console.error('Erro ao listar empréstimos ativos:', error.message);
            res.status(500).json({ message: 'Erro ao listar empréstimos ativos' });
        }
    });

};
