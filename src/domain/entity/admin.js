// src/domain/entity/admin.js

class Admin {
    constructor(id, username, passwordHash, role) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;  // Incluir role en el constructor
    }

    // Método para convertir la entidad a una respuesta estructurada
    toResponse() {
        return {
            id: this.id,
            username: this.username,
            role: this.role  // Asegurarte de devolver el role
        };
    }
}

module.exports = Admin;
