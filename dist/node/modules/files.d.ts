/**
 * Módulo de archivos
 *
 * ⚠️ LEGACY: Este módulo expone APIs legacy que violan el contrato App ↔ ControlFile v1.
 *
 * Las aplicaciones externas NO deben usar este módulo directamente para operaciones
 * que involucren carpetas o parentId.
 *
 * Para operaciones contractuales, usar `client.forApp(appId, userId)` que devuelve
 * un módulo que cumple con el contrato v1.
 *
 * Este módulo se mantiene por compatibilidad hacia atrás y será deprecado parcialmente
 * en el futuro (solo los métodos que exponen parentId).
 *
 * @see CONTRACT-folders.md para más detalles sobre el contrato
 */
import { HttpClient } from '../utils/http';
import type { ListFilesParams, ListFilesResponse, GetDownloadUrlResponse, UploadParams, UploadResponse, UploadFileParams, FileResponse, ReplaceFileResponse } from '../types';
export declare class FilesModule {
    private http;
    constructor(http: HttpClient);
    /**
     * Lista archivos y carpetas
     *
     * ⚠️ LEGACY: Este método expone parentId, lo cual viola el contrato App ↔ ControlFile v1.
     *
     * Las apps deben usar `client.forApp(appId, userId).listFiles({ path })` en su lugar,
     * que usa paths relativos al app root y no expone parentId.
     *
     * @deprecated Para apps, usar `client.forApp(appId, userId).listFiles()` en su lugar
     */
    list(params?: ListFilesParams): Promise<ListFilesResponse>;
    /**
     * Obtiene URL de descarga presignada (expira en 5 minutos)
     */
    getDownloadUrl(fileId: string): Promise<GetDownloadUrlResponse>;
    /**
     * Sube un archivo (flujo completo: presign → upload → confirm)
     *
     * ⚠️ LEGACY: Este método expone parentId, lo cual viola el contrato App ↔ ControlFile v1.
     *
     * Las apps deben usar `client.forApp(appId, userId).uploadFile({ file, path })` en su lugar,
     * que usa paths relativos al app root y no expone parentId.
     *
     * @deprecated Para apps, usar `client.forApp(appId, userId).uploadFile()` en su lugar
     */
    upload(params: UploadParams): Promise<UploadResponse>;
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
    /**
     * Sube un archivo asegurando primero que la ruta de carpetas exista
     *
     * ⚠️ LEGACY: Este método usa ensurePath legacy que puede crear carpetas raíz,
     * lo cual viola el contrato App ↔ ControlFile v1.
     *
     * Las apps deben usar `client.forApp(appId, userId).uploadFile({ file, path })` en su lugar,
     * que resuelve paths relativos al app root y cumple con el contrato v1.
     *
     * @deprecated Para apps, usar `client.forApp(appId, userId).uploadFile()` en su lugar
     */
    uploadFile(params: UploadFileParams): Promise<FileResponse>;
}
