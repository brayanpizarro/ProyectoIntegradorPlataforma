# 📋 TAREAS PENDIENTES DEL BACKEND

## 🎯 Resumen Ejecutivo

Este documento detalla todas las implementaciones que deben realizarse en el **backend NestJS** para completar la integración con el frontend actualizado. El frontend ya está adaptado para trabajar con la nueva estructura del backend, pero manteniendo compatibilidad con los datos mock existentes.

---

## 🏗️ Estructura Actual del Backend

### Base de Datos
- **PostgreSQL**: Datos estructurados (estudiantes, instituciones, familias, etc.)
- **MongoDB**: Entrevistas con etiquetas dinámicas

### Entidades Principales
1. **Estudiante** - Información básica del estudiante
2. **Institucion** - Datos de instituciones educativas
3. **Familia** - Información familiar
4. **RamosCursados** - Materias y calificaciones
5. **HistorialAcademico** - Registro histórico académico
6. **InformacionAcademica** - Estado actual académico
7. **Entrevistas** (MongoDB) - Entrevistas con etiquetas dinámicas

---

## 🔧 IMPLEMENTACIONES REQUERIDAS

### 1. 🔐 AUTENTICACIÓN Y AUTORIZACIÓN

#### 1.1 Sistema de Login
**Endpoint requerido:** `POST /auth/login`

```typescript
// Request Body
{
  "username": string,
  "password": string
}

// Response
{
  "access_token": string,
  "user": {
    "id": number,
    "username": string,
    "email": string,
    "role": string
  }
}
```

**Tareas:**
- [ ] Implementar JWT authentication
- [ ] Crear middleware de autenticación
- [ ] Hashear contraseñas con bcrypt
- [ ] Manejo de sessiones
- [ ] Endpoint de logout
- [ ] Validación de tokens

#### 1.2 Gestión de Usuarios
**Endpoints requeridos:**
- `GET /users/profile` - Obtener perfil del usuario actual
- `PUT /users/profile` - Actualizar perfil
- `POST /users/register` - Registro de nuevos usuarios (admin)

---

### 2. 👥 GESTIÓN DE ESTUDIANTES

#### 2.1 CRUD Completo de Estudiantes
**Endpoints requeridos:**

```typescript
// GET /estudiantes - Listar todos los estudiantes
Response: Estudiante[]

// GET /estudiantes/:id - Obtener estudiante específico
Response: Estudiante con relaciones completas

// POST /estudiantes - Crear nuevo estudiante
Request: CreateEstudianteDto

// PUT /estudiantes/:id - Actualizar estudiante
Request: UpdateEstudianteDto

// DELETE /estudiantes/:id - Eliminar estudiante
```

**Campos críticos que debe manejar:**
```typescript
interface EstudianteCompleto {
  id_estudiante: number;
  nombre: string;
  rut: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento: Date;
  tipo_de_estudiante: 'UNIVERSITARIO' | 'TECNICO' | 'RETIRADO';
  
  // Relaciones
  institucion: Institucion;
  familia: Familia;
  informacionAcademica: InformacionAcademica;
  historialAcademico: HistorialAcademico[];
  ramosCursados: RamosCursados[];
}
```

#### 2.2 Filtros y Búsquedas
**Endpoints requeridos:**
- `GET /estudiantes/search?q=term` - Búsqueda por texto
- `GET /estudiantes/filter?year=2024&status=UNIVERSITARIO` - Filtros
- `GET /estudiantes/generacion/:year` - Estudiantes por año

---

### 3. 🏫 GESTIÓN DE INSTITUCIONES

#### 3.1 CRUD de Instituciones
**Endpoints requeridos:**
```typescript
// GET /instituciones
// POST /instituciones
// PUT /instituciones/:id
// DELETE /instituciones/:id
// GET /instituciones/:id/estudiantes - Estudiantes de una institución
```

---

### 4. 📊 REPORTES Y ESTADÍSTICAS

#### 4.1 Dashboard Estadísticas
**Endpoint:** `GET /estadisticas/dashboard`

```typescript
Response: {
  total_estudiantes: number;
  estudiantes_activos: number;
  estudiantes_graduados: number;
  estudiantes_retirados: number;
  promedio_general: number;
  instituciones_total: number;
  generaciones: {
    año: number;
    total: number;
    activos: number;
  }[];
}
```

#### 4.2 Reportes por Generación
**Endpoint:** `GET /estadisticas/generacion/:year`

```typescript
Response: {
  año: number;
  total_estudiantes: number;
  por_estado: {
    activos: number;
    graduados: number;
    retirados: number;
  };
  por_institucion: {
    nombre: string;
    cantidad: number;
  }[];
  promedio_general: number;
}
```

---

### 5. 🎤 SISTEMA DE ENTREVISTAS (MongoDB)

#### 5.1 CRUD de Entrevistas
**Endpoints requeridos:**
```typescript
// GET /entrevistas
// GET /entrevistas/:id
// POST /entrevistas
// PUT /entrevistas/:id
// DELETE /entrevistas/:id
```

#### 5.2 Gestión de Etiquetas Dinámicas
```typescript
// GET /entrevistas/tags - Obtener todas las etiquetas
// GET /entrevistas/search?tags=tag1,tag2 - Buscar por etiquetas
// PUT /entrevistas/:id/tags - Actualizar etiquetas de una entrevista
```

**Estructura de entrevista:**
```typescript
interface Entrevista {
  _id: string;
  estudiante_id: number;
  fecha: Date;
  entrevistador: string;
  notas: string;
  tags: string[]; // Etiquetas dinámicas
  tipo: 'seguimiento' | 'ingreso' | 'egreso';
  estado: 'pendiente' | 'completada' | 'cancelada';
}
```

---

### 6. 📈 INFORMACIÓN ACADÉMICA

#### 6.1 Historial Académico
**Endpoints requeridos:**
```typescript
// GET /estudiantes/:id/historial
// POST /estudiantes/:id/historial
// PUT /historial/:id
// DELETE /historial/:id
```

#### 6.2 Ramos Cursados
```typescript
// GET /estudiantes/:id/ramos
// POST /estudiantes/:id/ramos
// PUT /ramos/:id
// DELETE /ramos/:id
```

---

## 🔗 INTEGRACIONES CRÍTICAS

### 1. Relaciones de Base de Datos
**IMPLEMENTAR:**
- [x] Relación Estudiante ↔ Institucion (ya existe)
- [ ] Relación Estudiante ↔ Familia
- [ ] Relación Estudiante ↔ InformacionAcademica
- [ ] Relación Estudiante ↔ HistorialAcademico
- [ ] Relación Estudiante ↔ RamosCursados
- [ ] Relación cruzada MongoDB ↔ PostgreSQL (estudiante_id en entrevistas)

### 2. Migraciones de Datos
- [ ] Crear seeders para datos de prueba
- [ ] Migrar datos mock existentes del frontend
- [ ] Establecer datos de ejemplo para todas las entidades

### 3. Validaciones
- [ ] DTOs para todas las entidades
- [ ] Validación de RUT chileno
- [ ] Validación de emails
- [ ] Validación de relaciones entre entidades

---

## 🚦 CONFIGURACIÓN DE DESARROLLO

### 1. Variables de Entorno
**Agregar al .env:**
```bash
# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/plataforma_fundacion
MONGODB_URL=mongodb://localhost:27017/plataforma_entrevistas

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=24h

# CORS
FRONTEND_URL=http://localhost:3000
```

### 2. Dependencias Adicionales
**Instalar:**
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install bcrypt class-validator class-transformer
npm install @nestjs/mongoose mongoose
```

### 3. Módulos a Crear/Completar
- [ ] AuthModule (JWT, Guards, Strategies)
- [ ] EstudiantesModule (completo)
- [ ] InstitucionesModule
- [ ] FamiliaModule
- [ ] EntrevistasModule (MongoDB)
- [ ] EstadisticasModule
- [ ] ReportesModule

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### FASE 1: Autenticación (CRÍTICO)
- [ ] Configurar JWT
- [ ] Crear middleware de auth
- [ ] Implementar login/logout
- [ ] Proteger rutas con guards

### FASE 2: CRUD Básico
- [ ] Estudiantes CRUD completo
- [ ] Instituciones CRUD
- [ ] Sistema de filtros y búsqueda

### FASE 3: Relaciones
- [ ] Implementar todas las relaciones de DB
- [ ] Crear endpoints para datos relacionados
- [ ] Optimizar queries con joins

### FASE 4: Estadísticas
- [ ] Dashboard de estadísticas
- [ ] Reportes por generación
- [ ] Gráficos y métricas

### FASE 5: Entrevistas
- [ ] CRUD de entrevistas en MongoDB
- [ ] Sistema de etiquetas dinámicas
- [ ] Integración con estudiantes

### FASE 6: Optimización
- [ ] Paginación en listados
- [ ] Cache para estadísticas
- [ ] Logs y monitoreo
- [ ] Tests unitarios

---

## 🎯 COMPATIBILIDAD CON FRONTEND

El frontend está configurado para:

1. **Funcionar SIN backend** (usando datos mock)
2. **Detectar automáticamente** cuando el backend está disponible
3. **Cambiar dinámicamente** entre mock y datos reales
4. **Mantener toda la funcionalidad** durante el desarrollo del backend

### Campos Híbridos Soportados
El frontend maneja automáticamente estos campos alternativos:

```typescript
// Estudiante
nombre || `${nombres} ${apellidos}` // Compatibilidad nombres
id_estudiante || id // IDs flexibles
estado || informacionAcademica?.status_actual // Estado de múltiples fuentes
promedio || informacionAcademica?.promedio_actual // Promedios

// Institución
institucion?.nombre_institucion || universidad // Nombres institución
institucion?.anio_de_ingreso || año_generacion // Años de ingreso
```

---

## 🚨 PUNTOS CRÍTICOS

### 1. NO ROMPER LA FUNCIONALIDAD ACTUAL
- El frontend debe seguir funcionando durante todo el desarrollo
- Los datos mock deben mantenerse como fallback
- Todos los endpoints deben ser backward-compatible

### 2. RENDIMIENTO
- Implementar paginación desde el inicio
- Usar índices apropiados en la base de datos
- Cache para consultas frecuentes (estadísticas)

### 3. SEGURIDAD
- Validar TODOS los inputs
- Sanitizar datos de MongoDB
- Implementar rate limiting
- CORS configurado correctamente

---

## 📞 NOTAS PARA EL DESARROLLADOR

1. **Este frontend YA ESTÁ LISTO** para recibir los datos del backend
2. **Mantén los datos mock** hasta que cada endpoint esté 100% funcional
3. **Prueba cada endpoint** antes de desactivar el fallback correspondiente
4. **El sistema de etiquetas** de entrevistas debe ser completamente dinámico
5. **Las estadísticas** son críticas para el dashboard principal

---

## 🔍 ENDPOINTS DE PRUEBA

Para verificar que el frontend se conecta correctamente:

1. **Primer endpoint a implementar:** `GET /estudiantes`
2. **Segundo endpoint:** `POST /auth/login`
3. **Tercer endpoint:** `GET /estadisticas/dashboard`

Una vez estos funcionen, el frontend mostrará datos reales y se podrá continuar con el resto de la implementación.

---

*📅 Documento creado: [Fecha actual]*
*✍️ Creado por: GitHub Copilot*
*🔄 Última actualización: [Fecha actual]*