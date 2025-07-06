module.exports = class ApiError extends Error{
    status;
    errors;

    constructor(status, message, errors = []){
        super(message);
        this.status = status;
        this.errors = errors;
        
    }

    static UnauthorizedError(message = 'Пользователь не авторизован') {
        return new ApiError(401, message);
    }

    static BadRequest(message, errors = []){
        return new ApiError(400, message, errors);
    }

    static NotFound(message, errors = []){
        return new ApiError(404, message, errors);
    }

    static Forbidden(message, errors = []){
        return new ApiError(403, message, errors);
    }

}