/**
 * Módulo de archivos
 */
import { HttpClient } from '../utils/http';
import type { ListFilesParams, ListFilesResponse, GetDownloadUrlResponse, UploadParams, UploadResponse, ReplaceFileResponse } from '../types';
export declare class FilesModule {
    private http;
    constructor(http: HttpClient);
    /**
     * Lista archivos y carpetas
     */
    list(params?: ListFilesParams): Promise<ListFilesResponse>;
    /**
     * Obtiene URL de descarga presignada (expira en 5 minutos)
     */
    getDownloadUrl(fileId: string): Promise<GetDownloadUrlResponse>;
    /**
     * Sube un archivo (flujo completo: presign → upload → confirm)
     */
    upload(params: UploadParams): Promise<UploadResponse>;
    /**
     * Sube el archivo al storage usando uploadUrl, method y headers del backend
     */
    private uploadToStorage;
    /**
     * Elimina un archivo (soft delete)
     */
    delete(fileId: string): Promise<void>;
    /**
     * Renombra un archivo
     */
    rename(fileId: string, newName: string): Promise<void>;
    /**
     * Reemplaza el contenido de un archivo existente
     */
    replace(fileId: string, file: globalThis.File | Blob): Promise<ReplaceFileResponse>;
}
