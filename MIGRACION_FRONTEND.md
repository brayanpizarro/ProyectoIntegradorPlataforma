# Guía de Migración Frontend - Entidades Refactorizadas

## ⚠️ ESTADO ACTUAL

El frontend **NO COMPILA** hasta completar las migraciones. Hay 162 errores de TypeScript por referencias a campos eliminados.

## Solución Rápida Temporal

Se ha creado [src/utils/migration-helpers.ts](FrontEndProyectoIntegrador/src/utils/migration-helpers.ts) con funciones temporales que retornan valores por defecto. Úsalas mientras migras cada componente gradualmente.

```typescript
import { 
  getEstudianteEmail, 
  getEstudianteTelefono, 
  getEstudianteStatus,
  getFamiliaNombreMadre,
  getRamoSemestre 
} from '@/utils/migration-helpers';

// Temporal - retorna 'No especificado'
const email = getEstudianteEmail(estudiante);
```

## Resumen de Cambios

La base de datos fue refactorizada para normalizar entidades sobrecargadas. Los campos eliminados ahora están en módulos especializados con sus propios servicios.

## Nuevos Servicios Creados

### 1. `informacionContactoService`
**Campos migrados desde `Estudiante`:**
- `telefono`
- `email`
- `direccion`

**Uso:**
```typescript
import { informacionContactoService } from '@/services';

// Obtener por estudiante
const contacto = await informacionContactoService.getByEstudiante(idEstudiante);

// Actualizar o crear
await informacionContactoService.upsertByEstudiante(idEstudiante, {
  telefono: '123456789',
  email: 'test@example.com',
  direccion: 'Calle 123'
});
```

### 2. `estadoAcademicoService`
**Campos migrados desde `Estudiante`:**
- `status`
- `status_detalle`
- `semestres_suspendidos`
- `semestres_total_carrera` (antes `semestres_totales_carrera`)

**Uso:**
```typescript
import { estadoAcademicoService, StatusEstudiante } from '@/services';

// Obtener por estudiante
const estado = await estadoAcademicoService.getByEstudiante(idEstudiante);

// Actualizar
await estadoAcademicoService.upsertByEstudiante(idEstudiante, {
  status: StatusEstudiante.ACTIVO,
  status_detalle: 'Cursando semestre regular',
  semestres_suspendidos: 0,
  semestres_totales_carrera: 10
});
```

### 3. `familiarService`
**Campos migrados desde `Familia`:**
- `nombre_madre` → registros con `tipo_familiar_id = MADRE`
- `nombre_padre` → registros con `tipo_familiar_id = PADRE`
- `hermanos[]` → registros con `tipo_familiar_id = HERMANO`
- `otros_familiares[]` → registros con `tipo_familiar_id = OTRO`

**Uso:**
```typescript
import { familiarService, TipoFamiliarEnum } from '@/services';

// Obtener todos los tipos disponibles
const tipos = await familiarService.getAllTipos();

// Obtener familiares de una familia
const familiares = await familiarService.getByFamilia(idFamilia);

// Obtener solo madres
const madres = await familiarService.getByTipo(idFamilia, 1); // MADRE = id 1

// Crear nuevo familiar
await familiarService.create({
  id_familia: idFamilia,
  tipo_familiar_id: 1, // MADRE
  nombres: 'María',
  apellidos: 'González',
  telefono: '987654321',
  fecha_nacimiento: new Date('1980-05-15'),
  parentesco: 'Madre biológica',
  observaciones: 'Vive en Santiago'
});
```

### 4. `periodoAcademicoService`
**Campos migrados desde `RamosCursados` y `HistorialAcademico`:**
- `año`
- `semestre`

**Uso:**
```typescript
import { periodoAcademicoService } from '@/services';

// Obtener período actual
const periodoActual = await periodoAcademicoService.getPeriodoActual();

// Buscar período específico
const periodo = await periodoAcademicoService.buscarPeriodo(2025, 1);

// Obtener períodos de un estudiante
const periodosEstudiante = await periodoAcademicoService.getByEstudiante(idEstudiante);

// Crear relación estudiante-período
await periodoAcademicoService.create({
  id_estudiante: idEstudiante,
  periodo_academico_id: periodo.id,
  esta_cursando: true,
  fecha_inicio: new Date('2025-03-01')
});
```

## Componentes que Requieren Actualización

### `PersonalDataSection.tsx`
**Línea 78:** `estudiante.informacionAcademica?.puntajes_admision` ya no existe
```typescript
// ANTES
const puntajes = estudiante.informacionAcademica?.puntajes_admision;

// DESPUÉS - usar informacion-admision service (cuando se cree)
const admision = await informacionAdmisionService.getByEstudiante(idEstudiante);
const puntajes = {
  nem: admision.puntaje_nem,
  ranking: admision.puntaje_ranking,
  matematica: admision.puntaje_matematica_m1
};
```

### `FamilyInfoSection.tsx`
**Líneas 115, 121, 127, 133:** Campos `nombre_madre` y `nombre_padre` eliminados
```typescript
// ANTES
nombreValue={familia?.nombre_madre || ''}
onNombreChange={(valor) => onFamiliaChange?.('nombre_madre', valor)}

// DESPUÉS
const [familiares, setFamiliares] = useState<Familiar[]>([]);
const madre = familiares.find(f => f.tipo_familiar?.tipo === 'MADRE');

nombreValue={madre?.nombres || ''}
onNombreChange={async (valor) => {
  if (madre) {
    await familiarService.update(madre.id, { nombres: valor });
  } else {
    await familiarService.create({
      id_familia: familia.id_familia,
      tipo_familiar_id: 1, // MADRE
      nombres: valor
    });
  }
  // Recargar familiares
  const updatedFamiliares = await familiarService.getByFamilia(familia.id_familia);
  setFamiliares(updatedFamiliares);
}}
```

### `DataTable.tsx`
**Líneas 644, 656:** Acceso a `nombre_madre` y `nombre_padre`
```typescript
// ANTES
{familia.nombre_madre || 'No registrada'}
{familia.nombre_padre || 'No registrado'}

// DESPUÉS - cargar familiares primero
const familiares = await familiarService.getByFamilia(familia.id_familia);
const madre = familiares.find(f => f.tipo_familiar?.tipo === 'MADRE');
const padre = familiares.find(f => f.tipo_familiar?.tipo === 'PADRE');

{madre?.nombres || 'No registrada'}
{padre?.nombres || 'No registrado'}
```

### `useFamiliaEditing.ts`
**Líneas 27-31:** Manejo de `nombre_madre` y `nombre_padre`
```typescript
// ANTES
if (datosFamiliaEditados.nombre_madre !== undefined) {
    familiaPayload.nombre_madre = datosFamiliaEditados.nombre_madre;
}

// DESPUÉS - usar familiarService
if (datosFamiliaEditados.nombre_madre !== undefined) {
  const madre = familiares.find(f => f.tipo_familiar?.tipo === 'MADRE');
  if (madre) {
    await familiarService.update(madre.id, { nombres: datosFamiliaEditados.nombre_madre });
  } else {
    await familiarService.create({
      id_familia: familiaId,
      tipo_familiar_id: 1,
      nombres: datosFamiliaEditados.nombre_madre
    });
  }
}
```

### `useAcademicEditing.ts`
**Línea 21, 63, 65:** Referencias a `puntajes_admision` y `ensayos_paes`
```typescript
// ANTES
'puntajes_paes', 'puntajes_admision', 'ensayos_paes'
datosInfoAcademica.puntajes_admision = { ... }

// DESPUÉS - eliminar estas referencias
// Usar informacionAdmisionService cuando esté disponible
```

### Servicios - `ramos-cursados.service.ts` y `historial-academico.service.ts`
**Filtros por año/semestre:**
```typescript
// ANTES
const ramos = await ramosCursadosService.getByEstudiante(idEstudiante, 2025, 1);

// DESPUÉS
// 1. Obtener período académico
const periodo = await periodoAcademicoService.buscarPeriodo(2025, 1);
// 2. Obtener relación estudiante-período
const periodosEst = await periodoAcademicoService.getByEstudiante(idEstudiante);
const periodoEst = periodosEst.find(p => p.periodo_academico_id === periodo.id);
// 3. Filtrar ramos por periodo_academico_estudiante_id
const ramos = await ramosCursadosService.getByEstudiante(idEstudiante, periodoEst?.id);
```

## Interfaces de Tipos Actualizadas

Las interfaces en `types/index.ts` fueron actualizadas:

- **`Estudiante`**: Removidos `telefono`, `email`, `direccion`, `status`, `status_detalle`, `semestres_suspendidos`, `semestres_total_carrera`
- **`Familia`**: Removidos `nombre_madre`, `descripcion_madre`, `nombre_padre`, `descripcion_padre`, `hermanos`, `otros_familiares`
- **`RamosCursados`**: Removidos `año`, `semestre`, agregado `periodo_academico_estudiante_id`
- **`HistorialAcademico`**: Removidos `año`, `semestre`
- **`InformacionAcademica`**: Removidos `puntajes_admision`, `ensayos_paes`

## Patrón de Migración Recomendado

Para cada componente que usa campos eliminados:

1. **Identificar campos eliminados** en uso
2. **Importar servicio correspondiente** de los nuevos módulos
3. **Cargar datos relacionados** usando el servicio
4. **Actualizar lógica** para usar nuevas estructuras
5. **Probar funcionalidad** completa

## Estado de Migración Backend

✅ Backend completamente migrado y funcionando
✅ Nuevas tablas creadas en la base de datos
✅ Datos migrados exitosamente
✅ Columnas duplicadas eliminadas
✅ Backend corriendo en Docker (puerto 3000)

## Próximos Pasos

1. Actualizar componentes uno por uno
2. Probar flujos completos (crear, editar, eliminar)
3. Validar que no haya errores de consola
4. Actualizar pruebas unitarias si existen
