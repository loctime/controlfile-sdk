import { HttpClient } from '../../utils/http.js';
import { AppFilesModule } from './index.js';
export declare class AppFilesNamespace {
    private http;
    constructor(http: HttpClient);
    forApp(appId: string, userId?: string): AppFilesModule;
}
