/**
 * Módulo de cuentas
 */
export class AccountsModule {
    constructor(http) {
        this.http = http;
    }
    /**
     * Asegura que exista la cuenta global del usuario autenticado
     * Si no existe, el backend la crea con plan FREE
     * Devuelve el objeto Account
     */
    async ensure() {
        const response = await this.http.call('/api/accounts/ensure', {
            method: 'POST',
        });
        return response;
    }
    /**
     * Obtiene el estado global de la cuenta del usuario autenticado
     * No modifica nada, solo lectura
     */
    async get() {
        const response = await this.http.call('/api/accounts/me', {
            method: 'GET',
        });
        return response;
    }
}
