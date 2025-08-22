class ApiResponse {
    constructor(statusCode, message, status = 'success', data = []
    ) {
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

module.exports = ApiResponse;
