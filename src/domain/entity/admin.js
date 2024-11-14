// src/domain/entity/admin.js

class Admin {
    constructor(id, username, passwordHash) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
    }

    // Método para convertir la entidad a una respuesta estructurada
    toResponse() {
        return {
            id: this.id,
            username: this.username,
        };
    }
}

module.exports = Admin;
