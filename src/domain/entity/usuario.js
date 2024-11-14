class Usuario {
    constructor(id, nome, idade, contatoResponsavel) {
        this.id = id;
        this.nome = nome;
        this.idade = idade;
        this.contatoResponsavel = contatoResponsavel;
    }

    // Método para convertir la entidad a una respuesta estructurada
    toResponse() {
        return {
            id: this.id,
            nome: this.nome,
            idade: this.idade,
            contatoResponsavel: this.contatoResponsavel,
        };
    }
}

module.exports = Usuario;
