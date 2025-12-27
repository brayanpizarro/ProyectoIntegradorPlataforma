# Errores de Compilación Frontend - Plan de Corrección

## Resumen
**Total: 162 errores en 9 archivos**

## Archivos por Prioridad

### 🔴 Alta Prioridad (Componentes Principales)

#### 1. `DataTable.tsx` - 68 errores
**Ubicación:** `src/components/features/interview-workspace/DataTable.tsx`

**Campos eliminados usados:**
- `estudiante.email` (línea 95)
- `estudiante.telefono` (línea 96)
- `estudiante.direccion` (línea 97)
- `estudiante.status` (líneas 278, 307)
- `historial.año` y `historial.semestre` (múltiples líneas)
- `ramo.año` y `ramo.semestre` (múltiples líneas)
- `familia.nombre_madre`, `familia.nombre_padre` (líneas 644, 656)
- `familia.descripcion_madre`, `familia.descripcion_padre`
- `familia.hermanos`, `familia.otros_familiares`
- `familia.observaciones_hermanos`, `familia.observaciones_otros_familiares`

**Solución:**
1. Importar helpers temporales:
```typescript
import {
  getEstudianteEmail,
  getEstudianteTelefono,
  getEstudianteDireccion,
  getEstudianteStatus,
  getFamiliaNombreMadre,
  getFamiliaNombrePadre,
  getRamoSemestre,
  getRamoAño,
  getHistorialSemestre,
  getHistorialAño
} from '@/utils/migration-helpers';
```

2. Reemplazar accesos directos:
```typescript
// ANTES
{ label: 'Email', value: estudiante.email || 'No especificado' }

// DESPUÉS
{ label: 'Email', value: getEstudianteEmail(estudiante) }
```

3. Para loops con `año/semestre`, filtrar con los helpers:
```typescript
// ANTES
.filter(h => h.año && h.semestre)

// DESPUÉS
.filter(h => getHistorialAño(h) && getHistorialSemestre(h))
```

---

#### 2. `FamilyInfoSection.tsx` - 26 errores
**Ubicación:** `src/components/features/student-detail/FamilyInfoSection.tsx`

**Campos eliminados:**
- `familia.hermanos` (líneas 39-40)
- `familia.otros_familiares` (líneas 45-46)
- `familia.observaciones_hermanos` (líneas 51-52)
- `familia.observaciones_otros_familiares` (líneas 57-58)
- `familia.nombre_madre` (línea 115)
- `familia.nombre_padre` (línea 127)
- `familia.descripcion_madre` (línea 116)
- `familia.descripcion_padre` (línea 128)

**Solución:**
```typescript
import {
  getFamiliaNombreMadre,
  getFamiliaNombrePadre,
  getFamiliaHermanos,
  getFamiliaOtrosFamiliares,
  getFamiliaObservacionesHermanos,
  getFamiliaObservacionesOtros
} from '@/utils/migration-helpers';

// Reemplazar accesos
const hermanos = getFamiliaHermanos(familia);
const nombreMadre = getFamiliaNombreMadre(familia);
```

---

#### 3. `useFamiliaEditing.ts` - 24 errores
**Ubicación:** `src/components/features/student-detail/hooks/useFamiliaEditing.ts`

**Problema:** Hook que edita campos de familia eliminados

**Solución temporal:**
Comentar todo el código de manejo de campos eliminados (líneas 27-59) y agregar TODO:
```typescript
// TODO: Migrar a familiarService
// if (datosFamiliaEditados.nombre_madre !== undefined) {
//     await familiarService.create({ ... });
// }
```

---

#### 4. `AcademicReportSection.tsx` - 8 errores
**Ubicación:** `src/components/features/student-detail/AcademicReportSection.tsx`

**Campos eliminados:**
- `estudiante.semestres_suspendidos` (línea 58)
- `estudiante.semestres_total_carrera` (línea 59)
- `historial.año` y `historial.semestre` (líneas 105-112)

**Solución:**
```typescript
import {
  getEstudianteSemestresSuspendidos,
  getEstudianteSemestresCarrera,
  getHistorialAño,
  getHistorialSemestre
} from '@/utils/migration-helpers';

semestresSuspendidos: getEstudianteSemestresSuspendidos(estudiante),
semestresCarrera: getEstudianteSemestresCarrera(estudiante),
```

---

#### 5. `ProfileSection.tsx` - 10 errores
**Ubicación:** `src/components/features/student-detail/ProfileSection.tsx`

**Campos eliminados:**
- `estudiante.status` (líneas 28, 32, 33, 38, 40, 58, 171)
- `estudiante.email` (línea 67)
- `estudiante.telefono` (línea 68)

**Solución:**
```typescript
import {
  getEstudianteEmail,
  getEstudianteTelefono,
  getEstudianteStatus
} from '@/utils/migration-helpers';

const [status, setStatus] = useState(getEstudianteStatus(estudiante));
{ label: 'Correo Electrónico', value: getEstudianteEmail(estudiante) },
{ label: 'Teléfono', value: getEstudianteTelefono(estudiante) },
```

---

#### 6. `PersonalDataSection.tsx` - 1 error
**Ubicación:** `src/components/features/student-detail/PersonalDataSection.tsx`

**Campo eliminado:**
- `informacionAcademica.puntajes_admision` (línea 78)

**Solución:**
```typescript
// Comentar temporalmente o retornar valor por defecto
const puntajes = {}; // TODO: usar informacionAdmisionService
```

---

### 🟡 Media Prioridad (Archivos de Servicio - Ya corregidos)

✅ `informacion-contacto.service.ts` - Corregido
✅ `estado-academico.service.ts` - Corregido
✅ `familiar.service.ts` - Corregido
✅ `periodo-academico.service.ts` - Corregido

---

## Plan de Ejecución

### Fase 1: Compilación Básica (1-2 horas)
1. ✅ Corregir servicios nuevos (BaseHttpClient, enums)
2. ✅ Crear migration-helpers.ts
3. ⏳ Actualizar DataTable.tsx con helpers
4. ⏳ Actualizar FamilyInfoSection.tsx con helpers
5. ⏳ Actualizar useFamiliaEditing.ts (comentar código)
6. ⏳ Actualizar AcademicReportSection.tsx con helpers
7. ⏳ Actualizar ProfileSection.tsx con helpers
8. ⏳ Actualizar PersonalDataSection.tsx (comentar línea)

**Objetivo:** Que el frontend compile sin errores

### Fase 2: Integración Real (2-4 horas)
1. Reemplazar helpers de `informacion-contacto` con llamadas a API
2. Reemplazar helpers de `estado-academico` con llamadas a API
3. Reemplazar helpers de `familiar` con llamadas a API
4. Reemplazar helpers de `periodo-academico` con llamadas a API
5. Actualizar hooks de edición para usar nuevos servicios
6. Probar flujos completos

**Objetivo:** Funcionalidad completa con nuevos servicios

### Fase 3: Limpieza (1 hora)
1. Eliminar `migration-helpers.ts`
2. Eliminar comentarios TODO
3. Actualizar tests si existen
4. Documentar cambios en README

---

## Comandos Útiles

```bash
# Verificar errores de compilación
npm run build

# Contar errores por archivo
npm run build 2>&1 | grep "error TS" | cut -d':' -f1 | sort | uniq -c

# Ejecutar en modo desarrollo
npm run dev
```

---

## Notas Importantes

1. **No elimines migration-helpers.ts hasta completar Fase 2**
2. **Compila después de cada archivo corregido** para verificar progreso
3. **Los helpers retornan valores por defecto**, la UI mostrará datos incompletos hasta Fase 2
4. **Prioriza DataTable.tsx** - es el componente con más errores (68)
5. **Backend está funcionando** - solo falta adaptar el frontend

---

## Estado Actual

- ✅ Backend: Funcionando con nuevas entidades
- ✅ Servicios Frontend: Corregidos (BaseHttpClient, enums)
- ⏳ Componentes: Requieren actualización manual
- ⏳ Helpers temporales: Creados pero no aplicados

**Próximo paso:** Actualizar DataTable.tsx con los helpers
