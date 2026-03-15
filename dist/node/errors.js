/**
 * Errores tipados del SDK
 */
export class ControlFileError extends Error {
    constructor(message, code, statusCode, originalError) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.originalError = originalError;
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, ControlFileError.prototype);
    }
}
export class AuthenticationError extends ControlFileError {
    constructor(message = 'No autorizado', originalError) {
        super(message, 'AUTH_ERROR', 401, originalError);
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}
export class NotFoundError extends ControlFileError {
    constructor(message = 'Recurso no encontrado', originalError) {
        super(message, 'NOT_FOUND', 404, originalError);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
export class ForbiddenError extends ControlFileError {
    constructor(message = 'Acceso denegado', originalError) {
        super(message, 'FORBIDDEN', 403, originalError);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}
export class QuotaExceededError extends ControlFileError {
    constructor(message = 'Cuota de almacenamiento excedida', usedBytes, pendingBytes, planQuotaBytes, requiredBytes, originalError) {
        super(message, 'QUOTA_EXCEEDED', 413, originalError);
        this.usedBytes = usedBytes;
        this.pendingBytes = pendingBytes;
        this.planQuotaBytes = planQuotaBytes;
        this.requiredBytes = requiredBytes;
        Object.setPrototypeOf(this, QuotaExceededError.prototype);
    }
}
export class ValidationError extends ControlFileError {
    constructor(message = 'Parámetros inválidos', originalError) {
        super(message, 'VALIDATION_ERROR', 400, originalError);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
export class NetworkError extends ControlFileError {
    constructor(message = 'Error de red', originalError) {
        super(message, 'NETWORK_ERROR', undefined, originalError);
        Object.setPrototypeOf(this, NetworkError.prototype);
    }
}
export class ServerError extends ControlFileError {
    constructor(message = 'Error interno del servidor', originalError) {
        super(message, 'SERVER_ERROR', 500, originalError);
        Object.setPrototypeOf(this, ServerError.prototype);
    }
}
