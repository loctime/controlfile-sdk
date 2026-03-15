/**
 * Utilidades para normalizar paths
 */
/**
 * Normaliza un path a un array de strings
 *
 * Acepta tanto string como string[] para mejorar DX
 *
 * @example
 * normalizePath('documentos/2024') // ['documentos', '2024']
 * normalizePath(['documentos', '2024']) // ['documentos', '2024']
 * normalizePath('') // []
 * normalizePath([]) // []
 */
export function normalizePath(path) {
    if (!path) {
        return [];
    }
    if (typeof path === 'string') {
        // Dividir por '/' y filtrar segmentos vacíos
        return path.split('/').filter(segment => segment.trim().length > 0);
    }
    if (Array.isArray(path)) {
        return path.filter(segment => segment && segment.trim().length > 0);
    }
    return [];
}
