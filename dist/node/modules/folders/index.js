/**
 * Módulo de carpetas
 */
import { ensurePath as ensurePathFn } from './ensurePath';
export class FoldersModule {
    constructor(http) {
        this.http = http;
    }
    /**
     * Asegura que una ruta de carpetas exista, creándola si es necesario
     * Función idempotente: si la ruta ya existe, la reutiliza
     */
    async ensurePath(params) {
        return ensurePathFn(this.http, params);
    }
}
