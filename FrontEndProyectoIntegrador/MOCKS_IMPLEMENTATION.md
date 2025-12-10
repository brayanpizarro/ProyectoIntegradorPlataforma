# 🎯 Sistema de Mocks en front-inicial

## Estado Actual

✅ **Rama:** `front-inicial`  
✅ **Mocks:** Completamente configurados y separados  
✅ **Documentación:** MOCKS_README.md (instrucciones de eliminación)  
✅ **Backend:** Fallback automático si no está disponible  

---

## 🚀 Uso Actual

El frontend ahora funciona **SIN necesidad de base de datos**. 

### Arquitectura de Fallback

```
Intento de conexión al backend (localhost:3000)
          ↓
      ¿Responde?
       ↙    ↘
      SÍ    NO
      ↓     ↓
    Real   Mock
```

### Cómo Funciona

**1. Autenticación (authService.ts)**
```typescript
// El usuario intenta hacer login
// → Backend no responde
// → Automáticamente usa mockLogin()
// → Usuario entra con tokens fake

// Usuarios disponibles:
// - admin@test.com       (rol: admin)
// - academico@test.com   (rol: academico)
// - estudiante@test.com  (rol: estudiante)
// - (cualquier otro)     (rol: invitado)
```

**2. Datos (apiService.ts)**
```typescript
// Dashboard intenta cargar estudiantes
// → Backend no responde
// → Automáticamente usa getMockEstudiantes()
// → Muestra datos de prueba

// Datos disponibles:
// - 3+ estudiantes de ejemplo
// - 3 instituciones
// - Estadísticas calculadas
```

---

## 📁 Archivos Modificados

### 1. **src/services/apiService.ts**
- ✅ Agregados comentarios claros para secciones de mock
- ✅ Fallback automático cuando backend falla
- ✅ Métodos mock separados (fáciles de eliminar)
- ✅ TODOs indicando qué eliminar cuando backend esté listo

### 2. **src/services/authService.ts**
- ✅ Agregados comentarios claros para sección de mock
- ✅ Fallback automático a mockLogin() si backend falla
- ✅ Mock con usuarios de prueba predefinidos
- ✅ Tokens fake generados dinámicamente

### 3. **MOCKS_README.md** (NUEVO)
- ✅ Guía completa de mocks
- ✅ Instrucciones paso a paso para eliminarlos
- ✅ Documentación de estructura de datos
- ✅ Checklist de limpieza

---

## 🎮 Testing Manual

### Probar Login Mock
```
1. Abre http://localhost:5173/
2. Ingresa: admin@test.com / (cualquier contraseña)
3. Verifica en consola: "✅ [MOCK] Login exitoso"
4. Dashboard se carga con datos mock
```

### Probar Datos Mock
```
1. Después de loggearse, ve al Dashboard
2. Verifica en consola: "🔄 Backend no disponible, usando datos mock"
3. Estudiantes y estadísticas se cargan desde getMockEstudiantes()
```

### Forzar Backend (cuando lo tengas)
```
1. Asegúrate que backend esté corriendo en http://localhost:3000
2. Recarga la página
3. Verifica en consola: "✅ API Success" (en lugar de "[MOCK]")
```

---

## 📋 Checklist de Implementación

- [x] Agregados comentarios de sección de mocks
- [x] Implementado fallback automático en apiService.ts
- [x] Implementado fallback automático en authService.ts
- [x] Creados métodos mock claramente separados
- [x] Agregada documentación MOCKS_README.md
- [x] Verificados sin errores TypeScript
- [x] Servidor frontend corriendo correctamente

---

## 🔄 Pasos Cuando Tengas Backend

### Fase 1: Verificar Backend
```bash
cd backend-proyecto-integrador
npm install
npm run start:dev
# Debe estar en http://localhost:3000
```

### Fase 2: Remover Mocks
Seguir instrucciones en **MOCKS_README.md**
- Eliminar secciones entre comentarios "▼▼▼ MOCK" y "▲▲▲ MOCK"
- Simplificar try-catch en métodos principales
- Retirar métodos mockLogin(), getMockEstudiantes(), etc.

### Fase 3: Probar Integración
```bash
# Terminal 1: Backend
npm run start:dev

# Terminal 2: Frontend  
npm run dev

# Verificar en consola que aparezcan:
# ✅ API Success (sin [MOCK])
# No deben aparecer mensajes de "Backend no disponible"
```

---

## 📊 Estructura de Mocks

### apiService.ts (líneas ~254-545)
```
getMockEstudiantes()        → 3+ estudiantes de ejemplo
getMockEstudianteById()     → Estudiante individual
getMockInstituciones()      → 3 instituciones
getMockEntrevistas()        → Entrevistas de ejemplo
getMockEstadisticas()       → Estadísticas del dashboard
```

### authService.ts (líneas ~290-347)
```
mockLogin()                 → Genera tokens fake + usuario
```

---

## ⚙️ Configuración

### URL Backend
📁 Actualizar si cambias puerto:
- **apiService.ts** línea 14: `const API_BASE_URL = 'http://localhost:3000'`
- **authService.ts** línea 19: `const API_BASE_URL = 'http://localhost:3000'`

### Datos Mock
Para modificar estudiantes de prueba:
- Edita `getMockEstudiantes()` en apiService.ts
- Agrega/quita elementos del array de retorno

---

## 🆘 Debugging

### Ver qué está sucediendo
```javascript
// Abre DevTools (F12) → Console
// Busca mensajes como:
// ✅ API Success          → Backend real funcionando
// 🔄 Backend no disponible → Usando mock
// ⚠️ Backend no disponible → Usando autenticación mock
```

### Forzar offline (solo para testing)
```typescript
// En apiService.ts, modifica request():
private async request<T>(...): Promise<T> {
  // Comentar try-catch y lanzar error directo
  throw new Error('Modo offline activado');
}
```

---

## ✨ Beneficios de Esta Configuración

✅ **Frontend funciona sin BD** - Desarrollo paralelo al backend  
✅ **Mocks claramente separados** - Fácil de remover después  
✅ **Fallback automático** - Transición transparente a backend real  
✅ **Documentación completa** - Instrucciones de limpieza incluidas  
✅ **Sin cambios de código necesarios** - Mismo código para mock y backend  
✅ **Testing facilitado** - Datos predefinidos siempre disponibles  

---

## 📝 Próximos Pasos

1. **Implementar Backend** - Crear endpoints en NestJS
2. **Probar Integración** - Verificar comunicación frontend-backend
3. **Remover Mocks** - Seguir checklist en MOCKS_README.md
4. **Deployment** - Desplegar sin código mock innecesario

---

**Rama:** front-inicial  
**Última actualización:** Diciembre 2025  
**Estado:** ✅ Listo para desarrollo sin BD
