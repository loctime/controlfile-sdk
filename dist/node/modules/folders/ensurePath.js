/**
 * Asegura que una ruta de carpetas exista, creándola si es necesario
 * Función idempotente: si la ruta ya existe, la reutiliza
 */
/**
 * Normaliza una respuesta de carpeta del backend para usar siempre 'id'
 * Acepta tanto { id } como { folderId } para mantener compatibilidad
 */
function normalizeFolderResponse(response) {
    const folderId = response.id ?? response.folderId;
    if (!folderId) {
        throw new Error('Invalid /api/folders response: missing id');
    }
    return {
        ...response,
        id: folderId,
    };
}
/**
 * Normaliza un array de carpetas del backend
 */
function normalizeFolderArray(items) {
    return items.map(normalizeFolderResponse);
}
export async function ensurePath(http, params) {
    const { path, userId } = params;
    if (path.length === 0) {
        throw new Error('El path no puede estar vacío');
    }
    let currentParentId = null;
    for (const segmentName of path) {
        if (!segmentName || segmentName.trim() === '') {
            throw new Error('Los segmentos del path no pueden estar vacíos');
        }
        const existingFolder = await findFolderByName(http, segmentName, currentParentId, userId);
        if (existingFolder) {
            currentParentId = existingFolder.id;
        }
        else {
            const newFolder = await createFolder(http, segmentName, currentParentId, userId);
            currentParentId = newFolder.id;
        }
    }
    if (!currentParentId) {
        throw new Error('Error al crear la ruta de carpetas');
    }
    return currentParentId;
}
/**
 * Busca una carpeta por nombre, parentId y userId
 *
 * Nota: Si parentId es null, no se envía el parámetro en la query.
 * El backend interpreta la ausencia como carpeta raíz.
 */
async function findFolderByName(http, name, parentId, userId) {
    const qs = new URLSearchParams();
    qs.set('name', name);
    qs.set('userId', userId);
    if (parentId !== null) {
        qs.set('parentId', parentId);
    }
    const response = await http.call(`/api/folders?${qs.toString()}`);
    const rawItems = response.items || response.data || [];
    const items = normalizeFolderArray(rawItems);
    const folder = items.find((item) => item.type === 'folder' &&
        item.name === name &&
        item.userId === userId &&
        item.parentId === parentId);
    return folder || null;
}
/**
 * Crea una nueva carpeta
 *
 * Nota: POST /api/folders debe ser idempotente en el backend.
 * El backend debe tener un índice único (userId, parentId, name) para garantizar
 * que múltiples llamadas con los mismos parámetros no creen duplicados.
 */
async function createFolder(http, name, parentId, userId) {
    const response = await http.call('/api/folders', {
        method: 'POST',
        body: JSON.stringify({
            name,
            parentId,
            userId,
        }),
    });
    return normalizeFolderResponse(response);
}
