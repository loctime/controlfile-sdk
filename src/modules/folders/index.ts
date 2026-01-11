/**
 * Módulo de carpetas
 */

import { HttpClient } from '../../utils/http';
import { ensurePath as ensurePathFn } from './ensurePath';
import type { EnsurePathParams } from '../../types';

export class FoldersModule {
  constructor(private http: HttpClient) {}

  /**
   * Asegura que una ruta de carpetas exista, creándola si es necesario
   * Función idempotente: si la ruta ya existe, la reutiliza
   */
  async ensurePath(params: EnsurePathParams): Promise<string> {
    return ensurePathFn(this.http, params);
  }
}
