class UsuarioResponse {
    constructor(usuarioEntity) {
        this.id = usuarioEntity.id;
        this.nome = usuarioEntity.nome;
        this.idade = usuarioEntity.idade;
        this.contato_responsavel = usuarioEntity.contato_responsavel;
    }
}

module.exports = UsuarioResponse;