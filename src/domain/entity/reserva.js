class Reserva {
    constructor(id, id_usuario, id_livro, data_reserva, status) {
        this.id = id;
        this.id_usuario = id_usuario;
        this.id_livro = id_livro;
        this.data_reserva = data_reserva;
        this.status = status;
    }
     // Método para convertir la entidad a una respuesta estructurada
    toResponse() {
        return {
            id: this.id,
            id_usuario: this.id_usuario,
            id_livro: this.id_livro,
            data_reserva: this.data_reserva,
            status: this.status
        };
    }
}

module.exports = Reserva;
