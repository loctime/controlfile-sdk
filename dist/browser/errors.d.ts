/**
 * Errores tipados del SDK
 */
export declare class ControlFileError extends Error {
    code?: string | undefined;
    statusCode?: number | undefined;
    originalError?: unknown | undefined;
    constructor(message: string, code?: string | undefined, statusCode?: number | undefined, originalError?: unknown | undefined);
}
export declare class AuthenticationError extends ControlFileError {
    constructor(message?: string, originalError?: unknown);
}
export declare class NotFoundError extends ControlFileError {
    constructor(message?: string, originalError?: unknown);
}
export declare class ForbiddenError extends ControlFileError {
    constructor(message?: string, originalError?: unknown);
}
export declare class QuotaExceededError extends ControlFileError {
    usedBytes?: number | undefined;
    pendingBytes?: number | undefined;
    planQuotaBytes?: number | undefined;
    requiredBytes?: number | undefined;
    constructor(message?: string, usedBytes?: number | undefined, pendingBytes?: number | undefined, planQuotaBytes?: number | undefined, requiredBytes?: number | undefined, originalError?: unknown);
}
export declare class ValidationError extends ControlFileError {
    constructor(message?: string, originalError?: unknown);
}
export declare class NetworkError extends ControlFileError {
    constructor(message?: string, originalError?: unknown);
}
export declare class ServerError extends ControlFileError {
    constructor(message?: string, originalError?: unknown);
}
