
class LivroRequest {
    constructor(titulo, autor, categoria) {
        this.titulo = titulo;
        this.autor = autor;
        this.categoria = categoria;
    }

    toDomain() {
        const { titulo, autor, categoria } = this;
        const Livro = require('../../domain/entity/livro');
        return new Livro(null ,titulo, autor, categoria);
    }


}

module.exports = LivroRequest;