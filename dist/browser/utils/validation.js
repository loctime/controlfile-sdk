/**
 * Validaciones de parametros de entrada
 * No expuestas publicamente
 */
import { ValidationError } from '../errors.js';
export function validateFileId(fileId) {
    if (!fileId || typeof fileId !== 'string' || fileId.trim().length === 0) {
        throw new ValidationError('fileId es requerido y debe ser una cadena no vacia');
    }
}
export function validateToken(token) {
    if (!token || typeof token !== 'string' || token.trim().length === 0) {
        throw new ValidationError('token es requerido y debe ser una cadena no vacia');
    }
}
export function validateFileName(name) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new ValidationError('name es requerido y debe ser una cadena no vacia');
    }
}
export function validatePageSize(pageSize) {
    if (pageSize !== undefined) {
        if (typeof pageSize !== 'number' || pageSize < 1 || pageSize > 200) {
            throw new ValidationError('pageSize debe ser un numero entre 1 y 200');
        }
    }
}
export function validateExpiresIn(expiresIn) {
    if (expiresIn !== undefined) {
        if (typeof expiresIn !== 'number' || expiresIn < 1) {
            throw new ValidationError('expiresIn debe ser un numero mayor a 0');
        }
    }
}
export function validateFile(file) {
    if (!file) {
        throw new ValidationError('file es requerido');
    }
    const fileCtor = typeof globalThis.File !== 'undefined' ? globalThis.File : null;
    const isFile = fileCtor ? file instanceof fileCtor : false;
    const isBlob = file instanceof Blob;
    if (!isFile && !isBlob) {
        throw new ValidationError('file debe ser una instancia de File o Blob');
    }
}
