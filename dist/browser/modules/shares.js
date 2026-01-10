/**
 * Módulo de shares (enlaces públicos)
 */
import { validateFileId, validateToken, validateExpiresIn, } from '../utils/validation';
import { buildShareUrl, buildImageUrl } from '../helpers/url-builder';
export class SharesModule {
    constructor(http, baseUrl) {
        this.http = http;
        this.baseUrl = baseUrl;
    }
    /**
     * Crea un share link con expiración configurable (requiere auth)
     */
    async create(params) {
        validateFileId(params.fileId);
        validateExpiresIn(params.expiresIn);
        const expiresIn = params.expiresIn ?? 24; // default: 24 horas
        const response = await this.http.call('/api/shares/create', {
            method: 'POST',
            body: JSON.stringify({
                fileId: params.fileId,
                expiresIn,
            }),
        });
        return {
            shareToken: response.shareToken,
            shareUrl: response.shareUrl || buildShareUrl(response.shareToken, this.baseUrl),
            expiresAt: new Date(response.expiresAt),
            fileName: response.fileName,
        };
    }
    /**
     * Obtiene información de un share (público, sin auth)
     */
    async getInfo(token) {
        validateToken(token);
        const response = await this.http.call(`/api/shares/${token}`, {
            method: 'GET',
        }, false // no requiere auth
        );
        return {
            fileName: response.fileName,
            fileSize: response.fileSize,
            mime: response.mime,
            expiresAt: response.expiresAt ? new Date(response.expiresAt) : null,
            downloadCount: response.downloadCount,
        };
    }
    /**
     * Obtiene URL de descarga desde share token (público, sin auth)
     */
    async getDownloadUrl(token) {
        validateToken(token);
        return this.http.call(`/api/shares/${token}/download`, {
            method: 'POST',
        }, false // no requiere auth
        );
    }
    /**
     * Genera URL de imagen directa para usar en <img> tags (helper)
     */
    getImageUrl(token, baseUrl) {
        validateToken(token);
        return buildImageUrl(token, baseUrl || this.baseUrl);
    }
    /**
     * Revoca un share link (requiere auth)
     */
    async revoke(token) {
        validateToken(token);
        await this.http.call('/api/shares/revoke', {
            method: 'POST',
            body: JSON.stringify({ shareToken: token }),
        });
    }
    /**
     * Lista los shares del usuario autenticado (requiere auth)
     */
    async list() {
        const response = await this.http.call('/api/shares/', {
            method: 'GET',
        });
        return response.shares.map((share) => ({
            token: share.token,
            fileId: '', // No viene en la respuesta del listado
            fileName: share.fileName,
            fileSize: share.fileSize,
            mime: '', // No viene en la respuesta del listado
            expiresAt: share.expiresAt ? new Date(share.expiresAt) : null,
            createdAt: new Date(share.createdAt),
            downloadCount: share.downloadCount,
            shareUrl: share.shareUrl || buildShareUrl(share.token, this.baseUrl),
        }));
    }
    /**
     * Construye URL pública de share (helper)
     */
    buildShareUrl(token) {
        validateToken(token);
        return buildShareUrl(token, this.baseUrl);
    }
    /**
     * Construye URL de imagen de share (helper)
     */
    buildImageUrl(token) {
        validateToken(token);
        return buildImageUrl(token, this.baseUrl);
    }
}
