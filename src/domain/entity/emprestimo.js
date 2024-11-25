class Emprestimo {
    constructor(id, id_usuario, data_emprestimo, data_devolucao, renovado) {
        this.id = id;
        this.id_usuario = id_usuario;
        this.data_emprestimo = data_emprestimo;
        this.data_devolucao = data_devolucao;
        this.renovado = renovado;
    };

    toResponse() {
        return {
            id: this.id,
            id_usuario: this.id_usuario,
            data_emprestimo: this.data_emprestimo,
            data_devolucao: this.data_devolucao,
            renovado: this.renovado

        };        
            
    }
}

module.exports = Emprestimo;
