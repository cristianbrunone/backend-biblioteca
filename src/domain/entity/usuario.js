class Usuario {
    constructor(id, nome, idade, contato_responsavel) {
        this.id = id;
        this.nome = nome;
        this.idade = idade;
        this.contato_responsavel = contato_responsavel;
    }

    // Método para convertir la entidad a una respuesta estructurada
    toResponse() {
        return {
            id: this.id,
            nome: this.nome,
            idade: this.idade,
            contato_responsavel: this.contato_responsavel,
        };
    }
}

module.exports = Usuario;
