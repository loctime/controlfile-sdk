/**
 * Módulo de archivos
 */
import { validateFileId, validateFileName, validatePageSize, validateFile, } from '../utils/validation';
export class FilesModule {
    constructor(http) {
        this.http = http;
    }
    /**
     * Lista archivos y carpetas
     */
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
        // Manejar diferentes formatos de respuesta (con/sin cache)
        const items = response.items || response.data || [];
        return {
            items,
            nextPage: response.nextPage || null,
        };
    }
    /**
     * Obtiene URL de descarga presignada (expira en 5 minutos)
     */
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
    /**
     * Sube un archivo (flujo completo: presign → upload → confirm)
     */
    async upload(params) {
        validateFile(params.file);
        validateFileName(params.name);
        const fileBlob = params.file;
        const fileSize = fileBlob.size;
        const mime = fileBlob.type || 'application/octet-stream';
        // Paso 1: Presign
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
        // Paso 2: Upload al storage usando uploadUrl, method y headers del backend
        const uploadUrl = presignResponse.uploadUrl;
        const method = presignResponse.method || 'PUT';
        const headers = presignResponse.headers || {};
        // Upload con tracking de progreso
        await this.uploadToStorage(uploadUrl, fileBlob, method, headers, params.onProgress);
        if (params.onProgress) {
            params.onProgress(90);
        }
        // Paso 3: Confirmar upload
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
            throw new Error('La respuesta de confirmación no incluye fileId');
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
    /**
     * Sube el archivo al storage usando uploadUrl, method y headers del backend
     */
    async uploadToStorage(url, fileBlob, method = 'PUT', headers = {}, onProgress) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable && onProgress) {
                    // Progreso del 10% al 90% (el resto es para presign y confirm)
                    const uploadProgress = (event.loaded / event.total) * 80 + 10;
                    onProgress(Math.min(uploadProgress, 90));
                }
            });
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                }
                else {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            });
            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed due to network error'));
            });
            xhr.addEventListener('abort', () => {
                reject(new Error('Upload was aborted'));
            });
            xhr.open(method, url);
            // Aplicar headers del backend
            Object.entries(headers).forEach(([key, value]) => {
                xhr.setRequestHeader(key, value);
            });
            // Enviar el archivo directamente como Blob/File
            xhr.send(fileBlob);
        });
    }
    /**
     * Elimina un archivo (soft delete)
     */
    async delete(fileId) {
        validateFileId(fileId);
        await this.http.call('/api/files/delete', {
            method: 'POST',
            body: JSON.stringify({ fileId }),
        });
    }
    /**
     * Renombra un archivo
     */
    async rename(fileId, newName) {
        validateFileId(fileId);
        validateFileName(newName);
        await this.http.call('/api/files/rename', {
            method: 'POST',
            body: JSON.stringify({ fileId, newName }),
        });
    }
    /**
     * Reemplaza el contenido de un archivo existente
     */
    async replace(fileId, file) {
        validateFileId(fileId);
        validateFile(file);
        const formData = new FormData();
        formData.append('fileId', fileId);
        formData.append('file', file);
        const response = await this.http.call('/api/files/replace', {
            method: 'POST',
            body: formData,
        }, true); // requireAuth
        return {
            fileId,
            size: response.size,
            mime: response.mime,
        };
    }
}
