# @controlfile/sdk

SDK oficial de ControlFile para integración con aplicaciones cliente.

## Instalación

```bash
npm install @controlfile/sdk
```

## Configuración Inicial

El SDK requiere una función `getAuthToken()` que retorne un token válido aceptado por ControlFile. El token debe incluirse en el header `Authorization: Bearer <token>` en cada solicitud.

### Ejemplo con Firebase (ejemplo de uso)

```typescript
import { ControlFileClient } from '@controlfile/sdk';
import { getAuth } from 'firebase/auth';

const auth = getAuth();

const client = new ControlFileClient({
  baseUrl: process.env.NEXT_PUBLIC_CONTROLFILE_BACKEND_URL!,
  getAuthToken: async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');
    return user.getIdToken(); // Firebase ID Token
  },
  options: {
    timeout: 30000, // 30 segundos (opcional)
    retries: 3,     // Reintentos automáticos (opcional)
  }
});
```

**Nota**: Firebase es solo un ejemplo. Puedes usar cualquier sistema de autenticación que genere tokens válidos para ControlFile.

### Ejemplo genérico (token propio / backend)

```typescript
import { ControlFileClient } from '@controlfile/sdk';

// Opción 1: Token desde localStorage/sessionStorage
const client = new ControlFileClient({
  baseUrl: process.env.NEXT_PUBLIC_CONTROLFILE_BACKEND_URL!,
  getAuthToken: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Token no disponible');
    return token;
  }
});

// Opción 2: Token desde tu backend API
const client = new ControlFileClient({
  baseUrl: process.env.NEXT_PUBLIC_CONTROLFILE_BACKEND_URL!,
  getAuthToken: async () => {
    const response = await fetch('/api/auth/token');
    const { token } = await response.json();
    return token;
  }
});

// Opción 3: Token desde cualquier proveedor de autenticación
const client = new ControlFileClient({
  baseUrl: process.env.NEXT_PUBLIC_CONTROLFILE_BACKEND_URL!,
  getAuthToken: async () => {
    // Integra con tu sistema de autenticación preferido
    return await yourAuthProvider.getToken();
  }
});
```

## Uso

### Archivos

#### Listar archivos y carpetas

```typescript
// Listar archivos en la raíz
const result = await client.files.list({ parentId: null });
console.log(result.items); // Array de archivos y carpetas
console.log(result.nextPage); // Token para paginación (si existe)

// Listar archivos en una carpeta específica
const folderFiles = await client.files.list({ 
  parentId: 'folder_123',
  pageSize: 50 
});

// Paginación
let cursor: string | null = null;
do {
  const page = await client.files.list({ 
    parentId: null,
    pageSize: 100,
    cursor 
  });
  // Procesar items...
  cursor = page.nextPage;
} while (cursor);
```

#### Obtener URL de descarga

```typescript
const downloadInfo = await client.files.getDownloadUrl('file_abc123');
console.log(downloadInfo.downloadUrl); // URL presignada (expira en 5 min)
console.log(downloadInfo.fileName);
console.log(downloadInfo.fileSize);
console.log(downloadInfo.mimeType);

// Usar la URL para descargar
window.open(downloadInfo.downloadUrl);
```

#### Subir archivo

```typescript
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const result = await client.files.upload({
  file,
  name: file.name,
  parentId: 'folder_123', // o null para raíz
  onProgress: (progress) => {
    console.log(`Progreso: ${progress}%`);
  }
});

console.log(`Archivo subido: ${result.fileId}`);
```

#### Eliminar archivo

```typescript
await client.files.delete('file_abc123');
```

#### Renombrar archivo

```typescript
await client.files.rename('file_abc123', 'nuevo-nombre.pdf');
```

#### Reemplazar contenido de archivo

```typescript
const newFile = document.querySelector('input[type="file"]').files[0];

const result = await client.files.replace('file_abc123', newFile);
console.log(`Archivo reemplazado. Nuevo tamaño: ${result.size} bytes`);
```

### Shares (Enlaces Públicos)

#### Crear share link

```typescript
const share = await client.shares.create({
  fileId: 'file_abc123',
  expiresIn: 24 // horas (opcional, default: 24)
});

console.log(share.shareToken);
console.log(share.shareUrl); // URL pública completa
console.log(share.expiresAt);
```

#### Obtener información de share (público)

```typescript
// No requiere autenticación
const info = await client.shares.getInfo('share_token_abc123');
console.log(info.fileName);
console.log(info.fileSize);
console.log(info.expiresAt);
console.log(info.downloadCount);
```

#### Obtener URL de descarga desde share (público)

```typescript
// No requiere autenticación
const downloadInfo = await client.shares.getDownloadUrl('share_token_abc123');
console.log(downloadInfo.downloadUrl); // URL presignada (expira en 5 min)
```

#### Generar URL de imagen directa (para `<img>` tags)

```typescript
const imageUrl = client.shares.getImageUrl('share_token_abc123');
// Usar en componente React/Vue/etc.
<img src={imageUrl} alt="Imagen compartida" />

// O especificar baseUrl diferente
const customUrl = client.shares.getImageUrl('share_token_abc123', 'https://custom-domain.com');
```

#### Revocar share link

```typescript
await client.shares.revoke('share_token_abc123');
```

#### Listar shares del usuario

```typescript
const shares = await client.shares.list();
shares.forEach(share => {
  console.log(share.token);
  console.log(share.fileName);
  console.log(share.shareUrl);
  console.log(share.downloadCount);
});
```

#### Helpers de URLs

```typescript
// Construir URL pública de share
const shareUrl = client.shares.buildShareUrl('share_token_abc123');

// Construir URL de imagen
const imageUrl = client.shares.buildImageUrl('share_token_abc123');
```

### Accounts (Cuentas)

#### Bootstrap de cuenta

El método `ensure()` asegura que exista la cuenta global del usuario autenticado. Si no existe, el backend la crea automáticamente con plan FREE. Este método debe llamarse en el primer login de cualquier app.

```typescript
// Asegurar que existe la cuenta (crear si no existe)
const account = await client.accounts.ensure();

console.log(account.uid);
console.log(account.email);
console.log(account.status); // 'active' | 'trial' | 'expired' | 'suspended'
console.log(account.planId); // ID del plan actual
console.log(account.limits.storageBytes); // Límite de almacenamiento
console.log(account.enabledApps); // Record<string, boolean>
```

**Cuándo usar `ensure()`:**
- En el primer login de cualquier app (una vez por usuario)
- Para inicializar la cuenta global del usuario
- El backend decide automáticamente si crear la cuenta o devolver la existente

#### Obtener cuenta actual

El método `get()` devuelve el estado global de la cuenta sin modificar nada. Úsalo para leer el estado actual de la cuenta.

```typescript
// Obtener estado de la cuenta (solo lectura)
const account = await client.accounts.get();

console.log(account.status);
console.log(account.planId);
console.log(account.limits);
console.log(account.paidUntil); // null si no hay pago
console.log(account.trialEndsAt); // null si no hay trial
```

**Nota importante:** El SDK **NO** decide billing, planes ni permisos. ControlFile es la autoridad global de cuentas, billing y estado. Las apps solo consumen este estado mediante el SDK.

## Manejo de Errores

El SDK normaliza todos los errores HTTP en clases tipadas:

```typescript
import {
  ControlFileError,
  AuthenticationError,
  NotFoundError,
  ForbiddenError,
  QuotaExceededError,
  ValidationError,
  NetworkError,
  ServerError,
} from '@controlfile/sdk';

try {
  await client.files.delete('file_abc123');
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Token inválido/expirado (401)
    console.error('Error de autenticación:', error.message);
  } else if (error instanceof NotFoundError) {
    // Archivo no encontrado (404)
    console.error('Archivo no encontrado');
  } else if (error instanceof QuotaExceededError) {
    // Cuota excedida (413)
    console.error('Cuota excedida');
    console.log('Usado:', error.usedBytes);
    console.log('Cuota:', error.planQuotaBytes);
  } else if (error instanceof ValidationError) {
    // Parámetros inválidos (400)
    console.error('Parámetros inválidos:', error.message);
  } else if (error instanceof NetworkError) {
    // Error de red o timeout
    console.error('Error de conexión:', error.message);
  } else if (error instanceof ServerError) {
    // Error del servidor (500, 502, 503, 504)
    console.error('Error del servidor:', error.message);
  } else if (error instanceof ControlFileError) {
    // Error genérico del SDK
    console.error('Error:', error.message, error.code);
  } else {
    // Error inesperado
    console.error('Error desconocido:', error);
  }
}
```

## Tipos TypeScript

El SDK exporta tipos completos para todas las operaciones:

```typescript
import type {
  File,
  Folder,
  FileItem,
  Share,
  ShareInfo,
  Account,
  AccountStatus,
  ListFilesParams,
  ListFilesResponse,
  UploadParams,
  UploadResponse,
  CreateShareParams,
  CreateShareResponse,
  // ... más tipos
} from '@controlfile/sdk';
```

## Migración desde Código Duplicado

### Antes (código duplicado)

```typescript
// ❌ NO HACER: llamadas directas a la API
const token = await auth.currentUser.getIdToken();
const response = await fetch(`${BACKEND_URL}/api/files/list`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
});
const data = await response.json();
```

### Después (con SDK)

```typescript
// ✅ CORRECTO: usar SDK
const result = await client.files.list();
```

### Ejemplo de Migración Completa

**Antes:**
```typescript
async function createShare(fileId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${BACKEND_URL}/api/shares/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileId, expiresIn: 24 })
  });
  
  if (!response.ok) {
    throw new Error('Error al crear share');
  }
  
  return response.json();
}
```

**Después:**
```typescript
async function createShare(fileId: string) {
  return client.shares.create({ fileId, expiresIn: 24 });
}
```

## Modelo de Confianza

Es importante entender el modelo de confianza y responsabilidades del SDK:

- **Validación en el Backend**: El backend de ControlFile valida el token en cada solicitud, verificando su validez, expiración y firma.
- **Sin Validación de Identidad en el SDK**: El SDK no valida identidad, no verifica si el token pertenece a un usuario válido ni autentica usuarios.
- **Sin Conocimiento de Permisos**: El SDK no conoce ni valida permisos, roles, tenants o planes. Estas validaciones ocurren exclusivamente en el backend.
- **Cliente HTTP Tipado**: El SDK actúa como un cliente HTTP tipado que envía solicitudes autenticadas al backend. La autorización y el control de acceso son responsabilidad del backend.
- **Token Opaque**: El SDK trata el token como una cadena opaca que debe incluirse en cada solicitud. No inspecciona ni modifica el token.

## Notas Importantes

1. **Autenticación**: El SDK no maneja la autenticación directamente. Debes proporcionar una función `getAuthToken()` que retorne un token válido aceptado por ControlFile (por ejemplo, un Firebase ID Token, un JWT de tu backend, etc.).

2. **URLs Internas**: El SDK nunca expone URLs internas o endpoints. Todas las operaciones se realizan a través de métodos tipados.

3. **Permisos**: El SDK no valida permisos. La validación de permisos, ownership y cuotas se realiza en el backend.

4. **Reintentos**: El SDK implementa reintentos automáticos para errores de red y servidor (configurable con `options.retries`).

5. **Timeouts**: El SDK implementa timeouts automáticos (configurable con `options.timeout`, default: 30s).

## Compatibilidad

- **Navegadores**: Navegadores modernos con soporte para ES2020, `fetch`, `Promise`, `async/await`
- **Node.js**: Node.js 18+ (si se usa en entorno server-side)
- **TypeScript**: TypeScript 5.0+

## Soporte

Para reportar bugs o solicitar features, contacta al equipo de ControlFile.
