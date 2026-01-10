/**
 * Módulo de shares (enlaces públicos)
 */
import { HttpClient } from '../utils/http';
import type { CreateShareParams, CreateShareResponse, ShareInfo, ShareDownloadResponse, Share } from '../types';
export declare class SharesModule {
    private http;
    private baseUrl;
    constructor(http: HttpClient, baseUrl: string);
    /**
     * Crea un share link con expiración configurable (requiere auth)
     */
    create(params: CreateShareParams): Promise<CreateShareResponse>;
    /**
     * Obtiene información de un share (público, sin auth)
     */
    getInfo(token: string): Promise<ShareInfo>;
    /**
     * Obtiene URL de descarga desde share token (público, sin auth)
     */
    getDownloadUrl(token: string): Promise<ShareDownloadResponse>;
    /**
     * Genera URL de imagen directa para usar en <img> tags (helper)
     */
    getImageUrl(token: string, baseUrl?: string): string;
    /**
     * Revoca un share link (requiere auth)
     */
    revoke(token: string): Promise<void>;
    /**
     * Lista los shares del usuario autenticado (requiere auth)
     */
    list(): Promise<Share[]>;
    /**
     * Construye URL pública de share (helper)
     */
    buildShareUrl(token: string): string;
    /**
     * Construye URL de imagen de share (helper)
     */
    buildImageUrl(token: string): string;
}
