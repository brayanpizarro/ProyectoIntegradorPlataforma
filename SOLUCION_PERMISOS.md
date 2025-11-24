# 🔧 GUÍA DE SOLUCIÓN: Problema de Redirección Automática

## ❌ Problema
Cuando intentas acceder a:
- `/perfil` (Panel del usuario)
- `/admin/usuarios` (Gestión de usuarios)

Te redirige automáticamente al dashboard.

---

## ✅ SOLUCIÓN RÁPIDA - Sigue estos pasos:

### **Paso 1: Accede a la Página de Debug** 🔍

1. Inicia sesión normalmente en la aplicación
2. En tu navegador, ve a: **http://localhost:5173/debug-permissions**
3. Verás una página completa con toda la información de tu usuario y permisos

### **Paso 2: Identifica el Problema** 🎯

En la página de debug, busca la sección **"Datos del Usuario"**. Verás una tabla con:

```
user.role     → ¿Tiene valor? ¿Es "admin"?
```

**⚠️ Si está vacía o dice "NO DEFINIDO", ahí está el problema!**

### **Paso 3: Solución Temporal (Rápida)** ⚡

Si necesitas acceso AHORA mismo:

1. En la misma página de debug, baja a **"Herramientas de Corrección Temporal"**
2. Selecciona "Admin" en el menú desplegable
3. Haz clic en **"Aplicar Cambio"**
4. Recarga la página (F5)
5. Ahora deberías poder acceder a `/perfil` y `/admin/usuarios`

**⚠️ IMPORTANTE:** Este cambio es TEMPORAL y solo afecta tu navegador. Si cierras sesión o limpias el caché, tendrás que repetir esto.

### **Paso 4: Solución Permanente (Recomendada)** 💾

Para arreglar el problema de forma permanente:

#### **Opción A: Desde el Backend (Recomendado)**

Verifica que el endpoint de login devuelva el rol correctamente:

1. Ve a: `backend-proyecto-integrador/src/auth/auth.service.ts`
2. Busca el método `login` o `validateUser`
3. Asegúrate de que devuelve el usuario con el campo `rol` o `role`:

```typescript
// ✅ CORRECTO - El backend debe devolver esto:
return {
  accessToken: 'token...',
  refreshToken: 'token...',
  user: {
    id: '123',
    email: 'admin@ejemplo.com',
    nombres: 'Juan',
    apellidos: 'Pérez',
    rol: 'admin',        // ← Esta propiedad es crítica
    // ... otros campos
  }
};
```

#### **Opción B: Desde la Base de Datos**

Si tienes acceso directo a la base de datos:

```sql
-- PostgreSQL - Verifica el rol actual
SELECT id, email, nombres, apellidos, rol, activo 
FROM usuarios 
WHERE email = 'tuusuario@ejemplo.com';

-- Si el rol está vacío o incorrecto, actualízalo:
UPDATE usuarios 
SET rol = 'admin' 
WHERE email = 'tuusuario@ejemplo.com';
```

Luego, cierra sesión y vuelve a iniciar sesión para que se cargue el nuevo rol.

---

## 🛠️ Herramientas de Debug Adicionales

### **Opción 1: Página de Debug Visual** (Recomendado) 📊
```
http://localhost:5173/debug-permissions
```
- Interfaz visual completa
- Muestra todos tus datos y permisos
- Permite corregir el rol temporalmente
- Fácil de usar

### **Opción 2: Script en Consola del Navegador** 💻

1. Presiona **F12** o **Ctrl+Shift+I** para abrir DevTools
2. Ve a la pestaña **"Console"**
3. Copia y pega este código:

```javascript
// Ver información del usuario
let user = JSON.parse(localStorage.getItem('user'));
console.log('Usuario:', user);
console.log('Rol detectado:', user.role || 'NINGUNO');

// Si necesitas corregir el rol temporalmente:
user.role = 'admin';
localStorage.setItem('user', JSON.stringify(user));
console.log('✅ Rol actualizado a admin');
location.reload(); // Recargar página
```

### **Opción 3: Desde el Login** 🔐

Si el problema es que el backend no devuelve el rol correctamente:

1. Revisa los logs de la consola cuando haces login
2. Busca: `✅ Login exitoso con backend real`
3. Debería mostrar el objeto usuario con el rol

---

## 📋 Checklist de Verificación

Marca lo que hayas verificado:

- [ ] El token existe en localStorage (accesstoken)
- [ ] El usuario existe en localStorage (user)
- [ ] El usuario tiene una propiedad `role`, `rol` o `tipo`
- [ ] El valor de esa propiedad es `'admin'` (para acceso a gestión de usuarios)
- [ ] El backend devuelve el rol en la respuesta del login
- [ ] La base de datos tiene el campo `rol` con el valor correcto

---

## 🔍 Logs Mejorados

Ahora cuando intentes acceder a las rutas problemáticas, verás en la consola:

```
🔍 isAdmin - Role: admin | tutor | invitado | undefined
```

Si ves `undefined` cuando debería aparecer tu rol, ya sabes que el problema está en el usuario guardado.

---

## ❓ Preguntas Frecuentes

### **P: ¿Por qué me redirige al dashboard?**
**R:** El sistema detecta que NO eres admin (o no encuentra tu rol) y te bloquea el acceso por seguridad.

### **P: ¿La solución temporal es segura?**
**R:** Sí, solo afecta tu navegador local. No cambia nada en el backend ni en la base de datos.

### **P: ¿Cuánto dura la solución temporal?**
**R:** Hasta que cierres sesión o limpies el localStorage.

### **P: ¿Necesito permisos de admin para todo?**
**R:** No. Solo para:
- Gestión de Usuarios (`/admin/usuarios`)
- Eliminar estudiantes
- Exportar datos

Los tutores e invitados pueden acceder a su perfil (`/perfil`) sin problemas.

---

## 📞 Siguiente Paso

1. **Primero:** Prueba la página de debug: http://localhost:5173/debug-permissions
2. **Segundo:** Usa la solución temporal si necesitas acceso urgente
3. **Tercero:** Implementa la solución permanente en el backend/BD
4. **Cuarto:** Comparte los logs de la consola si el problema persiste

---

## 📝 Archivos Modificados

Los siguientes archivos fueron actualizados para agregar logging y herramientas de debug:

1. ✅ `PermissionService.ts` - Más logging en verificaciones de permisos
2. ✅ `UserManagement.tsx` - Logging detallado y tiempo de espera aumentado
3. ✅ `UserProfile.tsx` - Logging detallado
4. ✅ `App.tsx` - Nueva ruta `/debug-permissions`
5. ✅ `DebugPermissions.tsx` - Nueva página de debug (creada)
6. ✅ `DEBUG_PERMISSIONS.md` - Esta guía
7. ✅ `debug-permissions.js` - Script para consola

**¡Todo listo para diagnosticar! 🚀**
