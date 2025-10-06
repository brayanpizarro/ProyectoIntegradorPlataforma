# Frontend - Plataforma Fundación

## Descripción
Este es el frontend de la plataforma de gestión de estudiantes para la fundación. La aplicación está construida con React + TypeScript + Vite y permite la gestión completa de usuarios (administradores, académicos y estudiantes).

## 🚀 Características Implementadas

### Sistema de Autenticación Completo
- **LoginForm**: Login para estudiantes
- **LoginAdminForm**: Login para administradores y académicos  
- **Recuperación de contraseña**: Flujo completo (solicitar → verificar código → nueva contraseña)
- **Protección de rutas**: Verificación automática de autenticación
- **Gestión de tokens JWT**: Almacenamiento seguro y renovación automática

### Paneles de Usuario Específicos
- **AdminPanel**: Panel completo para administradores con:
  - Dashboard con estadísticas
  - Gestión de estudiantes, académicos e instituciones
  - Generación de reportes
  - Configuración del sistema
- **EstudiantePanel**: Panel para estudiantes con:
  - Visualización de perfil personal
  - Acceso a reportes académicos
  - Información de contacto
- **AcademicoPanel**: Panel para académicos con:
  - Gestión de estudiantes asignados
  - Generación de reportes de seguimiento
  - Vista de sus propios reportes

### Arquitectura Moderna
- **TypeScript**: Tipado fuerte para mejor desarrollo
- **React Router**: Navegación SPA completa
- **Axios**: Cliente HTTP con interceptores para tokens
- **CSS Modular**: Estilos organizados sin dependencias externas
- **Estructura escalable**: Organización por funcionalidad

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── LoginForm/       # Formularios de autenticación
│   │   ├── LoginForm.tsx
│   │   ├── LoginAdminForm.tsx
│   │   └── LoginForm.css
│   └── RecuperarPassword/ # Recuperación de contraseña
│       ├── SolicitarRecuperacion.tsx
│       ├── VerificarCodigo.tsx
│       └── NuevaPassword.tsx
├── pages/               # Páginas principales
│   ├── AdminPanel.tsx   # Panel administrativo
│   ├── AcademicoPanel/  # Panel académico
│   └── EstudiantePanel/ # Panel estudiantil
├── services/            # Servicios API
│   ├── authService.ts   # Autenticación
│   ├── estudianteService.ts
│   ├── academicoService.ts
│   ├── institucionService.ts
│   ├── reporteService.ts
│   └── api.ts          # Configuración Axios
├── types/               # Tipos TypeScript
│   └── index.ts        # Interfaces completas
└── App.tsx             # Rutas principales
```

## 🔐 Credenciales de Prueba

### Para probar el login, usa estas credenciales de ejemplo:

#### Administrador:
- **Email**: `admin@fundacion.cl`
- **Password**: `admin123`
- **Acceso**: Panel completo de administración

#### Académico:
- **Email**: `academico@fundacion.cl`  
- **Password**: `admin123`
- **Acceso**: Panel de gestión académica

#### Estudiante:
- **Email**: `estudiante@fundacion.cl`
- **Password**: `admin123`
- **Acceso**: Panel personal del estudiante

**Nota**: Estas son credenciales de prueba con respuestas simuladas (mock). El backend está simulado en el frontend para permitir testing sin servidor.

### 🔄 Recuperación de Contraseña (Modo Prueba):
- **Código de verificación**: `123456` (para cualquier email)
- **Flujo completo** funcional desde solicitar hasta nueva contraseña

## 🛠️ Instalación y Uso

### Prerrequisitos
- Node.js (v18+)
- npm o yarn

### Comandos

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción  
npm run build

# Vista previa de producción
npm run preview
```

### URLs de Acceso
- **Desarrollo**: http://localhost:5173
- **Login Principal**: http://localhost:5173/ (estudiantes)
- **Login Admin**: http://localhost:5173/login-admin (admin/académicos)

## 🔗 Rutas de la Aplicación

```typescript
// Rutas públicas
/                           # Login de estudiantes
/login-admin               # Login de administradores/académicos
/solicitar-recuperacion    # Solicitar recuperación de contraseña
/verificar-codigo         # Verificar código de recuperación
/nueva-password           # Establecer nueva contraseña

// Rutas protegidas
/admin                    # Panel de administración
/academico               # Panel académico  
/estudiante              # Panel de estudiante
```

## 🔌 API Services

La aplicación incluye una capa de servicios completa lista para conectar con el backend:

### Servicios Implementados:

- **authService.ts**: Autenticación, login, logout, recuperación de contraseña
- **estudianteService.ts**: CRUD completo para estudiantes
- **academicoService.ts**: CRUD completo para académicos  
- **institucionService.ts**: CRUD completo para instituciones
- **reporteService.ts**: CRUD completo para reportes

### Configuración API (api.ts):
- Base URL configurable
- Interceptores para tokens JWT
- Manejo automático de errores
- Renovación automática de tokens

### Endpoints del Backend (NestJS) que deben implementarse:

```typescript
// Autenticación
POST   /auth/login            // Login de usuarios
POST   /auth/logout           // Logout
POST   /auth/forgot-password  // Solicitar recuperación
POST   /auth/verify-code      // Verificar código
POST   /auth/reset-password   // Establecer nueva contraseña
GET    /auth/profile          // Obtener perfil del usuario

// Usuarios  
GET    /users                 // Obtener todos los usuarios
POST   /users                 // Crear nuevo usuario
GET    /users/:id             // Obtener usuario por ID
PATCH  /users/:id             // Actualizar usuario
DELETE /users/:id             // Eliminar usuario

// Estudiantes
GET    /estudiante            // Obtener todos los estudiantes
POST   /estudiante            // Crear nuevo estudiante
GET    /estudiante/:id        // Obtener estudiante por ID
PATCH  /estudiante/:id        // Actualizar estudiante
DELETE /estudiante/:id        // Eliminar estudiante

// Académicos
GET    /academico             // Obtener todos los académicos
POST   /academico             // Crear nuevo académico
GET    /academico/:id         // Obtener académico por ID
PATCH  /academico/:id         // Actualizar académico
DELETE /academico/:id         // Eliminar académico

// Instituciones
GET    /institucion           // Obtener todas las instituciones
POST   /institucion           // Crear nueva institución
GET    /institucion/:id       // Obtener institución por ID
PATCH  /institucion/:id       // Actualizar institución
DELETE /institucion/:id       // Eliminar institución

// Asignaturas
GET    /asignatura            // Obtener todas las asignaturas
POST   /asignatura            // Crear nueva asignatura
GET    /asignatura/:id        // Obtener asignatura por ID
PATCH  /asignatura/:id        // Actualizar asignatura
DELETE /asignatura/:id        // Eliminar asignatura

// Reportes
GET    /reporte               // Obtener todos los reportes
POST   /reporte               // Crear nuevo reporte
GET    /reporte/:id           // Obtener reporte por ID
PATCH  /reporte/:id           // Actualizar reporte
DELETE /reporte/:id           // Eliminar reporte
```

## 🔄 Estado Actual del Backend

El frontend está completamente implementado con servicios simulados. Para conectar con el backend real:

1. **Actualizar la BASE_URL** en `src/services/api.ts`
2. **Implementar los endpoints** en el backend NestJS
3. **Verificar las interfaces TypeScript** coincidan con las entidades del backend
4. **Probar la autenticación** JWT

## 🎨 Estilos y UI

- **CSS personalizado** sin dependencias externas
- **Diseño responsive** para móvil y desktop
- **Iconos emoji** para simplicidad (sin librerías externas)
- **Colores consistentes** en toda la aplicación
- **Formularios accesibles** con validación

## 🧪 Testing

Para probar la aplicación:

1. **Ejecutar**: `npm run dev`
2. **Abrir**: http://localhost:5173
3. **Login con credenciales** proporcionadas arriba
4. **Navegar** entre los diferentes paneles
5. **Probar** el flujo de recuperación de contraseña

## 📝 Próximos Pasos

### Pendiente de Implementación:
- [ ] Conectar servicios con backend real
- [ ] Formularios CRUD para todas las entidades
- [ ] Subida de archivos/imágenes
- [ ] Filtros y búsqueda avanzada
- [ ] Exportación de reportes
- [ ] Notificaciones en tiempo real
- [ ] Modo offline con sincronización

## 🔧 Configuración

### Variables de Entorno
Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3000
VITE_JWT_SECRET_KEY=tu_clave_secreta_jwt
```

### Scripts Disponibles

```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
```
};

const handleNuevaEntrevista = (estudianteId: string) => {
  // TODO: Implementar llamada POST /api/reporte con tipo "entrevista"
};
```

### 3. Autenticación (Navbar.tsx)
```typescript
const handleLogout = () => {
  // TODO: Implementar logout real
  // DELETE /api/auth/logout o similar
};
```

## Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   cd FrontEndProyectoIntegrador
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

3. **Construir para producción:**
   ```bash
   npm run build
   ```

## Tecnologías Utilizadas

- **React 19** - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Herramienta de build
- **Lucide React** - Iconos
- **CSS personalizado** - Estilos (simulando Tailwind)

## Funcionalidades por Vista

### Dashboard Principal
- Estadísticas generales (total generaciones, estudiantes)
- Grid de generaciones con cantidad de estudiantes
- Botones para crear nueva generación y nuevo estudiante

### Vista de Generación
- Lista de estudiantes de la generación seleccionada
- Información básica: nombre, RUT, institución, contacto, dirección
- Estado activo/inactivo
- Botón para agregar nuevo estudiante
- Estadísticas de activos/inactivos

### Vista de Estudiante
- Información completa del estudiante
- Datos personales y de contacto
- Información institucional
- Registros académicos (si existen)
- Historial de entrevistas/reportes
- Botón para crear nueva entrevista

## Próximos Pasos

1. **Conectar con Backend**: Reemplazar datos mock con llamadas reales a la API
2. **Implementar Autenticación**: Sistema de login/logout
3. **Crear Formularios**: Para CRUD de estudiantes, generaciones, entrevistas
4. **Añadir Validaciones**: Validación de formularios y datos
5. **Implementar Búsqueda**: Filtros por nombre, institución, año, etc.
6. **Mejorar UX**: Loading states, error handling, notificaciones
7. **Responsive**: Optimizar para dispositivos móviles
8. **Tests**: Implementar tests unitarios y de integración

## Notas de Desarrollo

- Todos los componentes están tipados con TypeScript
- Los tipos están basados en las entidades del backend NestJS
- La navegación se maneja con estado interno (puede migrarse a React Router)
- Los estilos están organizados para fácil mantenimiento
- La estructura es escalable para futuras funcionalidades
