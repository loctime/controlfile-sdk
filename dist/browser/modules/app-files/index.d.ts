/**
 * Modulo contractual de archivos para aplicaciones externas.
 */
import type { AppEnsurePathParams, AppListFilesParams, AppUploadFileParams, ListFilesResponse, UploadResponse } from '../../types.js';
import { HttpClient } from '../../utils/http.js';
export declare class AppFilesModule {
    private http;
    private appId;
    private userId;
    private appRootId;
    constructor(http: HttpClient, appId: string, userId: string);
    initialize(): Promise<void>;
    private ensureInitialized;
    setUserId(userId: string): void;
    listFiles(params?: AppListFilesParams): Promise<ListFilesResponse>;
    ensurePath(pathOrParams: string | string[] | AppEnsurePathParams): Promise<string>;
    uploadFile(params: AppUploadFileParams): Promise<UploadResponse>;
    private uploadToStorage;
}
