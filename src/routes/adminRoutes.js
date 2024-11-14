// src/application/routes/adminRoutes.js

const AdminRepository = require('../infrastructure/repository/adminRepositoryImpl'); // Correcta importación
const AdminRequest = require('../application/request/adminRequest');  // Importación correcta
const AdminResponse = require('../application/response/adminResponse');
const AuthenticateAdmin = require('../application/usecases/authenticateAdmin'); // Importar el caso de uso
const { isAuthenticatedAdmin, isSuperAdmin } = require('../infrastructure/middleware/authMiddleware');

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

    // Ruta para registrar un nuevo administrador, solo accesible por un superadmin
    adminRouter.post('/admin/register', isAuthenticatedAdmin, isSuperAdmin, async (req, res) => {
        try {
            const { username, password, role } = req.body; // Asegúrate de que estos campos estén presentes en el cuerpo de la solicitud

            // Aquí puedes crear un AdminRequest
            const adminRequest = new AdminRequest(username, password, role);  // Pasa los valores correctamente
            const admin = adminRequest.toDomain(); // Convertir a la entidad Admin

            // Crea el administrador en la base de datos (repositorio)
            const createdAdmin = await adminRepository.create(admin);

            // Retornar el admin creado como respuesta (AdminResponse)
            const adminResponse = new AdminResponse(createdAdmin);
            res.status(201).json(adminResponse); // Crear un nuevo administrador
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al registrar el administrador' });
        }
    });
};
