/**
 * Cliente principal del SDK
 */
import { HttpClient } from './utils/http';
import { FilesModule } from './modules/files';
import { SharesModule } from './modules/shares';
export class ControlFileClient {
    constructor(config) {
        // Configurar opciones por defecto
        const options = {
            timeout: config.options?.timeout ?? 30000,
            retries: config.options?.retries ?? 3,
        };
        // Crear cliente HTTP interno
        this.http = new HttpClient({
            baseUrl: config.baseUrl,
            getAuthToken: config.getAuthToken,
            timeout: options.timeout,
            retries: options.retries,
        });
        // Crear módulos
        this.files = new FilesModule(this.http);
        this.shares = new SharesModule(this.http, config.baseUrl);
    }
}
