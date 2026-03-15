/**
 * Cliente principal del SDK
 */
import { HttpClient } from './utils/http.js';
import { FilesModule } from './modules/files.js';
import { SharesModule } from './modules/shares.js';
import { FoldersModule } from './modules/folders/index.js';
import { UsersModule } from './modules/users.js';
import { AppFilesNamespace } from './modules/app-files/namespace.js';
export class ControlFileClient {
    constructor(config) {
        const options = {
            timeout: config.options?.timeout ?? 30000,
            retries: config.options?.retries ?? 3,
        };
        this.http = new HttpClient({
            baseUrl: config.baseUrl,
            getAuthToken: config.getAuthToken,
            timeout: options.timeout,
            retries: options.retries,
        });
        this.files = new FilesModule(this.http);
        this.shares = new SharesModule(this.http, config.baseUrl);
        this.folders = new FoldersModule(this.http);
        this.users = new UsersModule(this.http);
        this.appFiles = new AppFilesNamespace(this.http);
    }
    /**
     * Alias mantenido por compatibilidad.
     * Equivale a client.appFiles.forApp(appId, userId).
     */
    forApp(appId, userId) {
        return this.appFiles.forApp(appId, userId);
    }
}
