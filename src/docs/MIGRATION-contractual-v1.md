# Migración a la API Contractual v1

Este documento explica cómo migrar aplicaciones externas (ControlDoc, ControlAudit, etc.) de la API legacy a la nueva API contractual v1.

## ¿Por qué migrar?

La API legacy permite operaciones que violan el contrato App ↔ ControlFile v1:
- ❌ Crear carpetas raíz (`parentId = null`)
- ❌ Exponer `parentId` en la API pública
- ❌ Usar endpoints legacy directamente (`/api/folders/*`)

La nueva API contractual:
- ✅ Encapsula la jerarquía (no expone `parentId`)
- ✅ Resuelve paths relativos al app root
- ✅ No permite crear carpetas raíz
- ✅ Cumple con el contrato App ↔ ControlFile v1

## Cambios principales

### Antes (API Legacy)

```typescript
import { ControlFileClient } from '@controlfile/sdk';

const client = new ControlFileClient({ /* config */ });

// ❌ Expone parentId
const files = await client.files.list({ parentId: 'folder_123' });

// ❌ Puede crear carpetas raíz
const rootFolderId = await client.folders.ensurePath({
  path: ['app1'], // Esto crea una carpeta raíz
  userId: 'user_123'
});

// ❌ Expone parentId
await client.files.upload({
  file: myFile,
  name: 'documento.pdf',
  parentId: rootFolderId
});
```

### Después (API Contractual v1)

```typescript
import { ControlFileClient } from '@controlfile/sdk';

const client = new ControlFileClient({ /* config */ });

// ✅ Obtener contexto de aplicación
const appFiles = client.forApp('controldoc', 'user_123');

// ✅ Listar usando paths relativos (no expone parentId)
const files = await appFiles.listFiles({ 
  path: ['documentos'] // Relativo al app root
});

// ✅ Asegurar path relativo (nunca crea carpetas raíz)
const folderId = await appFiles.ensurePath({
  path: ['documentos', 'aprobados'] // Relativo al app root
});

// ✅ Subir archivo usando path relativo (no expone parentId)
await appFiles.uploadFile({
  file: myFile,
  path: ['documentos', '2024'] // Opcional, relativo al app root
});
```

## Guía de migración paso a paso

### Paso 1: Obtener contexto de aplicación

**Antes:**
```typescript
// No había contexto de aplicación
const folderId = await client.folders.ensurePath({
  path: ['app1', 'documentos'],
  userId: 'user_123'
});
```

**Después:**
```typescript
// Crear contexto de aplicación una vez
const appFiles = client.forApp('controldoc', 'user_123');

// Usar el contexto para todas las operaciones
const folderId = await appFiles.ensurePath({
  path: ['documentos'] // Path relativo al app root
});
```

### Paso 2: Migrar `ensurePath`

**Antes:**
```typescript
// ❌ Puede crear carpetas raíz si el path empieza desde la raíz
const folderId = await client.folders.ensurePath({
  path: ['app1', 'documentos', '2024'],
  userId: 'user_123'
});
```

**Después:**
```typescript
// ✅ Path siempre relativo al app root (nunca crea carpetas raíz)
const appFiles = client.forApp('controldoc', 'user_123');
const folderId = await appFiles.ensurePath({
  path: ['documentos', '2024'] // El app root ya está implícito
});
```

**Nota importante:** El primer segmento del path legacy (`'app1'`) ya no es necesario porque el app root se gestiona automáticamente.

### Paso 3: Migrar `listFiles`

**Antes:**
```typescript
// ❌ Expone parentId
const result = await client.files.list({ 
  parentId: 'folder_123',
  pageSize: 50
});
```

**Después:**
```typescript
// ✅ Usa paths relativos (no expone parentId)
const appFiles = client.forApp('controldoc', 'user_123');
const result = await appFiles.listFiles({ 
  path: ['documentos'], // Relativo al app root
  pageSize: 50
});

// Listar contenido del app root
const rootContent = await appFiles.listFiles({});
```

### Paso 4: Migrar `uploadFile`

**Antes:**
```typescript
// ❌ Expone parentId o usa ensurePath legacy
await client.files.uploadFile({
  file: myFile,
  path: ['app1', 'documentos', '2024'],
  userId: 'user_123'
});
```

**Después:**
```typescript
// ✅ Usa paths relativos (no expone parentId)
const appFiles = client.forApp('controldoc', 'user_123');
await appFiles.uploadFile({
  file: myFile,
  path: ['documentos', '2024'] // Opcional, relativo al app root
});

// Subir directamente al app root
await appFiles.uploadFile({
  file: myFile
  // Sin path = sube al app root
});
```

### Paso 5: Migrar `upload` (si se usa directamente)

**Antes:**
```typescript
// ❌ Expone parentId
await client.files.upload({
  file: myFile,
  name: 'documento.pdf',
  parentId: 'folder_123'
});
```

**Después:**
```typescript
// ✅ Usa uploadFile con path relativo
const appFiles = client.forApp('controldoc', 'user_123');
await appFiles.uploadFile({
  file: myFile,
  path: ['documentos'] // El nombre del archivo se toma del File
});
```

## Mapeo de métodos

| API Legacy | API Contractual v1 | Notas |
|------------|-------------------|-------|
| `client.folders.ensurePath({ path, userId })` | `appFiles.ensurePath({ path })` | Path relativo al app root |
| `client.files.list({ parentId })` | `appFiles.listFiles({ path })` | Path relativo al app root |
| `client.files.uploadFile({ file, path, userId })` | `appFiles.uploadFile({ file, path })` | Path relativo al app root |
| `client.files.upload({ file, name, parentId })` | `appFiles.uploadFile({ file, path })` | Usar uploadFile en su lugar |

## Ejemplo completo de migración

### Antes (API Legacy)

```typescript
import { ControlFileClient } from '@controlfile/sdk';

const client = new ControlFileClient({
  baseUrl: 'https://api.controlfile.com',
  getAuthToken: async () => { /* ... */ }
});

// Crear estructura de carpetas
const documentosId = await client.folders.ensurePath({
  path: ['controldoc', 'documentos'],
  userId: 'user_123'
});

const aprobadosId = await client.folders.ensurePath({
  path: ['controldoc', 'documentos', 'aprobados'],
  userId: 'user_123'
});

// Listar archivos
const files = await client.files.list({ 
  parentId: aprobadosId 
});

// Subir archivo
await client.files.uploadFile({
  file: myFile,
  path: ['controldoc', 'documentos', 'aprobados'],
  userId: 'user_123'
});
```

### Después (API Contractual v1)

```typescript
import { ControlFileClient } from '@controlfile/sdk';

const client = new ControlFileClient({
  baseUrl: 'https://api.controlfile.com',
  getAuthToken: async () => { /* ... */ }
});

// Obtener contexto de aplicación
const appFiles = client.forApp('controldoc', 'user_123');

// Crear estructura de carpetas (paths relativos al app root)
await appFiles.ensurePath({
  path: ['documentos']
});

await appFiles.ensurePath({
  path: ['documentos', 'aprobados']
});

// Listar archivos (path relativo al app root)
const files = await appFiles.listFiles({ 
  path: ['documentos', 'aprobados']
});

// Subir archivo (path relativo al app root)
await appFiles.uploadFile({
  file: myFile,
  path: ['documentos', 'aprobados']
});
```

## Compatibilidad

- ✅ La API legacy sigue funcionando (no se rompe compatibilidad)
- ✅ Las apps pueden migrar gradualmente
- ⚠️ La API legacy está marcada como `@deprecated` y será removida en el futuro

## Notas importantes

### App Root

El app root se crea automáticamente la primera vez que usas `client.forApp()`. Actualmente se simula usando una carpeta con nombre especial `__app_${appId}` en la raíz global.

**⚠️ TRANSITIONAL:** Cuando el backend implemente `POST /api/apps/:appId/root`, el SDK migrará automáticamente a usar ese endpoint. Las apps no necesitan cambiar su código.

### Paths relativos

Todos los paths en la API contractual son relativos al app root:
- `[]` o `undefined` = app root
- `['documentos']` = `appRoot/documentos`
- `['documentos', '2024']` = `appRoot/documentos/2024`

### No más parentId

La API contractual **no expone `parentId`** en ningún método público. La jerarquía está completamente encapsulada.

## Preguntas frecuentes

### ¿Puedo seguir usando la API legacy?

Sí, pero no es recomendado. La API legacy está marcada como `@deprecated` y será removida en el futuro.

### ¿Qué pasa con mis carpetas existentes?

Las carpetas existentes siguen funcionando. La migración es gradual y no requiere mover datos.

### ¿Cómo obtengo el userId?

El `userId` debe obtenerse de tu sistema de autenticación. El SDK no lo obtiene automáticamente porque cada app puede tener su propio sistema de autenticación.

### ¿Qué pasa si uso un appId diferente?

Cada `appId` tiene su propio app root. Si cambias el `appId`, estarás trabajando con un app root diferente.

## Referencias

- [Contrato App ↔ ControlFile v1](./CONTRACT-folders.md)
- [Documentación del SDK](../../README.md)
