/**
 * Modulo de shares (enlaces publicos)
 */
import type { CreateShareParams, CreateShareResponse, Share, ShareDownloadResponse, ShareInfo } from '../types.js';
import { HttpClient } from '../utils/http.js';
export declare class SharesModule {
    private http;
    private baseUrl;
    constructor(http: HttpClient, baseUrl: string);
    create(params: CreateShareParams): Promise<CreateShareResponse>;
    getInfo(token: string): Promise<ShareInfo>;
    get(token: string): Promise<ShareInfo>;
    getDownloadUrl(token: string): Promise<ShareDownloadResponse>;
    download(token: string): Promise<ShareDownloadResponse>;
    getImageUrl(token: string, baseUrl?: string): string;
    revoke(token: string): Promise<void>;
    list(): Promise<Share[]>;
    buildShareUrl(token: string): string;
    buildImageUrl(token: string): string;
}
