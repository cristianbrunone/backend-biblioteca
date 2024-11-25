const nodeCron = require('node-cron');
const EmprestimosRepository = require('../../infrastructure/repository/emprestimoRepositoryImpl');

class FinalizarEmprestimosVencidos {
    constructor() {
        this.emprestimosRepository = new EmprestimosRepository();
    }

    async verificarEFinalizar() {
        try {
            console.log('Executando verificação de empréstimos vencidos...');
            const emprestimos = await this.emprestimosRepository.findAll();

            for (const emprestimo of emprestimos) {
                if (
                    !emprestimo.data_devolucao &&
                    new Date(emprestimo.data_emprestimo) < new Date()
                ) {
                    await this.emprestimosRepository.finalizarEmprestimo(emprestimo.id_emprestimo);
                    console.log(`Empréstimo ${emprestimo.id_emprestimo} devolvido automaticamente.`);
                }
            }
        } catch (error) {
            console.error('Erro ao finalizar empréstimos vencidos:', error.message);
        }
    }

    iniciarCron() {
        nodeCron.schedule('0 0 * * *', async () => {
            await this.verificarEFinalizar();
        });
        console.log('Tarefa de verificação de empréstimos vencidos agendada.');
    }
}

module.exports = FinalizarEmprestimosVencidos;
