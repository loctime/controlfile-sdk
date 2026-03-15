/**
 * Modulo de archivos.
 * Mantiene las APIs legacy por compatibilidad con integraciones existentes.
 */
import { uploadToStorage as uploadFileToStorage } from '../internal/uploader.js';
import { validateFile, validateFileId, validateFileName, validatePageSize } from '../utils/validation.js';
import { ensurePath } from './folders/ensurePath.js';
export class FilesModule {
    constructor(http) {
        this.http = http;
    }
    async list(params = {}) {
        validatePageSize(params.pageSize);
        const qs = new URLSearchParams();
        if (params.parentId !== undefined) {
            qs.set('parentId', String(params.parentId));
        }
        if (params.pageSize) {
            qs.set('pageSize', String(params.pageSize));
        }
        if (params.cursor) {
            qs.set('cursor', params.cursor);
        }
        const queryString = qs.toString();
        const path = `/api/files/list${queryString ? `?${queryString}` : ''}`;
        const response = await this.http.call(path);
        return {
            items: response.items || response.data || [],
            nextPage: response.nextPage || null,
        };
    }
    async getDownloadUrl(fileId) {
        validateFileId(fileId);
        const response = await this.http.call('/api/files/presign-get', {
            method: 'POST',
            body: JSON.stringify({ fileId }),
        });
        return {
            downloadUrl: response.downloadUrl,
            fileName: response.fileName,
            fileSize: response.fileSize,
            mimeType: response.mimeType,
        };
    }
    async permanentDelete(fileId) {
        validateFileId(fileId);
        await this.http.call('/api/files/permanent-delete', {
            method: 'POST',
            body: JSON.stringify({ fileId }),
        });
    }
    async emptyTrash(fileIds) {
        if (!Array.isArray(fileIds) || fileIds.length === 0) {
            throw new Error('fileIds debe ser un arreglo no vacio');
        }
        return this.http.call('/api/files/empty-trash', {
            method: 'POST',
            body: JSON.stringify({ fileIds }),
        });
    }
    async upload(params) {
        validateFile(params.file);
        validateFileName(params.name);
        const fileBlob = params.file;
        const fileSize = fileBlob.size;
        const mime = fileBlob.type || 'application/octet-stream';
        if (params.onProgress) {
            params.onProgress(5);
        }
        const presignResponse = await this.http.call('/api/uploads/presign', {
            method: 'POST',
            body: JSON.stringify({
                name: params.name,
                size: fileSize,
                mime,
                parentId: params.parentId,
            }),
        });
        if (params.onProgress) {
            params.onProgress(10);
        }
        await this.uploadToStorage(presignResponse.uploadUrl, fileBlob, presignResponse.method || 'PUT', presignResponse.headers || {}, params.onProgress);
        if (params.onProgress) {
            params.onProgress(90);
        }
        const confirmResponse = await this.http.call('/api/uploads/confirm', {
            method: 'POST',
            body: JSON.stringify({
                uploadSessionId: presignResponse.uploadSessionId,
                key: presignResponse.fileKey,
                size: fileSize,
                mime,
                name: params.name,
                parentId: params.parentId,
            }),
        });
        if (!confirmResponse.fileId) {
            throw new Error('La respuesta de confirmacion no incluye fileId');
        }
        if (params.onProgress) {
            params.onProgress(100);
        }
        return {
            fileId: confirmResponse.fileId,
            fileName: params.name,
            fileSize,
        };
    }
    async uploadToStorage(url, fileBlob, method = 'PUT', headers = {}, onProgress) {
        await uploadFileToStorage({
            url,
            file: fileBlob,
            method,
            headers,
            onProgress,
            progressStart: 10,
            progressEnd: 90,
        });
    }
    async delete(fileId) {
        validateFileId(fileId);
        await this.http.call('/api/files/delete', {
            method: 'POST',
            body: JSON.stringify({ fileId }),
        });
    }
    async rename(fileId, newName) {
        validateFileId(fileId);
        validateFileName(newName);
        await this.http.call('/api/files/rename', {
            method: 'POST',
            body: JSON.stringify({ fileId, newName }),
        });
    }
    async replace(fileId, file) {
        validateFileId(fileId);
        validateFile(file);
        const formData = new FormData();
        formData.append('fileId', fileId);
        formData.append('file', file);
        const response = await this.http.call('/api/files/replace', {
            method: 'POST',
            body: formData,
        });
        return {
            fileId,
            size: response.size,
            mime: response.mime,
        };
    }
    async uploadFile(params) {
        const { file, path, userId, onProgress } = params;
        validateFile(file);
        const fileName = typeof file.name === 'string'
            ? file.name
            : 'archivo';
        if (!fileName || fileName.trim() === '') {
            throw new Error('El archivo debe tener un nombre valido');
        }
        const folderId = await ensurePath(this.http, { path, userId });
        if (!folderId) {
            throw new Error('No se pudo obtener el folderId de la ruta');
        }
        return this.upload({
            file,
            name: fileName,
            parentId: folderId,
            onProgress,
        });
    }
}
