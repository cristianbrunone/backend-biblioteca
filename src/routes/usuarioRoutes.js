const UsuarioRepository = require('../infrastructure/repository/UsuarioRepositoryImpl');
const UsuarioRequest = require('../application/request/UsuarioRequest');
const UsuarioResponse = require('../application/response/UsuarioResponse');
const { isAuthenticatedAdmin } = require('../infrastructure/middleware/authMiddleware');



// Crear instancia del repositorio
const usuarioRepository = new UsuarioRepository();

module.exports = function (usuarioRouter) {
    // Ruta para registrar un usuario
       usuarioRouter.post('/usuario/register', isAuthenticatedAdmin, async (req, res) => {
        try {
            console.log(req.body); // Verificar los datos recibidos

            const { nome, idade, contato_responsavel } = req.body;

            // Verificación de los datos antes de continuar
            if (!nome || !idade || !contato_responsavel) {
                console.error('Faltan campos obligatorios:', { nome, idade, contato_responsavel });
                return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
            }

            // Crear objeto UsuarioRequest
            const usuarioRequest = new UsuarioRequest(nome, idade, contato_responsavel);

            // Verificar que el objeto UsuarioRequest tiene los valores correctos
            console.log('UsuarioRequest:', usuarioRequest);

            // Crear el dominio Usuario
            const usuario = usuarioRequest.toDomain();

            // Verificar el objeto Usuario antes de pasarlo al repositorio
            console.log('Usuario creado desde UsuarioRequest:', usuario);

            // Llamar al repositorio para crear el usuario
            const createdUsuario = await usuarioRepository.create(usuario);

            // Crear respuesta para el usuario creado
            const usuarioResponse = new UsuarioResponse(createdUsuario);

            // Enviar respuesta exitosa
            res.status(201).json(usuarioResponse);
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            res.status(500).json({ message: 'Error al registrar el usuario' });
        }
    });
    // Ruta para obtener un usuario por ID
    usuarioRouter.get('/usuario/:id', isAuthenticatedAdmin, async (req, res) => {
        try {
            const { id } = req.params;

            const usuario = await usuarioRepository.read(id);

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const usuarioResponse = new UsuarioResponse(usuario);
            res.status(200).json(usuarioResponse);
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            res.status(500).json({ message: 'Error al obtener el usuario' });
        }
    });

    // Ruta para obtener todos los usuarios
    usuarioRouter.get('/usuarios', isAuthenticatedAdmin, async (req, res) => {
        try {
            const usuarios = await usuarioRepository.readAll();

            const usuariosResponse = usuarios.map(usuario => new UsuarioResponse(usuario));
            res.status(200).json(usuariosResponse);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            res.status(500).json({ message: 'Error al obtener los usuarios' });
        }
    });

    // Ruta para actualizar un usuario
    usuarioRouter.put('/usuario/:id', isAuthenticatedAdmin, async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, idade, contato_responsavel } = req.body;

            if (!nome || !idade || !contato_responsavel) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
            }

            const usuarioRequest = new UsuarioRequest(nome, idade, contato_responsavel);
            const usuario = usuarioRequest.toDomain();

            const updatedUsuario = await usuarioRepository.update(id, usuario);

            const usuarioResponse = new UsuarioResponse(updatedUsuario);
            res.status(200).json(usuarioResponse);
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            res.status(500).json({ message: 'Error al actualizar el usuario' });
        }
    });

    // Ruta para eliminar un usuario
    usuarioRouter.delete('/usuario/:id', isAuthenticatedAdmin, async (req, res) => {
        try {
            const { id } = req.params;

            const result = await usuarioRepository.delete(id);

            res.status(200).json(result);
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            res.status(500).json({ message: 'Error al eliminar el usuario' });
        }
    });
};
