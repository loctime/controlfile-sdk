/**
 * Asegura que un path relativo al app root exista
 *
 * ⚠️ CONTRACTUAL: Esta función NO permite crear carpetas raíz (parentId = null).
 * Todos los paths son relativos al appRootId proporcionado.
 *
 * @see CONTRACT-folders.md para más detalles sobre el contrato
 */
import { HttpClient } from '../../utils/http';
/**
 * Asegura que un path relativo al app root exista, creándolo si es necesario
 *
 * ⚠️ CONTRACTUAL: Esta función garantiza que:
 * - NUNCA crea carpetas con parentId = null
 * - Todos los paths son relativos al appRootId
 * - Es idempotente: si el path ya existe, lo reutiliza
 *
 * @param http Cliente HTTP
 * @param appRootId ID de la carpeta app root (nunca null)
 * @param path Path relativo al app root (ej: ['documentos', '2024'])
 * @param userId ID del usuario
 * @returns ID de la carpeta final del path
 */
export declare function ensurePathRelative(http: HttpClient, appRootId: string, path: string[], userId: string): Promise<string>;
/**
 * Resuelve un path relativo al app root sin crearlo
 *
 * ⚠️ CONTRACTUAL: Esta función solo busca, no crea carpetas.
 * Retorna null si el path no existe.
 *
 * @param http Cliente HTTP
 * @param appRootId ID de la carpeta app root (nunca null)
 * @param path Path relativo al app root (ej: ['documentos', '2024'])
 * @param userId ID del usuario
 * @returns ID de la carpeta final del path, o null si no existe
 */
export declare function resolvePathRelative(http: HttpClient, appRootId: string, path: string[], userId: string): Promise<string | null>;
