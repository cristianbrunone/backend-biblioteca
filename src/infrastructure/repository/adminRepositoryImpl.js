const mysql = require('mysql2');
const AdminRepositoryInterface = require('../../domain/ports/adminRepositoryInterface');
const Admin = require('../../domain/entity/admin');
const config = require('../../infrastructure/config/dbConfig'); // Asegúrate de que esta es la ruta correcta

// Crear la conexión con la base de datos
const connection = mysql.createConnection(config.db);

class AdminRepository extends AdminRepositoryInterface {
    // Crear un administrador
    async create(adminEntity) {
        const query = 'INSERT INTO administrador (username, senha_hash, role) VALUES (?, ?, ?)';
        try {
            const [results] = await connection.promise().query(query, [adminEntity.username, adminEntity.passwordHash, adminEntity.role || 'admin']);
            adminEntity.id = `admin-${results.insertId}`; // Asignar el ID generado por MySQL
            return adminEntity;
        } catch (err) {
            console.error(`Error al crear el administrador: ${err.message}`);
            throw new Error('Error al crear el administrador');
        }
    }
    // Obtener un administrador por ID
    async findById(id) {
        const query = 'SELECT * FROM administrador WHERE id_admin = ?';
        try {
            const [results] = await connection.promise().query(query, [id]);
            if (results.length > 0) {
                const admin = new Admin(results[0].id_admin, results[0].username, results[0].senha_hash);
                return admin;
            } else {
                return null; // No se encontró el administrador
            }
        } catch (err) {
            // Manejo de error más detallado
            console.error(`Error al obtener el administrador por ID: ${err.message}`);
            throw new Error('Error al obtener el administrador por ID');
        }
    }

    // Obtener un administrador por nombre de usuario
    async findByUsername(username) {
        const query = 'SELECT * FROM administrador WHERE username = ?';
        try {
            const [results] = await connection.promise().query(query, [username]);
            if (results.length > 0) {
                const admin = new Admin(results[0].id_admin, results[0].username, results[0].senha_hash, results[0].role);
                return admin; // Devuelve el administrador si lo encuentra
            } else {
                return null; // Si no se encuentra el administrador
            }
        } catch (err) {
            // Manejo de error más detallado
            console.error(`Error al obtener el administrador por nombre de usuario: ${err.message}`);
            throw new Error('Error al obtener el administrador por nombre de usuario');
        }
    }

    // Contar los administradores
    async countAdmins() {
        const query = 'SELECT COUNT(*) AS count FROM administrador';
        try {
            const [results] = await connection.promise().query(query);
            return results[0].count;
        } catch (err) {
            // Manejo de error más detallado
            console.error(`Error al contar los administradores: ${err.message}`);
            throw new Error('Error al contar los administradores');
        }
    }
}

module.exports = AdminRepository;
