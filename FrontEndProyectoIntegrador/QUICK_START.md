# 🚀 INICIO RÁPIDO - Mocks en front-inicial

## ⚡ 30 segundos para entender

**Problema:** No tienes base de datos, pero quieres desarrollar el frontend.

**Solución:** Mocks automáticos que se activan cuando el backend no está disponible.

---

## 🎮 ¿Qué Hacer Ahora?

### 1. **Intenta hacer login**
```
Email:    admin@test.com
Password: (cualquier cosa)
```

### 2. **Abre la consola** (F12)
```
Verás mensajes como:
✅ [MOCK] Login exitoso
🔄 Backend no disponible, usando datos mock
```

### 3. **Dashboard carga con datos de prueba**
✅ Estudiantes, instituciones, estadísticas

---

## 📁 ¿Qué se cambió?

| Archivo | Cambio |
|---------|--------|
| `src/services/apiService.ts` | Agregados mocks de datos |
| `src/services/authService.ts` | Agregado mock de login |
| `MOCKS_README.md` | Instrucciones de limpieza |
| `MOCKS_IMPLEMENTATION.md` | Guía técnica |
| `MOCKS_SUMMARY.md` | Resumen de cambios |

---

## 🗂️ Ubicación de Mocks

### Datos (apiService.ts)
```
Línea ~254-545:
- getMockEstudiantes()
- getMockEstudianteById()
- getMockInstituciones()
- getMockEntrevistas()
- getMockEstadisticas()
```

### Login (authService.ts)
```
Línea ~290-347:
- mockLogin()
```

---

## ✅ Testing Rápido

```bash
# Terminal 1: Server ya corre (npm run dev)

# Terminal 2: Visita
http://localhost:5173/

# Intenta login
admin@test.com / password123

# Verifica consola (F12)
# Busca: "✅ [MOCK]" o "🔄 Backend no disponible"
```

---

## 🔄 Cuando Tengas Backend

1. **Leer:** `MOCKS_README.md`
2. **Seguir:** Instrucciones de eliminación paso a paso
3. **Eliminar:** Las secciones marcadas
4. **Probar:** Que backend real responde

---

## 📝 Usuarios Mock Disponibles

```
admin@test.com       → rol: admin
academico@test.com   → rol: academico
estudiante@test.com  → rol: estudiante
(cualquier otro)     → rol: invitado
```

**Contraseña:** Cualquier cosa (no se valida en mock)

---

## ⚙️ Datos Mock Incluidos

✅ 3+ estudiantes de ejemplo  
✅ 3 instituciones educativas  
✅ Estadísticas del dashboard  
✅ Entrevistas de ejemplo  

---

## 🆘 Algo no funciona?

### Login no deja entrar
```
✓ Usa uno de los emails de ejemplo
✓ La contraseña puede ser cualquier cosa
```

### No ves datos
```
✓ Abre DevTools (F12)
✓ Consola debe mostrar "[MOCK]"
✓ Si dice error, verifica URL http://localhost:5173/
```

### Errores en consola
```
✓ Si dice "Backend no disponible" es NORMAL
✓ Los mocks se activarán automáticamente
```

---

## 📚 Más Información

- **Instrucciones de limpieza:** Leer `MOCKS_README.md`
- **Guía técnica:** Leer `MOCKS_IMPLEMENTATION.md`
- **Resumen completo:** Leer `MOCKS_SUMMARY.md`

---

## ✨ Resumen

| Aspecto | Estado |
|---------|--------|
| Frontend funciona | ✅ Sí |
| Sin BD necesaria | ✅ Sí |
| Datos de prueba | ✅ Incluidos |
| Login funciona | ✅ Sí |
| Documentación | ✅ Completa |
| Errores | ✅ Ninguno |

---

**Estás listo para desarrollar. ¡Que disfrutes! 🎉**

---

**Rama:** front-inicial  
**Estado:** ✅ Listo  
**Fecha:** Diciembre 2025
