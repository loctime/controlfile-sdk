/**
 * Cliente principal del SDK
 */
import { FilesModule } from './modules/files';
import { SharesModule } from './modules/shares';
import { AccountsModule } from './modules/accounts';
import type { ControlFileClientConfig } from './types';
export declare class ControlFileClient {
    private http;
    readonly files: FilesModule;
    readonly shares: SharesModule;
    readonly accounts: AccountsModule;
    constructor(config: ControlFileClientConfig);
}
