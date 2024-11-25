const mysql = require('mysql2');
const LivroRepositoryInterface = require('../../domain/ports/livroRepositoryInterface');
const Livro = require('../../domain/entity/livro');
const config = require('../../infrastructure/config/dbConfig');

// Crear conexión a la base de datos
const connection = mysql.createConnection(config.db);

class LivroRepository extends LivroRepositoryInterface {
    // Crear un libro
    async create(livroEntity) {
        const query = 'INSERT INTO livros (titulo, autor, categoria) VALUES (?, ?, ?)';
        try {
            const [results] = await connection.promise().query(query, [
                livroEntity.titulo,
                livroEntity.autor,
                livroEntity.categoria,
            ]);
            livroEntity.id = results.insertId; // Asignar el ID generado por MySQL
            return livroEntity;
        } catch (err) {
            console.error(`Error al crear el libro: ${err.message}`);
            throw new Error('Error al crear el libro');
        }
    }

    // Obtener un libro por ID
    async findById(id) {
        const query = 'SELECT * FROM livros WHERE id_livro = ?';
        try {
            const [results] = await connection.promise().query(query, [id]);
            if (results.length > 0) {
                const livro = new Livro(results[0].id_livro, results[0].titulo, results[0].autor, results[0].categoria);
                return livro;
            } else {
                return null; // No se encontró el libro
            }
        } catch (err) {
            console.error(`Error al obtener el libro por ID: ${err.message}`);
            throw new Error('Error al obtener el libro por ID');
        }
    }

    // Actualizar un libro
    async update(id, updatedFields) {
        const query = 'UPDATE livros SET titulo = ?, autor = ?, categoria = ? WHERE id_livro = ?';
        try {
            const [results] = await connection.promise().query(query, [
                updatedFields.titulo,
                updatedFields.autor,
                updatedFields.categoria,
                id,
            ]);
            if (results.affectedRows > 0) {
                return { id, ...updatedFields }; // Retorna los datos actualizados
            } else {
                throw new Error('No se encontró el libro para actualizar');
            }
        } catch (err) {
            console.error(`Error al actualizar el libro: ${err.message}`);
            throw new Error('Error al actualizar el libro');
        }
    }

    // Eliminar un libro
  // Eliminar un libro y sus relaciones en livros_has_emprestimos
async delete(id) {
    const deleteRelationsQuery = 'DELETE FROM livros_has_emprestimos WHERE id_livro = ?';
    const deleteBookQuery = 'DELETE FROM livros WHERE id_livro = ?';

    try {
        // Primero, eliminamos las relaciones en livros_has_emprestimos
        const [relationResults] = await connection.promise().query(deleteRelationsQuery, [id]);
        
        if (relationResults.affectedRows > 0) {
            console.log(`Se eliminaron ${relationResults.affectedRows} relaciones con o sin préstamos.`);
        }

        // Ahora, eliminamos el libro
        const [bookResults] = await connection.promise().query(deleteBookQuery, [id]);

        if (bookResults.affectedRows > 0) {
            return true; // Eliminación exitosa del libro
        } else {
            throw new Error('No se encontró el libro para eliminar');
        }
    } catch (err) {
        console.error(`Error al eliminar el libro: ${err.message}`);
        throw new Error('Error al eliminar el libro');
    }
}


    // Listar todos los libros
    async findAll() {
        const query = 'SELECT * FROM livros';
        try {
            const [results] = await connection.promise().query(query);
            return results.map(
                (row) => new Livro(row.id_livro, row.titulo, row.autor, row.categoria)
            );
        } catch (err) {
            console.error(`Error al listar los libros: ${err.message}`);
            throw new Error('Error al listar los libros');
        }
    }

    // Adicionando no LivroRepository
async findAvailableBooks() {
    const query = `
       SELECT 
    l.id_livro,
    l.titulo,
    l.autor,
    l.categoria
FROM livros l
LEFT JOIN livros_has_emprestimos le 
    ON le.livros_id_livro = l.id_livro
LEFT JOIN emprestimos e 
    ON e.id_emprestimo = le.emprestimos_id_emprestimo 
    AND (e.data_devolucao IS NULL OR e.data_devolucao > CURDATE())  -- El libro está prestado y no ha sido devuelto
LEFT JOIN reservas r 
    ON r.id_livro = l.id_livro AND r.status = 'ativa'  -- El libro está reservado
WHERE e.id_emprestimo IS NULL  -- El libro no está prestado
AND r.id_reserva IS NULL  -- El libro no está reservado
LIMIT 1000;

    `;
    
    try {
        const [results] = await connection.promise().query(query);
        return results.map(row => new Livro(row.id_livro, row.titulo, row.autor, row.categoria));
    } catch (err) {
        console.error(`Error ao listar livros disponíveis: ${err.message}`);
        throw new Error('Erro ao listar livros disponíveis');
    }
    }
    

}


module.exports = LivroRepository;
