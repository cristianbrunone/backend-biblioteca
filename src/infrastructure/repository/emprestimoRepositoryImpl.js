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

    async associateLivroToEmprestimo(id_emprestimo, id_livro) {
    try {
        const query = `
            INSERT INTO livros_has_emprestimos (livros_id_livro, emprestimos_id_emprestimo)
            VALUES (?, ?);
        `;
        // Ejecutas la query con los valores correspondientes
        await connection.promise().query(query, [id_livro, id_emprestimo]);
        console.log(`Livro ${id_livro} associado ao empréstimo ${id_emprestimo}`);
    } catch (error) {
        console.error('Erro ao associar livro ao empréstimo:', error.message);
        throw new Error('Erro ao associar livro ao empréstimo.');
    }
}


    // Obter empréstimo por ID
    async findById(id) {
        const query = 'SELECT * FROM emprestimos WHERE id_emprestimo = ?';
        try {
            const [results] = await connection.promise().query(query, [id]);
            return results.length > 0 ? results[0] : null;
        } catch (err) {
            console.error(`Erro ao buscar empréstimo: ${err.message}`);
            throw new Error('Erro ao buscar empréstimo');
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

    // Finalizar empréstimo (devolução)
    async finalizarEmprestimo(id) {
        const query = `
            UPDATE emprestimos 
            SET data_devolucao = CURDATE()
            WHERE id_emprestimo = ? AND data_devolucao IS NULL
        `;
        try {
            const [results] = await connection.promise().query(query, [id]);
            if (results.affectedRows > 0) {
                return true; // Sucesso
            } else {
                throw new Error('Empréstimo não encontrado ou já devolvido');
            }
        } catch (err) {
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

    
      async findActiveByLivro(id_livro) {
        const query = `
            SELECT * FROM emprestimos
            WHERE id_livro = ?
            AND data_devolucao IS NULL
        `;
        try {
            const [results] = await connection.promise().query(query, [id_livro]);
            return results;
        } catch (err) {
            console.error(`Erro ao verificar empréstimos ativos: ${err.message}`);
            throw new Error('Erro ao verificar empréstimos ativos.');
        }
    }

      async findLastByLivro(id_livro) {
        const query = `
            SELECT * FROM emprestimos
            WHERE id_livro = ?
            ORDER BY data_emprestimo DESC LIMIT 1
        `;
        try {
            const [results] = await connection.promise().query(query, [id_livro]);
            return results.length > 0 ? results[0] : null;
        } catch (err) {
            console.error(`Erro ao buscar o último empréstimo: ${err.message}`);
            throw new Error('Erro ao buscar o último empréstimo.');
        }
    }
}

module.exports = EmprestimosRepository;
