/**
 * Export principal del SDK @controlfile/sdk
 */

// Cliente principal
export { ControlFileClient } from './client';

// Tipos públicos
export type {
  // Tipos de dominio
  File,
  Folder,
  FileItem,
  Share,
  ShareInfo,
  Account,
  AccountStatus,
  
  // Tipos de parámetros
  ListFilesParams,
  UploadParams,
  EnsurePathParams,
  UploadFileParams,
  CreateShareParams,
  
  // Tipos de respuesta
  ListFilesResponse,
  GetDownloadUrlResponse,
  UploadResponse,
  FileResponse,
  ReplaceFileResponse,
  CreateShareResponse,
  ShareDownloadResponse,
  
  // Configuración
  ControlFileClientConfig,
  ControlFileClientOptions,
} from './types';

// Errores tipados
export {
  ControlFileError,
  AuthenticationError,
  NotFoundError,
  ForbiddenError,
  QuotaExceededError,
  ValidationError,
  NetworkError,
  ServerError,
} from './errors';
