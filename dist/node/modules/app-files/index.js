/**
 * Módulo de archivos contractual para aplicaciones externas
 *
 * ⚠️ CONTRACTUAL v1: Este módulo implementa el contrato App ↔ ControlFile v1.
 *
 * Características:
 * - Encapsula la jerarquía (no expone parentId)
 * - Resuelve paths relativos al app root
 * - No permite crear carpetas raíz (parentId = null)
 * - No usa endpoints legacy directamente desde la API pública
 *
 * Las apps deben usar este módulo en lugar de los módulos legacy (files, folders).
 *
 * @see CONTRACT-folders.md para más detalles sobre el contrato
 */
import { validatePageSize, validateFile } from '../../utils/validation';
import { getOrCreateAppRoot } from './appRoot';
import { ensurePathRelative } from './ensurePathRelative';
export class AppFilesModule {
    constructor(http, appId, userId) {
        this.http = http;
        this.appId = appId;
        this.userId = userId;
        this.appRootId = null;
    }
    /**
     * Inicializa el módulo obteniendo/creando el app root
     *
     * Debe llamarse antes de usar otros métodos, o se llamará automáticamente
     * en la primera operación que lo requiera.
     */
    async initialize() {
        if (!this.appRootId) {
            this.appRootId = await getOrCreateAppRoot(this.http, this.appId, this.userId);
        }
    }
    /**
     * Asegura que el app root esté inicializado
     */
    async ensureInitialized() {
        if (!this.appRootId) {
            await this.initialize();
        }
        if (!this.appRootId) {
            throw new Error('No se pudo inicializar el app root');
        }
        return this.appRootId;
    }
    /**
     * Lista archivos y carpetas en un path relativo al app root
     *
     * ⚠️ CONTRACTUAL: No expone parentId. Usa paths relativos al app root.
     *
     * @example
     * ```typescript
     * // Listar contenido del app root
     * const root = await appFiles.listFiles({});
     *
     * // Listar contenido de una subcarpeta
     * const docs = await appFiles.listFiles({ path: ['documentos'] });
     * ```
     */
    async listFiles(params = {}) {
        validatePageSize(params.pageSize);
        const appRootId = await this.ensureInitialized();
        // Resolver el parentId desde el path relativo
        let parentId = appRootId;
        if (params.path && params.path.length > 0) {
            // Asegurar que el path existe y obtener el folderId final
            parentId = await ensurePathRelative(this.http, appRootId, params.path, this.userId);
        }
        // Listar archivos usando el parentId resuelto
        const qs = new URLSearchParams();
        qs.set('parentId', parentId);
        if (params.pageSize) {
            qs.set('pageSize', String(params.pageSize));
        }
        if (params.cursor) {
            qs.set('cursor', params.cursor);
        }
        const queryString = qs.toString();
        const path = `/api/files/list${queryString ? `?${queryString}` : ''}`;
        const response = await this.http.call(path);
        const items = response.items || response.data || [];
        return {
            items,
            nextPage: response.nextPage || null,
        };
    }
    /**
     * Asegura que un path relativo al app root exista, creándolo si es necesario
     *
     * ⚠️ CONTRACTUAL: No permite crear carpetas raíz (parentId = null).
     * Todos los paths son relativos al app root.
     *
     * @example
     * ```typescript
     * // Crear ruta: appRoot/documentos/aprobados
     * const folderId = await appFiles.ensurePath({
     *   path: ['documentos', 'aprobados']
     * });
     * ```
     */
    async ensurePath(params) {
        if (!params.path || params.path.length === 0) {
            throw new Error('El path no puede estar vacío');
        }
        const appRootId = await this.ensureInitialized();
        return ensurePathRelative(this.http, appRootId, params.path, this.userId);
    }
    /**
     * Sube un archivo a un path relativo al app root
     *
     * ⚠️ CONTRACTUAL: No expone parentId. Usa paths relativos al app root.
     *
     * @example
     * ```typescript
     * const file = document.querySelector('input[type="file"]').files[0];
     * const result = await appFiles.uploadFile({
     *   file,
     *   path: ['documentos', '2024'] // Opcional, si no se especifica sube al app root
     * });
     * ```
     */
    async uploadFile(params) {
        validateFile(params.file);
        const appRootId = await this.ensureInitialized();
        const fileBlob = params.file;
        const fileSize = fileBlob.size;
        const mime = fileBlob.type || 'application/octet-stream';
        // Determinar el nombre del archivo
        const fileName = fileBlob instanceof File
            ? fileBlob.name
            : 'archivo';
        if (!fileName || fileName.trim() === '') {
            throw new Error('El archivo debe tener un nombre válido');
        }
        // Resolver el parentId desde el path relativo (si se especifica)
        let parentId = appRootId;
        if (params.path && params.path.length > 0) {
            parentId = await ensurePathRelative(this.http, appRootId, params.path, this.userId);
        }
        // Paso 1: Presign
        if (params.onProgress) {
            params.onProgress(5);
        }
        const presignResponse = await this.http.call('/api/uploads/presign', {
            method: 'POST',
            body: JSON.stringify({
                name: fileName,
                size: fileSize,
                mime,
                parentId,
            }),
        });
        if (params.onProgress) {
            params.onProgress(10);
        }
        // Paso 2: Upload al storage
        const uploadUrl = presignResponse.uploadUrl;
        const method = presignResponse.method || 'PUT';
        const headers = presignResponse.headers || {};
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
                name: fileName,
                parentId,
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
            fileName,
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
            Object.entries(headers).forEach(([key, value]) => {
                xhr.setRequestHeader(key, value);
            });
            xhr.send(fileBlob);
        });
    }
}
