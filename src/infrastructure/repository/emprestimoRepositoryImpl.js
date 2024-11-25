const mysql = require('mysql2');
const config = require('../../infrastructure/config/dbConfig');
const EmprestimoRepositoryInterface = require('../../domain/ports/emprestimoRepositoryInterface');
const connection = mysql.createConnection(config.db);

class EmprestimosRepository extends EmprestimoRepositoryInterface {
    // Criar um novo empréstimo
    async create(emprestimo) {
        const query = `
            INSERT INTO emprestimos (id_usuario, data_emprestimo, data_devolucao, renovado) 
            VALUES (?, ?, ?, ?)
        `;
        try {
            const [results] = await connection.promise().query(query, [
                emprestimo.id_usuario,
                emprestimo.data_emprestimo,
                emprestimo.data_devolucao,
                emprestimo.renovado
            ]);
            emprestimo.id = results.insertId; // Retorna o ID gerado
            return emprestimo;
        } catch (err) {
            console.error(`Erro ao criar empréstimo: ${err.message}`);
            throw new Error('Erro ao criar empréstimo');
        }
    }

    // Associar livro ao empréstimo
    async associateLivroToEmprestimo(id_emprestimo, id_livro) {
        try {
            const query = `
                INSERT INTO livros_has_emprestimos (livros_id_livro, emprestimos_id_emprestimo)
                VALUES (?, ?);
            `;
            await connection.promise().query(query, [id_livro, id_emprestimo]);
            console.log(`Livro ${id_livro} associado ao empréstimo ${id_emprestimo}`);
        } catch (error) {
            console.error('Erro ao associar livro ao empréstimo:', error.message);
            throw new Error('Erro ao associar livro ao empréstimo.');
        }
    }


    // Atualizar empréstimo
    async update(id, updatedFields) {
        const query = `
            UPDATE emprestimos 
            SET id_usuario = ?, data_emprestimo = ?, data_devolucao = ?, renovado = ? 
            WHERE id_emprestimo = ?
        `;
        try {
            const [results] = await connection.promise().query(query, [
                updatedFields.id_usuario,
                updatedFields.data_emprestimo,
                updatedFields.data_devolucao,
                updatedFields.renovado,
                id
            ]);
            if (results.affectedRows > 0) {
                return { id, ...updatedFields };
            } else {
                throw new Error('Empréstimo não encontrado para atualização');
            }
        } catch (err) {
            console.error(`Erro ao atualizar empréstimo: ${err.message}`);
            throw new Error('Erro ao atualizar empréstimo');
        }
    }

    async finalizarEmprestimo(id) {
    // Consulta para verificar se o empréstimo existe
    const verificarEmprestimoQuery = `
        SELECT id_emprestimo, data_devolucao 
        FROM emprestimos 
        WHERE id_emprestimo = ?;
    `;

    // Consulta para atualizar a data de devolução
    const finalizarEmprestimoQuery = `
        UPDATE emprestimos 
        SET data_devolucao = CURDATE()
        WHERE id_emprestimo = ?;
    `;

    // Consulta para remover associações de livros
    const verificarAssociacoesQuery = `
        DELETE FROM livros_has_emprestimos
        WHERE emprestimos_id_emprestimo = ?;
    `;

    // Inicia a transação
    await connection.promise().beginTransaction();

    try {
        // Verifica se o empréstimo existe
        const [emprestimo] = await connection.promise().query(verificarEmprestimoQuery, [id]);
        if (emprestimo.length === 0) {
            throw new Error('Empréstimo não encontrado.');
        }

        // Atualiza a data de devolução para a data atual
        const [results] = await connection.promise().query(finalizarEmprestimoQuery, [id]);
        if (results.affectedRows === 0) {
            throw new Error('Erro ao finalizar o empréstimo.');
        }

        // Remove a associação do livro ao empréstimo
        await connection.promise().query(verificarAssociacoesQuery, [id]);

        // Confirma a transação
        await connection.promise().commit();

        console.log(`Empréstimo ${id} finalizado e associação de livros removida.`);
        return true; // Sucesso
    } catch (err) {
        // Reverte a transação em caso de erro
        await connection.promise().rollback();
        console.error(`Erro ao finalizar empréstimo: ${err.message}`);
        throw new Error('Erro ao finalizar empréstimo');
    }
}



    // Listar todos os empréstimos
    async findAll() {
        const query = 'SELECT * FROM emprestimos';
        try {
            const [results] = await connection.promise().query(query);
            return results;
        } catch (err) {
            console.error(`Erro ao listar empréstimos: ${err.message}`);
            throw new Error('Erro ao listar empréstimos');
        }
    }

    // Listar empréstimos ativos
    async listarEmprestimosAtivos() {
        const query = `
            SELECT 
                e.id_emprestimo, 
                e.id_usuario, 
                e.data_emprestimo, 
                e.data_devolucao, 
                l.titulo AS nome_livro,
                u.nome AS nome_usuario
            FROM 
                emprestimos e
            JOIN 
                livros_has_emprestimos le ON e.id_emprestimo = le.emprestimos_id_emprestimo
            JOIN 
                livros l ON le.livros_id_livro = l.id_livro
            JOIN 
                usuarios u ON e.id_usuario = u.id_usuario 

            WHERE 
                e.data_devolucao > CURDATE();
        `;
        try {
            const [results] = await connection.promise().query(query);
            return results;
        } catch (err) {
            console.error(`Erro ao listar empréstimos ativos: ${err.message}`);
            throw new Error('Erro ao listar empréstimos ativos');
        }
    }
}

module.exports = EmprestimosRepository;
