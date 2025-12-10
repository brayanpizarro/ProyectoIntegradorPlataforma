# 📋 Guía de Mocks en el Frontend

## ¿Qué son estos mocks?

Este proyecto está configurado con **datos MOCK temporales** para permitir desarrollo sin necesidad de base de datos. Cuando el backend esté completamente implementado, estos mocks deben ser eliminados.

## 🎯 Ubicación de los Mocks

### 1. **apiService.ts** - Mocks de datos
📁 `src/services/apiService.ts`

**Mocks activos:**
- `getMockEstudiantes()` - Lista de estudiantes (línea ~265)
- `getMockEstudianteById()` - Estudiante individual (línea ~384)
- `getMockInstituciones()` - Instituciones educativas (línea ~445)
- `getMockEntrevistas()` - Entrevistas por estudiante (línea ~468)
- `getMockEstadisticas()` - Estadísticas para dashboard (línea ~488)

**Cómo funciona:**
```typescript
async getEstudiantes(): Promise<Estudiante[]> {
  try {
    // Intenta conectar al backend
    return await this.request<Estudiante[]>('/estudiantes');
  } catch (error) {
    // Si falla, usa datos mock
    console.warn('🔄 Backend no disponible, usando datos mock');
    return this.getMockEstudiantes();
  }
}
```

### 2. **authService.ts** - Mocks de autenticación
📁 `src/services/authService.ts`

**Mock activo:**
- `mockLogin()` - Autentica sin validar BD (línea ~290)

**Usuarios disponibles en MOCK:**
```typescript
'admin@test.com'       // → rol: admin
'academico@test.com'   // → rol: academico
'estudiante@test.com'  // → rol: estudiante
(cualquier otro email) // → rol: invitado
```

**Cómo funciona:**
```typescript
async login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    // Intenta login en el backend real
    return await fetch(`${API_BASE_URL}/auth/login`, ...);
  } catch (error) {
    // Si falla, usa login mock
    console.warn('⚠️ Backend no disponible, usando autenticación mock');
    return await this.mockLogin(credentials);
  }
}
```

---

## 🚀 Cómo Remover los Mocks (Cuando Backend esté Listo)

### Paso 1: apiService.ts
1. Busca los comentarios:
   ```
   // ▼▼▼ SECCIÓN DE MOCKS PARA DESARROLLO - ELIMINAR...
   // ▲▲▲ FIN SECCIÓN DE MOCKS - ELIMINAR...
   ```

2. Elimina TODO lo que hay entre esos comentarios (líneas ~254 a ~545)

3. En los métodos principales (getEstudiantes, getEstudianteById, etc.), reemplaza:
   ```typescript
   // ❌ QUITAR ESTO:
   try {
     return await this.request<T>(endpoint);
   } catch (error) {
     console.warn('🔄 Backend no disponible, usando mock...');
     return this.getMockXxx();
   }
   
   // ✅ DEJAR SOLO ESTO:
   return await this.request<T>(endpoint);
   ```

4. Ejemplo completo después de limpieza:
   ```typescript
   async getEstudiantes(): Promise<Estudiante[]> {
     return await this.request<Estudiante[]>('/estudiantes');
   }

   async getEstudianteById(id: string): Promise<Estudiante> {
     return await this.request<Estudiante>(`/estudiante/${id}`);
   }
   ```

### Paso 2: authService.ts
1. Busca los comentarios:
   ```
   // ▼▼▼ SECCIÓN DE MOCKS PARA DESARROLLO - ELIMINAR...
   // ▲▲▲ FIN SECCIÓN DE MOCKS - ELIMINAR...
   ```

2. Elimina TODO lo que hay entre esos comentarios (~290 a ~347 aprox.)

3. En el método `login()`, reemplaza:
   ```typescript
   // ❌ QUITAR ESTO:
   catch (error) {
     console.warn('⚠️ Backend no disponible, usando autenticación mock');
     const authResponse = await this.mockLogin(credentials);
     this.saveAuthData(authResponse);
     return authResponse;
   }
   
   // ✅ DEJAR SOLO ESTO:
   catch (error) {
     console.error('❌ Error al conectar con el backend:', error);
     throw new Error('Backend no disponible. Asegúrate que el servidor esté en http://localhost:3000');
   }
   ```

4. Ejemplo después de limpieza:
   ```typescript
   async login(credentials: LoginCredentials): Promise<AuthResponse> {
     console.log('🔐 Intentando login con:', credentials.email);

     const response = await fetch(`${API_BASE_URL}/auth/login`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(credentials),
     });

     if (response.ok) {
       const authResponse: AuthResponse = await response.json();
       this.saveAuthData(authResponse);
       return authResponse;
     } else if (response.status === 401) {
       throw new Error('Credenciales inválidas');
     } else {
       throw new Error(`Error del servidor: ${response.status}`);
     }
   }
   ```

---

## 📊 Datos en los Mocks

### Estudiantes (Mock)
```typescript
{
  id_estudiante: '1',
  nombre: 'Juan Pérez González',
  rut: '12.345.678-9',
  email: 'juan.perez@test.com',
  tipo_de_estudiante: 'universitario',
  estado: 'Activo',
  año_generacion: 2024,
  carrera: 'Ingeniería Civil',
  universidad: 'Universidad de Chile',
  promedio: 78.5,
  // ... más campos
}
```

### Instituciones (Mock)
```typescript
{
  id_institucion: '1',
  nombre: 'Universidad de Chile',
  tipo_institucion: 'Universidad',
  carrera_especialidad: 'Ingeniería Civil',
  anio_de_ingreso: '2024',
  anio_de_egreso: '2028'
}
```

---

## ⚙️ Configuración

### API Backend URL
📁 `src/services/apiService.ts` (línea 14)
```typescript
const API_BASE_URL = 'http://localhost:3000';
```

Si cambias el puerto del backend, actualiza esta variable.

### Tokens Mock
Los tokens mock generados son:
```typescript
accessToken: 'mock-jwt-token-' + Date.now()
refreshToken: 'mock-jwt-refresh-token-' + Date.now()
```

⚠️ **IMPORTANTE:** Estos tokens NO son válidos para el backend real. Solo funcionan en modo desarrollo.

---

## 🔄 Flujo de Datos

```
┌─────────────────┐
│  Componente     │
│  (Dashboard.tsx)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  apiService     │
│  .getEstudiantes│
└────────┬────────┘
         │
    ┌────▼────┐
    │ Intenta │
    │ Backend │
    └────┬────┘
         │
    ┌────▼──────────┐
    │ ¿Conexión OK? │
    └──┬──────┬─────┘
       │      │
      SÍ     NO
       │      │
       ▼      ▼
      ✅    🔄 MOCK
      │      │
      └──┬───┘
         ▼
    Retorna datos
```

---

## 🧪 Testing con Mocks

Para forzar que siempre use mocks (sin intentar conectar al backend):

1. Modifica en `apiService.ts`:
   ```typescript
   private async request<T>(...): Promise<T> {
     // Comentar el try-catch y directo lanzar error
     throw new Error('Modo offline - forzar uso de mocks');
   }
   ```

2. Modifica en `authService.ts`:
   ```typescript
   async login(credentials: LoginCredentials): Promise<AuthResponse> {
     // Comentar el try-catch y directo usar mock
     return await this.mockLogin(credentials);
   }
   ```

---

## ✅ Checklist para Remover Mocks

- [ ] Eliminar `getMockEstudiantes()` de apiService.ts
- [ ] Eliminar `getMockEstudianteById()` de apiService.ts
- [ ] Eliminar `getMockInstituciones()` de apiService.ts
- [ ] Eliminar `getMockEntrevistas()` de apiService.ts
- [ ] Eliminar `getMockEstadisticas()` de apiService.ts
- [ ] Eliminar `mockLogin()` de authService.ts
- [ ] Actualizar métodos en apiService.ts (quitar try-catch de mocks)
- [ ] Actualizar método login() en authService.ts (quitar try-catch de mocks)
- [ ] Probar que el backend está respondiendo correctamente
- [ ] Verificar en consola que NO aparezcan mensajes "Backend no disponible" o "[MOCK]"

---

## 📝 Notas Importantes

- ⚠️ Los mocks están **solo para desarrollo**
- ⚠️ NO usar en **producción**
- ⚠️ Los datos de mock **NO persisten** - se regeneran en cada recarga
- ⚠️ Las contraseñas en el mock **NO son validadas** - cualquier contraseña funciona
- ✅ El login mock genera tokens válidos para localStorage (pero no para el backend real)

---

## 🆘 Solución de Problemas

### "Backend no disponible"
- ✅ Verifica que el backend esté corriendo en `http://localhost:3000`
- ✅ Revisa la consola para ver el error exacto
- ✅ Por ahora, el mock se activa automáticamente

### Login no funciona
- ✅ Usa uno de los emails de prueba: `admin@test.com`, `academico@test.com`, `estudiante@test.com`
- ✅ Cualquier contraseña funciona en modo mock

### Datos no aparecen
- ✅ Abre las DevTools (F12) y revisa la consola
- ✅ Verifica que aparezcan mensajes como "🔄 Backend no disponible, usando datos mock"
- ✅ Los datos mock ya tienen algunos estudiantes de ejemplo

---

**Última actualización:** Diciembre 2025
**Rama:** front-inicial
**Estado:** Mocks activos - Backend integración pendiente
