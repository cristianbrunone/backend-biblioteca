const mysql = require('mysql2');
const UsuarioRepositoryInterface = require('../../domain/ports/usuarioRepositoryInterface');
const Usuario = require('../../domain/entity/usuario');
const config = require('../../infrastructure/config/dbConfig'); // Asegúrate de que esta es la ruta correcta

// Crear la conexión con la base de datos
const connection = mysql.createConnection(config.db);

class UsuarioRepository extends UsuarioRepositoryInterface {
    // Crear un usuario
    async create(usuarioEntity) {
        const query = 'INSERT INTO usuarios (nome, idade, contato_responsavel) VALUES (?, ?, ?)';
       
        try {
            const [results] = await connection.promise().query(query, [usuarioEntity.nome, usuarioEntity.idade, usuarioEntity.contato_responsavel]);
            usuarioEntity.id = `usuario-${results.insertId}`; // Asignar el ID generado por MySQL
            return usuarioEntity;
        } catch (err) {
            console.error(`Error al crear el usuario: ${err.message}`);
            throw new Error('Error al crear el usuario');
        }
    }

    // Leer un usuario por ID
    async read(id) {
        const query = 'SELECT * FROM usuarios WHERE id_usuario = ?';
        try {
            const [rows] = await connection.promise().query(query, [id]);
            if (rows.length === 0) {
                throw new Error('Usuario no encontrado');
            }
            return new Usuario(rows[0].id, rows[0].nome, rows[0].idade, rows[0].contato_responsavel); // Mapea los resultados al objeto Usuario
        } catch (err) {
            console.error(`Error al leer el usuario: ${err.message}`);
            throw new Error('Error al leer el usuario');
        }
    }

    // Actualizar un usuario por ID
    async update(id, usuarioEntity) {
        const query = 'UPDATE usuarios SET nome = ?, idade = ?, contato_responsavel = ? WHERE id = ?';
        try {
            const [results] = await connection.promise().query(query, [usuarioEntity.nome, usuarioEntity.idade, usuarioEntity.contato_responsavel,
                id]);
            if (results.affectedRows === 0) {
                throw new Error('Usuario no encontrado');
            }
            usuarioEntity.id = id; // Mantener el ID del usuario
            return usuarioEntity;
        } catch (err) {
            console.error(`Error al actualizar el usuario: ${err.message}`);
            throw new Error('Error al actualizar el usuario');
        }
    }

    // Eliminar un usuario por ID
    async delete(id) {
        const query = 'DELETE FROM usuarios WHERE id_usuario = ?';
        try {
            const [results] = await connection.promise().query(query, [id]);
            if (results.affectedRows === 0) {
                throw new Error('Usuario no encontrado');
            }
            return { message: 'Usuario eliminado exitosamente' };
        } catch (err) {
            console.error(`Error al eliminar el usuario: ${err.message}`);
            throw new Error('Error al eliminar el usuario');
        }
    }

    // Leer todos los usuarios
async readAll() {
    const query = 'SELECT id_usuario AS id, nome, idade, contato_responsavel FROM usuarios';
    try {
        const [rows] = await connection.promise().query(query);
        if (rows.length === 0) {
            throw new Error('No hay usuarios registrados');
        }
        return rows.map(row => new Usuario(row.id, row.nome, row.idade, row.contato_responsavel)); // Incluye el ID en el objeto Usuario
    } catch (err) {
        console.error(`Error al leer todos los usuarios: ${err.message}`);
        throw new Error('Error al leer todos los usuarios');
    }
}

}

module.exports = UsuarioRepository;
