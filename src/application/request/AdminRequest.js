// src/application/request/adminRequest.js

class AdminRequest {
    constructor(username, passwordHash) {
        this.username = username;
        this.passwordHash = passwordHash;
    }

    // Convertir la solicitud a la entidad Admin
    toDomain() {
        const { username, passwordHash } = this;
        const Admin = require('../../domain/entity/admin');
        return new Admin(null, username, passwordHash); // ID es null al crear
    }
}

module.exports = AdminRequest;
