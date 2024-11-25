class Livro {
    constructor(id, titulo, autor, categoria) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.categoria = categoria;
    }

    toResponse() { 
        return {
            id: this.id,
            titulo: this.titulo,
            autor: this.autor,
            categoria: this.categoria

        };
    }

}
module.exports = Livro;

