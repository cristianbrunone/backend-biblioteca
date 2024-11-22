// src/application/routes/adminRoutes.js

const AdminRepository = require('../infrastructure/repository/adminRepositoryImpl'); // Correcta importación
const AdminRequest = require('../application/request/AdminRequest');  // Importación correcta
const AdminResponse = require('../application/response/AdminResponse');
const AuthenticateAdmin = require('../application/usecases/authenticateAdmin'); // Importar el caso de uso
const { isAuthenticatedAdmin, isSuperAdmin } = require('../infrastructure/middleware/authMiddleware');
const bcrypt = require('bcrypt');

// Instancia del repositorio
const adminRepository = new AdminRepository();
// Instancia del caso de uso
const authenticateAdmin = new AuthenticateAdmin(adminRepository);

module.exports = function (adminRouter) {

    // Ruta para autenticar un administrador
    adminRouter.post('/admin/authenticate', async (req, res) => {
        try {
            const { username, password } = req.body;

            // Usar el caso de uso para autenticar al administrador
            const authResult = await authenticateAdmin.execute(username, password);

            // Si la autenticación es exitosa, devolver el token y los datos del administrador
            res.status(200).json({
                token: authResult.token, // Devolver el token JWT
                admin: authResult.admin  // Devolver los datos del administrador
            });
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: error.message }); // Enviar mensaje de error de autenticación
        }
    });


    // Ruta para obtener un administrador por ID
    adminRouter.get('/admin/:id', async (req, res) => {
        try {
            const { id } = req.params;

            // Buscar el administrador en la base de datos
            const admin = await adminRepository.findById(id);

            if (!admin) {
                return res.status(404).json({ message: 'Administrador no encontrado' });
            }

            // Responder con los datos del administrador encontrado
            res.status(200).json({
                id: admin.id,
                username: admin.username,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener el administrador' });
        }
    });

    adminRouter.post('/admin/register', isAuthenticatedAdmin, isSuperAdmin, async (req, res) => {
        try {
            const { username, password, role } = req.body; // Asegúrate de que estos campos estén presentes en el cuerpo de la solicitud

            if (!username || !password || !role) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
            }

            // Hashear la contraseña
            const hashedPassword = await bcrypt.hash(password, 10); // Salting con 10 rondas

            // Crear la instancia del administrador
            const adminRequest = new AdminRequest(username, hashedPassword, role); // Usa la contraseña hasheada
            const admin = adminRequest.toDomain();

            // Guardar en la base de datos
            const createdAdmin = await adminRepository.create(admin);

            // Responder con éxito
            const adminResponse = new AdminResponse(createdAdmin);
            res.status(201).json(adminResponse);
        } catch (error) {
            console.error('Error al registrar el administrador:', error);
            res.status(500).json({ message: 'Error al registrar el administrador' });
        }
    });

};
