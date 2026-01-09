/**
 * Cliente principal del SDK
 */

import { HttpClient } from './utils/http';
import { FilesModule } from './modules/files';
import { SharesModule } from './modules/shares';
import { AccountsModule } from './modules/accounts';
import type {
  ControlFileClientConfig,
  ControlFileClientOptions,
} from './types';

export class ControlFileClient {
  private http: HttpClient;
  public readonly files: FilesModule;
  public readonly shares: SharesModule;
  public readonly accounts: AccountsModule;

  constructor(config: ControlFileClientConfig) {
    // Configurar opciones por defecto
    const options: Required<ControlFileClientOptions> = {
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
    this.accounts = new AccountsModule(this.http);
  }
}
