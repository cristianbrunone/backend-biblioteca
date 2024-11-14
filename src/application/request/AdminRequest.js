// src/application/request/adminRequest.js

class AdminRequest {
    constructor(username, passwordHash, role) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;  // Agregar el role al constructor
    }

    // Convertir la solicitud a la entidad Admin
    toDomain() {
        const { username, passwordHash, role } = this;
        const Admin = require('../../domain/entity/admin');
        return new Admin(null, username, passwordHash, role); // Ahora se pasa el role
    }
}

module.exports = AdminRequest;
