/**
 * Modulo de archivos.
 * Mantiene las APIs legacy por compatibilidad con integraciones existentes.
 */
import type { EmptyTrashResponse, FileResponse, GetDownloadUrlResponse, ListFilesParams, ListFilesResponse, ReplaceFileResponse, UploadFileParams, UploadParams, UploadResponse } from '../types.js';
import { HttpClient } from '../utils/http.js';
export declare class FilesModule {
    private http;
    constructor(http: HttpClient);
    list(params?: ListFilesParams): Promise<ListFilesResponse>;
    getDownloadUrl(fileId: string): Promise<GetDownloadUrlResponse>;
    permanentDelete(fileId: string): Promise<void>;
    emptyTrash(fileIds: string[]): Promise<EmptyTrashResponse>;
    upload(params: UploadParams): Promise<UploadResponse>;
    private uploadToStorage;
    delete(fileId: string): Promise<void>;
    rename(fileId: string, newName: string): Promise<void>;
    replace(fileId: string, file: globalThis.File | Blob): Promise<ReplaceFileResponse>;
    uploadFile(params: UploadFileParams): Promise<FileResponse>;
}
