/**
 * Cliente principal del SDK
 */
import { FilesModule } from './modules/files';
import { SharesModule } from './modules/shares';
import type { ControlFileClientConfig } from './types';
export declare class ControlFileClient {
    private http;
    readonly files: FilesModule;
    readonly shares: SharesModule;
    constructor(config: ControlFileClientConfig);
}
