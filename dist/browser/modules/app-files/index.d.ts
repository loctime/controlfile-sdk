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
     * Establece el userId si no se proporcionó en el constructor
     *
     * Útil cuando se crea el módulo sin userId y se quiere establecer después
     */
    setUserId(userId: string): void;
    /**
     * Lista archivos y carpetas en un path relativo al app root
     *
     * ⚠️ CONTRACTUAL: No expone parentId. Usa paths relativos al app root.
     * ⚠️ No crea carpetas automáticamente. Si el path no existe, retorna lista vacía.
     *
     * @example
     * ```typescript
     * // Listar contenido del app root
     * const root = await appFiles.listFiles({});
     *
     * // Listar contenido de una subcarpeta (acepta string o array)
     * const docs = await appFiles.listFiles({ path: 'documentos' });
     * const docs2 = await appFiles.listFiles({ path: ['documentos', '2024'] });
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
     * // Forma directa (caso común)
     * const folderId = await appFiles.ensurePath('documentos/aprobados');
     * const folderId2 = await appFiles.ensurePath(['documentos', 'aprobados']);
     *
     * // Forma con objeto (para futuras opciones)
     * const folderId3 = await appFiles.ensurePath({ path: 'documentos/aprobados' });
     * ```
     */
    ensurePath(pathOrParams: string | string[] | AppEnsurePathParams): Promise<string>;
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
     *
     * ⚠️ IMPORTANTE: En browser, NO enviamos Content-Type por defecto para evitar preflight OPTIONS.
     * Esto es necesario para compatibilidad con Backblaze B2 y otros storage S3-compatible que
     * bloquean preflight cuando Content-Type no está firmado en el presign.
     *
     * Solo se envían headers que están explícitamente incluidos en el presign (SignedHeaders).
     * Si el backend envía Content-Type pero no está firmado, se filtra automáticamente.
     */
    private uploadToStorage;
    /**
     * Filtra headers para evitar preflight OPTIONS en browser
     *
     * Remueve Content-Type si no está explícitamente firmado en el presign.
     * Esto es necesario porque:
     * - Los browsers disparan preflight cuando se envía Content-Type en PUT
     * - Backblaze B2 y otros storage S3-compatible bloquean preflight si Content-Type no está en SignedHeaders
     * - El default seguro es NO enviar Content-Type a menos que el presign lo incluya explícitamente
     *
     * @param headers Headers recibidos del backend
     * @returns Headers filtrados seguros para browser
     */
    private filterHeadersForBrowser;
}
