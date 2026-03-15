/**
 * Validaciones de parametros de entrada
 * No expuestas publicamente
 */
export declare function validateFileId(fileId: string): void;
export declare function validateToken(token: string): void;
export declare function validateFileName(name: string): void;
export declare function validatePageSize(pageSize?: number): void;
export declare function validateExpiresIn(expiresIn?: number): void;
export declare function validateFile(file: globalThis.File | Blob): void;
