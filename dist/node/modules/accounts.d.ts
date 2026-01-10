/**
 * Módulo de cuentas
 */
import { HttpClient } from '../utils/http';
import type { Account } from '../types';
export declare class AccountsModule {
    private http;
    constructor(http: HttpClient);
    /**
     * Asegura que exista la cuenta global del usuario autenticado
     * Si no existe, el backend la crea con plan FREE
     * Devuelve el objeto Account
     */
    ensure(): Promise<Account>;
    /**
     * Obtiene el estado global de la cuenta del usuario autenticado
     * No modifica nada, solo lectura
     */
    get(): Promise<Account>;
}
