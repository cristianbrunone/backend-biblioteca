class EmprestimoRequest {
    constructor(id_usuario, data_emprestimo, data_devolucao = null, renovado = false) {
        this.id_usuario = id_usuario;
        this.data_emprestimo = data_emprestimo;
        this.data_devolucao = data_devolucao;
        this.renovado = renovado;
    }

    toDomain() {
        const Emprestimo = require('../../domain/entity/emprestimo');
        // Asumimos que `data_devolucao` puede ser calculada, por ejemplo, +7 días.
        const dataDevolucaoFinal = this.data_devolucao || new Date(new Date(this.data_emprestimo).setDate(this.data_emprestimo.getDate() + 7));  // Sumar 7 días
        return new Emprestimo(null, this.id_usuario, this.data_emprestimo, dataDevolucaoFinal, this.renovado);
    }
}

module.exports = EmprestimoRequest;
