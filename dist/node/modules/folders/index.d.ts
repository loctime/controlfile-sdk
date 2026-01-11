/**
 * Módulo de carpetas
 */
import { HttpClient } from '../../utils/http';
import type { EnsurePathParams } from '../../types';
export declare class FoldersModule {
    private http;
    constructor(http: HttpClient);
    /**
     * Asegura que una ruta de carpetas exista, creándola si es necesario
     * Función idempotente: si la ruta ya existe, la reutiliza
     */
    ensurePath(params: EnsurePathParams): Promise<string>;
}
