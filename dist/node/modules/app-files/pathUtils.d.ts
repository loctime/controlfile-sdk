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
export declare function normalizePath(path: string | string[] | undefined | null): string[];
