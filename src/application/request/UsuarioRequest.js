
class UsuarioRequest {
    constructor(nome, idade, contato_responsavel) {
        this.nome = nome;
        this.idade = idade;
        this.contato_responsavel = contato_responsavel;
    }

    toDomain() {
        const { nome, idade, contato_responsavel } = this;
        const Usuario = require('../../domain/entity/usuario');
        return new Usuario(nome, idade, contato_responsavel);
    }


}

module.exports = UsuarioRequest;