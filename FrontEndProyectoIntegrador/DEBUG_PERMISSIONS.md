# 🔍 DEBUG: Problema de Redirección Automática

## Problema Identificado
Cuando intentas acceder a:
- `/perfil` (Panel de usuario)
- `/admin/usuarios` (Gestión de usuarios)

Te redirige automáticamente al dashboard.

## Causas Posibles

### 1. **Verificación de Permisos Incorrecta**
El `PermissionService` busca el rol del usuario en varias propiedades:
- `user.role`
- `user.tipo`
- `user.rol`

Si el backend devuelve el rol con un nombre diferente, no lo detecta como admin.

### 2. **Token o Usuario Corrupto en localStorage**
Si el objeto de usuario guardado no tiene la estructura correcta, las verificaciones fallan.

## Solución Implementada

### Cambios Realizados:

#### 1. **PermissionService** (más logging)
```typescript
// Ahora imprime en consola:
// - Usuario completo
// - Role detectado
// - Si es admin o no
```

#### 2. **UserManagement.tsx**
```typescript
// - Aumentado el tiempo de espera antes de redirigir (3 segundos)
// - Más logging para debug
// - Función loadData ahora es async
```

#### 3. **UserProfile.tsx**
```typescript
// - Agregado logging detallado
// - Muestra qué datos carga de la API o localStorage
```

## 🛠️ Cómo Diagnosticar

### Paso 1: Abre la Consola del Navegador
Presiona `F12` o `Ctrl+Shift+I` en Chrome/Edge

### Paso 2: Intenta Acceder a las Rutas Problemáticas

Accede a: `http://localhost:5173/perfil`

**Busca en la consola:**
```
🔍 isAdmin - Usuario completo: {...}
🔍 isAdmin - Role detectado: admin | tutor | invitado | undefined
🔍 isAdmin - ¿Es admin?: true | false
```

### Paso 3: Revisa el localStorage

En la consola del navegador, ejecuta:
```javascript
// Ver usuario guardado
console.log(JSON.parse(localStorage.getItem('user')))

// Ver token
console.log(localStorage.getItem('accesstoken'))

// Ver todas las claves guardadas
console.log(Object.keys(localStorage))
```

## 🔧 Soluciones Rápidas

### Opción A: Si el rol está mal guardado

Si ves que el usuario en localStorage tiene `rol` en lugar de `role`, ejecuta en la consola:

```javascript
let user = JSON.parse(localStorage.getItem('user'));
user.role = user.rol; // Copiar rol a role
localStorage.setItem('user', JSON.stringify(user));
location.reload(); // Recargar página
```

### Opción B: Limpiar y volver a hacer login

```javascript
localStorage.clear();
location.href = '/';
```

### Opción C: Si eres admin pero no te deja entrar

Verifica en el backend que el usuario tenga `rol: 'admin'`:

```sql
-- En la base de datos
SELECT id, email, rol, activo FROM usuarios WHERE email = 'tuusuario@ejemplo.com';
```

## 📊 Estructura Esperada del Usuario

El objeto usuario en localStorage debe verse así:

```json
{
  "id": "uuid-del-usuario",
  "email": "admin@ejemplo.com",
  "nombres": "Juan",
  "apellidos": "Pérez",
  "role": "admin",  // ← Esta es la propiedad principal
  "rol": "admin",   // ← Compatibilidad con backend
  "activo": true,
  "fecha_creacion": "2024-11-24T..."
}
```

## 🚀 Próximos Pasos

1. **Revisa la consola** cuando intentes acceder a las rutas
2. **Copia aquí la salida** de los logs que aparecen
3. Si el problema persiste, **revisa el backend** para confirmar que el endpoint `/auth/login` devuelve el rol correctamente

## 💡 Mejora Futura Recomendada

Estandarizar el nombre de la propiedad del rol en todo el sistema:
- Backend siempre devuelve `role`
- Frontend siempre usa `role`
- Eliminar compatibilidad con `rol` y `tipo`
