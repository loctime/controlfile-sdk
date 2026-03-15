/**
 * Asegura que una ruta de carpetas exista, creándola si es necesario
 * Función idempotente: si la ruta ya existe, la reutiliza
 *
 * ⚠️ LEGACY: Esta función permite crear carpetas raíz (parentId = null),
 * lo cual viola el contrato App ↔ ControlFile v1.
 *
 * Las apps deben usar `ensurePathRelative()` en su lugar, que resuelve
 * paths relativos al app root y no permite crear carpetas raíz.
 *
 * @deprecated Esta función es legacy y será reemplazada por la API contractual
 */
import { HttpClient } from '../../utils/http.js';
import type { EnsurePathParams } from '../../types.js';
export declare function ensurePath(http: HttpClient, params: EnsurePathParams): Promise<string>;
