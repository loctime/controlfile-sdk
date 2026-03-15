import { AppFilesModule } from './index.js';
export class AppFilesNamespace {
    constructor(http) {
        this.http = http;
    }
    forApp(appId, userId) {
        if (!appId || typeof appId !== 'string' || appId.trim().length === 0) {
            throw new Error('appId es requerido y debe ser una cadena no vacia');
        }
        return new AppFilesModule(this.http, appId, userId || '');
    }
}
