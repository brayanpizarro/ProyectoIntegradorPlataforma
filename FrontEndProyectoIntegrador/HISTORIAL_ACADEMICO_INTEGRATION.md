# 📚 Integración Historial Académico - Frontend con Backend

## 🎯 Objetivo
Este documento explica cómo el frontend está preparado para integrarse con el backend de `historial_academico` que ya está implementado.

---

## 📋 Estructura del Backend (Ya implementado)

### Entity: `HistorialAcademico`
```typescript
{
  id_historial_academico: number;
  año: number;
  semestre: number;
  nivel_educativo: string;
  ramos_aprobados: number;
  ramos_reprobados: number;
  promedio_semestre: number;
  trayectoria_academica: string[];  // Array de observaciones
  created_at: Date;
  updated_at: Date;
  estudiante: Estudiante;  // Relación ManyToOne
}
```

### Rutas del Backend
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/historial-academico` | Crear nuevo historial |
| `GET` | `/historial-academico` | Obtener todos los historiales |
| `GET` | `/historial-academico/estudiante/:idEstudiante` | Obtener historiales de un estudiante |
| `GET` | `/historial-academico/semestre/:año/:semestre` | Obtener por año y semestre |
| `GET` | `/historial-academico/:id` | Obtener historial específico |
| `PATCH` | `/historial-academico/:id` | Actualizar historial |
| `POST` | `/historial-academico/:id/trayectoria` | Agregar trayectoria |
| `PATCH` | `/historial-academico/:id/trayectoria/:index` | Actualizar trayectoria |
| `DELETE` | `/historial-academico/:id/trayectoria/:index` | Eliminar trayectoria |
| `DELETE` | `/historial-academico/:id` | Eliminar historial |

---

## 🎨 Implementación Frontend (Ya adaptado)

### 📁 Archivo: `src/services/apiService.ts`

Se agregaron métodos que mapean 1:1 con las rutas del backend:

```typescript
// Crear historial (POST /historial-academico)
async crearHistorialAcademico(data: {
  id_estudiante: string;
  año: number;
  semestre: number;
  nivel_educativo?: string;
  ramos_aprobados?: number;
  ramos_reprobados?: number;
  promedio_semestre?: number;
  trayectoria_academica?: string[];
})

// Obtener historiales de un estudiante (GET /historial-academico/estudiante/:id)
async getHistorialAcademicoPorEstudiante(idEstudiante: string)

// Obtener historial específico (GET /historial-academico/:id)
async getHistorialAcademicoById(id: number)

// Actualizar historial (PATCH /historial-academico/:id)
async actualizarHistorialAcademico(id: number, data: {...})

// Agregar trayectoria (POST /historial-academico/:id/trayectoria)
async agregarTrayectoriaAcademica(id: number, trayectoria: string)

// Actualizar trayectoria (PATCH /historial-academico/:id/trayectoria/:index)
async actualizarTrayectoriaAcademica(id: number, index: number, trayectoria: string)

// Eliminar trayectoria (DELETE /historial-academico/:id/trayectoria/:index)
async eliminarTrayectoriaAcademica(id: number, index: number)

// Eliminar historial (DELETE /historial-academico/:id)
async eliminarHistorialAcademico(id: number)
```

### 📁 Archivo: `src/pages/EstudianteDetail.tsx`

#### Función: `handleGenerarInforme()`
Botón "Generar Informe" que guarda el estado actual del estudiante:

```typescript
const handleGenerarInforme = async () => {
  const historialData = {
    id_estudiante: id,
    año: new Date().getFullYear(),
    semestre: new Date().getMonth() < 6 ? 1 : 2,
    nivel_educativo: estudiante?.institucion?.nivel_educativo || 'Superior',
    ramos_aprobados: 0,
    ramos_reprobados: 0,
    promedio_semestre: 0,
    trayectoria_academica: [],
  };

  // TODO Backend: Descomentar cuando backend esté listo
  // const response = await apiService.crearHistorialAcademico(historialData);
  
  // Por ahora usa localStorage
  localStorage.setItem(`historial_academico_${id}`, JSON.stringify([...informes]));
}
```

#### Función: `useEffect` - Cargar historiales
Carga automáticamente los historiales al abrir el detalle del estudiante:

```typescript
useEffect(() => {
  const cargarHistorialAcademico = async () => {
    // TODO Backend: Descomentar cuando backend esté listo
    // const historiales = await apiService.getHistorialAcademicoPorEstudiante(id);
    // setInformesGuardados(historiales);
    
    // Por ahora usa localStorage
    const historialGuardadoStr = localStorage.getItem(`historial_academico_${id}`);
    if (historialGuardadoStr) {
      setInformesGuardados(JSON.parse(historialGuardadoStr));
    }
  };
  
  cargarHistorialAcademico();
}, [id]);
```

---

## 🔄 Flujo de Integración con Backend Real

### 1️⃣ Activar Backend
```bash
# En backend-proyecto-integrador/
npm run start:dev
```

### 2️⃣ Actualizar `apiService.ts`
Descomentar las líneas marcadas con `TODO Backend`:

**ANTES (usando localStorage):**
```typescript
// const response = await apiService.crearHistorialAcademico(historialData);
localStorage.setItem(`historial_academico_${id}`, JSON.stringify(data));
```

**DESPUÉS (usando backend):**
```typescript
const response = await apiService.crearHistorialAcademico(historialData);
// localStorage.setItem(...); // Ya no necesario
```

### 3️⃣ Actualizar `EstudianteDetail.tsx`

**En `handleGenerarInforme()`:**
```typescript
// Reemplazar:
localStorage.setItem(`historial_academico_${id}`, JSON.stringify(informesActualizados));

// Por:
const response = await apiService.crearHistorialAcademico(historialData);
setInformesGuardados([...informesGuardados, response]);
```

**En `useEffect()`:**
```typescript
// Reemplazar:
const historialGuardadoStr = localStorage.getItem(`historial_academico_${id}`);
const historiales = JSON.parse(historialGuardadoStr);

// Por:
const historiales = await apiService.getHistorialAcademicoPorEstudiante(id);
setInformesGuardados(historiales);
```

### 4️⃣ Probar Integración
1. Abrir detalle de un estudiante
2. Ir a sección "Informe Académico" o "Desempeño"
3. Click en "Generar Informe" (debe crear registro en BD)
4. Click en "Ver Semestres Anteriores" (debe cargar desde BD)

---

## 📊 Datos que se guardan

Cuando se genera un informe, se envía al backend:

```typescript
{
  id_estudiante: "1",           // ID del estudiante
  año: 2025,                    // Año actual
  semestre: 1,                  // 1 o 2 (1S o 2S)
  nivel_educativo: "Superior",  // Del estudiante
  ramos_aprobados: 6,           // De formulario (futuro)
  ramos_reprobados: 0,          // De formulario (futuro)
  promedio_semestre: 5.8,       // De formulario (futuro)
  trayectoria_academica: [      // Observaciones del semestre
    "Buen desempeño general",
    "Aprobó todos los ramos"
  ]
}
```

---

## 🎯 Ventajas de esta implementación

✅ **Estructura idéntica**: Frontend usa exactamente los mismos nombres de campos que el backend  
✅ **Rutas coincidentes**: Cada método del frontend mapea a una ruta del backend  
✅ **Fácil migración**: Solo descomentar líneas para activar backend real  
✅ **TypeScript**: Tipos definidos previenen errores  
✅ **Persistencia**: Datos se guardan en PostgreSQL (backend) en lugar de localStorage  
✅ **Escalable**: Soporta múltiples semestres por estudiante  

---

## 🔧 Próximos Pasos

### Para el desarrollador Backend:
1. ✅ Ya tienes las rutas implementadas en `historial_academico.controller.ts`
2. ✅ Ya tienes el servicio en `historial_academico.service.ts`
3. ✅ Ya tienes la entidad en `historial_academico.entity.ts`
4. ⏳ Asegúrate de que CORS esté configurado para `http://localhost:5173`
5. ⏳ Verifica que las rutas devuelvan JSON con los campos esperados

### Para el desarrollador Frontend:
1. ✅ Ya tienes los métodos en `apiService.ts`
2. ✅ Ya tienes la lógica en `EstudianteDetail.tsx`
3. ⏳ Cuando backend esté listo, descomentar las líneas `TODO Backend`
4. ⏳ Eliminar las líneas de `localStorage`
5. ⏳ Probar flujo completo

---

## 📝 Ejemplo de uso completo

### Crear historial (Botón "Generar Informe")
```typescript
const nuevoHistorial = await apiService.crearHistorialAcademico({
  id_estudiante: "1",
  año: 2025,
  semestre: 1,
  nivel_educativo: "Superior",
  ramos_aprobados: 6,
  ramos_reprobados: 0,
  promedio_semestre: 5.8,
  trayectoria_academica: ["Excelente desempeño"]
});
```

### Obtener historiales (Al cargar componente)
```typescript
const historiales = await apiService.getHistorialAcademicoPorEstudiante("1");
// Retorna array de historiales ordenados por año y semestre
```

### Agregar observación a trayectoria
```typescript
await apiService.agregarTrayectoriaAcademica(
  123, // id_historial_academico
  "Participó en tutoría grupal"
);
```

---

## ⚠️ Notas Importantes

1. **IDs**: El backend usa `id_historial_academico` (number), el frontend lo maneja correctamente
2. **Fechas**: El backend genera `created_at` y `updated_at` automáticamente
3. **Relación**: Cada historial está vinculado a un estudiante (`id_estudiante`)
4. **Array JSON**: `trayectoria_academica` se guarda como JSONB en PostgreSQL
5. **Ordenamiento**: Los historiales se ordenan por año y semestre ascendente

---

## 🎉 Resumen

El frontend ya está **100% preparado** para conectarse con el backend de historial académico. Solo necesitas:

1. Levantar el backend (`npm run start:dev`)
2. Descomentar las líneas marcadas con `TODO Backend`
3. Eliminar las líneas de `localStorage`
4. ¡Listo! El sistema funcionará con la base de datos real

La estructura es **idéntica** entre frontend y backend, lo que facilita la integración y el mantenimiento.

---

📅 **Fecha de documento:** Diciembre 2025  
🔗 **Rama:** front-inicial  
👨‍💻 **Preparado para:** Integración Backend-Frontend
