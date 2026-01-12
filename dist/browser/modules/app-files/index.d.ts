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
import { HttpClient } from '../../utils/http';
import type { AppListFilesParams, AppEnsurePathParams, AppUploadFileParams, ListFilesResponse, UploadResponse } from '../../types';
export declare class AppFilesModule {
    private http;
    private appId;
    private userId;
    private appRootId;
    constructor(http: HttpClient, appId: string, userId: string);
    /**
     * Inicializa el módulo obteniendo/creando el app root
     *
     * Debe llamarse antes de usar otros métodos, o se llamará automáticamente
     * en la primera operación que lo requiera.
     */
    initialize(): Promise<void>;
    /**
     * Asegura que el app root esté inicializado
     */
    private ensureInitialized;
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
    listFiles(params?: AppListFilesParams): Promise<ListFilesResponse>;
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
    ensurePath(params: AppEnsurePathParams): Promise<string>;
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
    uploadFile(params: AppUploadFileParams): Promise<UploadResponse>;
    /**
     * Sube el archivo al storage usando uploadUrl, method y headers del backend
     */
    private uploadToStorage;
}
