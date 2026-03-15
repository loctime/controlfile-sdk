/**
 * Lógica para obtener/crear el app root
 *
 * ⚠️ TRANSITIONAL: Esta implementación simula el app root usando una carpeta
 * con nombre especial `__app_${appId}` en la raíz global.
 *
 * Cuando el backend implemente `POST /api/apps/:appId/root`, esta función
 * debe migrarse para usar ese endpoint en lugar de crear carpetas directamente.
 *
 * @see CONTRACT-folders.md para más detalles sobre el contrato
 */
import { HttpClient } from '../../utils/http.js';
/**
 * Genera el nombre de la carpeta app root para una aplicación
 */
export declare function getAppRootFolderName(appId: string): string;
/**
 * Obtiene o crea el app root para una aplicación
 *
 * ⚠️ TRANSITIONAL: Actualmente simula el app root creando una carpeta
 * con nombre especial en la raíz global. En el futuro, esto debe usar
 * `POST /api/apps/:appId/root`.
 *
 * @param http Cliente HTTP
 * @param appId ID de la aplicación
 * @param userId ID del usuario
 * @returns ID de la carpeta app root
 */
export declare function getOrCreateAppRoot(http: HttpClient, appId: string, userId: string): Promise<string>;
