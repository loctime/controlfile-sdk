/**
 * Cliente principal del SDK
 */
import { FilesModule } from './modules/files';
import { SharesModule } from './modules/shares';
import { AccountsModule } from './modules/accounts';
import { FoldersModule } from './modules/folders';
import { AppFilesModule } from './modules/app-files';
import type { ControlFileClientConfig } from './types';
export declare class ControlFileClient {
    private http;
    readonly files: FilesModule;
    readonly shares: SharesModule;
    readonly accounts: AccountsModule;
    readonly folders: FoldersModule;
    constructor(config: ControlFileClientConfig);
    /**
     * Crea un contexto de aplicación para operaciones contractuales
     *
     * ⚠️ CONTRACTUAL v1: Este método devuelve un módulo que implementa
     * el contrato App ↔ ControlFile v1.
     *
     * Las apps deben usar este método en lugar de los módulos legacy
     * (files, folders) para operaciones de archivos y carpetas.
     *
     * @example
     * ```typescript
     * // Con userId explícito (recomendado)
     * const appFiles = client.forApp('controldoc', 'user_123');
     *
     * // userId opcional (se requerirá en la primera operación)
     * const appFiles2 = client.forApp('controldoc');
     * ```
     *
     * @param appId ID de la aplicación (ej: 'controldoc', 'controlaudit')
     * @param userId ID del usuario autenticado (opcional, se puede proporcionar después)
     * @returns Módulo de archivos contractual para la aplicación
     *
     * @see CONTRACT-folders.md para más detalles sobre el contrato
     */
    forApp(appId: string, userId?: string): AppFilesModule;
}
