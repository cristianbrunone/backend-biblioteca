// src/application/response/adminResponse.js

class AdminResponse {
    constructor(adminEntity, token) {
        this.id = adminEntity.id;
        this.username = adminEntity.username;
        this.role = adminEntity.role;  
        this.token = token;
    }
}

module.exports = AdminResponse;
