class EmprestimoResponse {
    constructor(emprestimoEntity) {
        this.id = emprestimoEntity.id;
        this.idUsuario = emprestimoEntity.id_usuario;
        this.dataEmprestimo = emprestimoEntity.data_emprestimo;
        this.dataDevolucao = emprestimoEntity.data_devolucao;
        this.renovado = emprestimoEntity.renovado;
    }
}

module.exports = EmprestimoResponse;
