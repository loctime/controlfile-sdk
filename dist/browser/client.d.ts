/**
 * Cliente principal del SDK
 */
import { FilesModule } from './modules/files';
import { SharesModule } from './modules/shares';
import { AccountsModule } from './modules/accounts';
import { FoldersModule } from './modules/folders';
import type { ControlFileClientConfig } from './types';
export declare class ControlFileClient {
    private http;
    readonly files: FilesModule;
    readonly shares: SharesModule;
    readonly accounts: AccountsModule;
    readonly folders: FoldersModule;
    constructor(config: ControlFileClientConfig);
}
