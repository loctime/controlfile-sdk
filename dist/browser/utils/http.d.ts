/**
 * Cliente HTTP interno del SDK
 * No expuesto publicamente
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
    call<T>(path: string, init?: RequestInit, requireAuth?: boolean): Promise<T>;
    private handleErrorResponse;
    private isRetryableError;
    private createRequestId;
    private delay;
}
