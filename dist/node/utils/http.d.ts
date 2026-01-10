/**
 * Cliente HTTP interno del SDK
 * No expuesto públicamente
 */
export interface HttpClientConfig {
    baseUrl: string;
    getAuthToken: () => Promise<string>;
    timeout?: number;
    retries?: number;
}
export declare class HttpClient {
    private baseUrl;
    private getAuthToken;
    private timeout;
    private retries;
    constructor(config: HttpClientConfig);
    /**
     * Realiza una llamada HTTP autenticada
     */
    call<T>(path: string, init?: RequestInit, requireAuth?: boolean): Promise<T>;
    /**
     * Maneja errores de respuesta HTTP y los normaliza
     */
    private handleErrorResponse;
    /**
     * Determina si un error es recuperable (se puede reintentar)
     */
    private isRetryableError;
    /**
     * Delay para reintentos
     */
    private delay;
}
