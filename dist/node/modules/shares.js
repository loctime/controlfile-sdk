/**
 * Modulo de shares (enlaces publicos)
 */
import { buildImageUrl, buildShareUrl } from '../helpers/url-builder.js';
import { validateExpiresIn, validateFileId, validateToken } from '../utils/validation.js';
export class SharesModule {
    constructor(http, baseUrl) {
        this.http = http;
        this.baseUrl = baseUrl;
    }
    async create(params) {
        validateFileId(params.fileId);
        validateExpiresIn(params.expiresIn);
        const expiresIn = params.expiresIn ?? 24;
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
    async getInfo(token) {
        validateToken(token);
        const response = await this.http.call(`/api/shares/${token}`, { method: 'GET' }, false);
        return {
            fileName: response.fileName,
            fileSize: response.fileSize,
            mime: response.mime,
            expiresAt: response.expiresAt ? new Date(response.expiresAt) : null,
            downloadCount: response.downloadCount,
        };
    }
    async get(token) {
        return this.getInfo(token);
    }
    async getDownloadUrl(token) {
        validateToken(token);
        return this.http.call(`/api/shares/${token}/download`, { method: 'POST' }, false);
    }
    async download(token) {
        return this.getDownloadUrl(token);
    }
    getImageUrl(token, baseUrl) {
        validateToken(token);
        return buildImageUrl(token, baseUrl || this.baseUrl);
    }
    async revoke(token) {
        validateToken(token);
        await this.http.call('/api/shares/revoke', {
            method: 'POST',
            body: JSON.stringify({ shareToken: token }),
        });
    }
    async list() {
        const response = await this.http.call('/api/shares/', { method: 'GET' });
        return response.shares.map((share) => ({
            token: share.token,
            fileId: '',
            fileName: share.fileName,
            fileSize: share.fileSize,
            mime: '',
            expiresAt: share.expiresAt ? new Date(share.expiresAt) : null,
            createdAt: new Date(share.createdAt),
            downloadCount: share.downloadCount,
            shareUrl: share.shareUrl || buildShareUrl(share.token, this.baseUrl),
        }));
    }
    buildShareUrl(token) {
        validateToken(token);
        return buildShareUrl(token, this.baseUrl);
    }
    buildImageUrl(token) {
        validateToken(token);
        return buildImageUrl(token, this.baseUrl);
    }
}
