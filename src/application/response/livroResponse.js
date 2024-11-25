class LivroResponse {
    constructor(livroEntity) {
        this.id = livroEntity.id;
        this.titulo = livroEntity.titulo;
        this.autor = livroEntity.autor;
        this.categoria = livroEntity.categoria;
    }
}

module.exports = LivroResponse;