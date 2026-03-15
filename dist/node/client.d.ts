/**
 * Cliente principal del SDK
 */
import { FilesModule } from './modules/files.js';
import { SharesModule } from './modules/shares.js';
import { FoldersModule } from './modules/folders/index.js';
import { UsersModule } from './modules/users.js';
import { AppFilesNamespace } from './modules/app-files/namespace.js';
import type { ControlFileClientConfig } from './types.js';
export declare class ControlFileClient {
    private http;
    readonly files: FilesModule;
    readonly shares: SharesModule;
    readonly folders: FoldersModule;
    readonly users: UsersModule;
    readonly appFiles: AppFilesNamespace;
    constructor(config: ControlFileClientConfig);
    /**
     * Alias mantenido por compatibilidad.
     * Equivale a client.appFiles.forApp(appId, userId).
     */
    forApp(appId: string, userId?: string): import("./modules/app-files/index.js").AppFilesModule;
}
