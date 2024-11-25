const LivroRepository = require('../infrastructure/repository/livroRepositoryImpl');
const { isAuthenticatedAdmin } = require('../infrastructure/middleware/authMiddleware');
const VerificarLivrosDisponiveis = require('../application/usecases/verificarLivrosDisponiveis');
const Livro = require('../domain/entity/livro');

// Crear instancia del repositorio
const livroRepository = new LivroRepository();

// Crear instancia del caso de uso
const verificarLivrosDisponiveis = new VerificarLivrosDisponiveis(livroRepository);


module.exports = function (livroRouter) {
    // Ruta para registrar un libro
    livroRouter.post('/livro/register', isAuthenticatedAdmin, async (req, res) => {
        try {
            const { titulo, autor, categoria } = req.body;

            // Verificación de los datos
            if (!titulo || !autor || !categoria) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
            }

            const livro = new Livro(null, titulo, autor, categoria);

            const createdLivro = await livroRepository.create(livro);

               // Log del éxito
             console.log('Livro cadastrado com sucesso:', {
             id: createdLivro.id,
             titulo: createdLivro.titulo,
             autor: createdLivro.autor,
             categoria: createdLivro.categoria,
            });

            res.status(201).json(createdLivro);
        } catch (error) {
            console.error('Error al registrar el libro:', error.message);
            res.status(500).json({ message: 'Error al registrar el libro' });
        }
    });

    // Ruta para obtener un libro por ID
    livroRouter.get('/livro/:id', isAuthenticatedAdmin, async (req, res) => {
        try {
            const { id } = req.params;

            const livro = await livroRepository.findById(id);

            if (!livro) {
                return res.status(404).json({ message: 'Livro não encontrado' });
            }

            res.status(200).json(livro);
        } catch (error) {
            console.error('Error al obtener el libro:', error.message);
            res.status(500).json({ message: 'Error al obtener el libro' });
        }
    });

       // Rota para verificar livros disponíveis
  livroRouter.get('/livros/disponiveis', isAuthenticatedAdmin, async (req, res) => {
    try {
        const livrosDisponiveis = await verificarLivrosDisponiveis.execute(); // Llama al caso de uso

        if (livrosDisponiveis.length > 0) {
            res.status(200).json(livrosDisponiveis);
        } else {
            res.status(404).json({ message: 'Nenhum livro disponível no momento' });
        }
    } catch (error) {
        console.error('Erro ao verificar livros disponíveis:', error.message);
        res.status(500).json({ message: 'Erro ao verificar livros disponíveis' });
    }
});




    // Ruta para obtener todos los libros
    livroRouter.get('/livros', isAuthenticatedAdmin, async (req, res) => {
        try {
            const livros = await livroRepository.findAll();

            res.status(200).json(livros);
        } catch (error) {
            console.error('Error al listar los libros:', error.message);
            res.status(500).json({ message: 'Error al listar los libros' });
        }
    });

    // Ruta para actualizar un libro
    livroRouter.put('/livro/:id', isAuthenticatedAdmin, async (req, res) => {
        try {
            const { id } = req.params;
            const { titulo, autor, categoria } = req.body;

            if (!titulo || !autor || !categoria) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
            }

            const updatedLivro = await livroRepository.update(id, { titulo, autor, categoria });

            res.status(200).json(updatedLivro);
        } catch (error) {
            console.error('Error al actualizar el libro:', error.message);
            res.status(500).json({ message: 'Error al actualizar el libro' });
        }
    });

    // Ruta para eliminar un libro
    livroRouter.delete('/livro/:id', isAuthenticatedAdmin, async (req, res) => {
        try {
            const { id } = req.params;

            const result = await livroRepository.delete(id);

            res.status(200).json({ message: 'Livro eliminado com sucesso' });
        } catch (error) {
            console.error('Error al eliminar el libro:', error.message);
            res.status(500).json({ message: 'Error al eliminar el libro' });
        }
    });
};
