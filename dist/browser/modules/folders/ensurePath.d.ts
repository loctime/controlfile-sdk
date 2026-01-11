/**
 * Asegura que una ruta de carpetas exista, creándola si es necesario
 * Función idempotente: si la ruta ya existe, la reutiliza
 */
import { HttpClient } from '../../utils/http';
import type { EnsurePathParams } from '../../types';
export declare function ensurePath(http: HttpClient, params: EnsurePathParams): Promise<string>;
