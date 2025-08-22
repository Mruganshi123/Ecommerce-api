class ApiError extends Error {
    constructor(success = false, errorMessage, statusCode, errorStack) {
        super(errorMessage);
        this.statusCode = statusCode;
        this.message = errorMessage;
        this.success = success;

        if (errorStack) {
            this.errorStack = errorStack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }

    }
}

module.exports = ApiError;
