/**
 * Sube un archivo asegurando primero que la ruta de carpetas exista
 */

import { HttpClient } from '../../utils/http';
import { ensurePath } from '../folders/ensurePath';
import { FilesModule } from '../files';
import type { UploadFileParams, FileResponse } from '../../types';

export async function uploadFile(
  http: HttpClient,
  filesModule: FilesModule,
  params: UploadFileParams
): Promise<FileResponse> {
  const { file, path, userId, onProgress } = params;

  if (!file || !(file instanceof File || file instanceof Blob)) {
    throw new Error('El parámetro file debe ser un File o Blob válido');
  }

  const fileName = file instanceof File ? file.name : 'archivo';

  if (!fileName || fileName.trim() === '') {
    throw new Error('El archivo debe tener un nombre válido');
  }

  const folderId = await ensurePath(http, { path, userId });

  if (!folderId) {
    throw new Error('No se pudo obtener el folderId de la ruta');
  }

  const uploadResponse = await filesModule.upload({
    file,
    name: fileName,
    parentId: folderId,
    onProgress,
  });

  return uploadResponse;
}
