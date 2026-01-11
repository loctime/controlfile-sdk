/**
 * Sube un archivo asegurando primero que la ruta de carpetas exista
 */
import { HttpClient } from '../../utils/http';
import { FilesModule } from '../files';
import type { UploadFileParams, FileResponse } from '../../types';
export declare function uploadFile(http: HttpClient, filesModule: FilesModule, params: UploadFileParams): Promise<FileResponse>;
