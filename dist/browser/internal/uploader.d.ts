export interface StorageUploadOptions {
    url: string;
    file: Blob;
    method?: string;
    headers?: Record<string, string>;
    onProgress?: (progress: number) => void;
    progressStart?: number;
    progressEnd?: number;
}
export declare function uploadToStorage(options: StorageUploadOptions): Promise<void>;
