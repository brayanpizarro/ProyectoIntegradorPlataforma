import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/authService';

// Datos mock extendidos con toda la información necesaria
const mockEstudiantes = [
  {
    id: 1,
    nombres: 'María José',
    apellidos: 'González Silva',
    rut: '20.123.456-7',
    email: 'maria.gonzalez@correo.cl',
    telefono: '+56 9 1234 5678',
    fecha_nacimiento: '2001-05-15',
    estado: true,
    carrera: 'Ingeniería Civil Informática',
    semestre: 6,
    promedio: 6.2,
    beca: 'Beca de Excelencia Académica',
    region: 'Metropolitana',
    ciudad: 'Santiago',
    direccion: 'Av. Libertador Bernardo O\'Higgins 1234',
    institucion: {
      id: 1,
      nombre_institucion: 'Universidad de Chile',
      region: 'Metropolitana'
    }
  },
  {
    id: 2,
    nombres: 'Carlos',
    apellidos: 'Pérez Morales',
    rut: '19.987.654-3',
    email: 'carlos.perez@correo.cl',
    telefono: '+56 9 8765 4321',
    fecha_nacimiento: '2000-11-22',
    estado: true,
    carrera: 'Psicología',
    semestre: 8,
    promedio: 5.8,
    beca: 'Sin beca',
    region: 'Valparaíso',
    ciudad: 'Valparaíso',
    direccion: 'Cerro Alegre 567',
    institucion: {
      id: 2,
      nombre_institucion: 'Pontificia Universidad Católica de Valparaíso',
      region: 'Valparaíso'
    }
  },
  {
    id: 3,
    nombres: 'Ana Sofía',
    apellidos: 'Torres Vega',
    rut: '21.456.789-0',
    email: 'ana.torres@correo.cl',
    telefono: '+56 9 5555 0123',
    fecha_nacimiento: '2002-03-08',
    estado: false,
    carrera: 'Medicina',
    semestre: 4,
    promedio: 6.8,
    beca: 'Beca Indígena',
    region: 'Biobío',
    ciudad: 'Concepción',
    direccion: 'Av. Pedro de Valdivia 890',
    institucion: {
      id: 3,
      nombre_institucion: 'Universidad de Concepción',
      region: 'Biobío'
    }
  },
  {
    id: 4,
    nombres: 'Diego',
    apellidos: 'Ramírez Castro',
    rut: '20.654.321-9',
    email: 'diego.ramirez@correo.cl',
    telefono: '+56 9 7777 8888',
    fecha_nacimiento: '2001-09-14',
    estado: true,
    carrera: 'Arquitectura',
    semestre: 5,
    promedio: 5.4,
    beca: 'Beca Socioeconómica',
    region: 'Coquimbo',
    ciudad: 'La Serena',
    direccion: 'Av. Francisco de Aguirre 456',
    institucion: {
      id: 4,
      nombre_institucion: 'Universidad de La Serena',
      region: 'Coquimbo'
    }
  },
  {
    id: 5,
    nombres: 'Valentina',
    apellidos: 'López Herrera',
    rut: '21.789.012-4',
    email: 'valentina.lopez@correo.cl',
    telefono: '+56 9 2222 3333',
    fecha_nacimiento: '2002-07-30',
    estado: true,
    carrera: 'Enfermería',
    semestre: 3,
    promedio: 6.5,
    beca: 'Sin beca',
    region: 'Araucanía',
    ciudad: 'Temuco',
    direccion: 'Av. Alemania 1234',
    institucion: {
      id: 5,
      nombre_institucion: 'Universidad de La Frontera',
      region: 'Araucanía'
    }
  },
  {
    id: 6,
    nombres: 'Sebastián',
    apellidos: 'Muñoz Rojas',
    rut: '20.345.678-1',
    email: 'sebastian.munoz@correo.cl',
    telefono: '+56 9 4444 5555',
    fecha_nacimiento: '2001-12-03',
    estado: false,
    carrera: 'Derecho',
    semestre: 7,
    promedio: 5.9,
    beca: 'Beca de Mantención',
    region: 'Los Ríos',
    ciudad: 'Valdivia',
    direccion: 'Av. España 789',
    institucion: {
      id: 6,
      nombre_institucion: 'Universidad Austral de Chile',
      region: 'Los Ríos'
    }
  },
  {
    id: 7,
    nombres: 'Isidora',
    apellidos: 'Sánchez Fuentes',
    rut: '21.012.345-8',
    email: 'isidora.sanchez@correo.cl',
    telefono: '+56 9 6666 7777',
    fecha_nacimiento: '2002-01-25',
    estado: true,
    carrera: 'Pedagogía en Educación Básica',
    semestre: 2,
    promedio: 6.1,
    beca: 'Beca Vocación de Profesor',
    region: 'Maule',
    ciudad: 'Talca',
    direccion: 'Av. Lircay 321',
    institucion: {
      id: 7,
      nombre_institucion: 'Universidad Católica del Maule',
      region: 'Maule'
    }
  },
  {
    id: 8,
    nombres: 'Matías',
    apellidos: 'Contreras Díaz',
    rut: '20.678.901-5',
    email: 'matias.contreras@correo.cl',
    telefono: '+56 9 8888 9999',
    fecha_nacimiento: '2001-04-18',
    estado: true,
    carrera: 'Trabajo Social',
    semestre: 6,
    promedio: 6.7,
    beca: 'Beca Indígena',
    region: 'Los Lagos',
    ciudad: 'Puerto Montt',
    direccion: 'Av. Angelmó 654',
    institucion: {
      id: 8,
      nombre_institucion: 'Universidad de Los Lagos',
      region: 'Los Lagos'
    }
  }
];

export const GeneracionView = () => {
  const navigate = useNavigate();
  const { año } = useParams();
  const [usuario, setUsuario] = useState<any>(null);
  const [estudiantes] = useState(mockEstudiantes);
  
  // Estados de filtrado avanzado
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activos' | 'inactivos'>('todos');
  const [filtroInstitucion, setFiltroInstitucion] = useState('todas');
  const [filtroRegion, setFiltroRegion] = useState('todas');
  const [filtroBeca, setFiltroBeca] = useState('todas');
  const [ordenarPor, setOrdenarPor] = useState<'nombre' | 'promedio' | 'semestre'>('nombre');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setUsuario(user);
      } catch (error) {
        console.error('Error al obtener usuario:', error);
        navigate('/');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Lógica de filtrado avanzado
  const estudiantesFiltrados = estudiantes.filter(estudiante => {
    // Filtro por búsqueda (nombre, apellido, RUT, email, carrera)
    const terminoBusqueda = busqueda.toLowerCase();
    const coincideBusqueda = busqueda === '' || 
      estudiante.nombres.toLowerCase().includes(terminoBusqueda) ||
      estudiante.apellidos.toLowerCase().includes(terminoBusqueda) ||
      estudiante.rut.includes(busqueda) ||
      estudiante.email.toLowerCase().includes(terminoBusqueda) ||
      estudiante.carrera.toLowerCase().includes(terminoBusqueda);
    
    // Filtro por estado
    const coincideEstado = filtroEstado === 'todos' || 
      (filtroEstado === 'activos' && estudiante.estado) ||
      (filtroEstado === 'inactivos' && !estudiante.estado);
    
    // Filtro por institución
    const coincideInstitucion = filtroInstitucion === 'todas' || 
      estudiante.institucion.nombre_institucion === filtroInstitucion;
    
    // Filtro por región
    const coincideRegion = filtroRegion === 'todas' || 
      estudiante.region === filtroRegion;
    
    // Filtro por beca
    const coincideBeca = filtroBeca === 'todas' || 
      (filtroBeca === 'con_beca' && estudiante.beca !== 'Sin beca') ||
      (filtroBeca === 'sin_beca' && estudiante.beca === 'Sin beca');
    
    return coincideBusqueda && coincideEstado && coincideInstitucion && 
           coincideRegion && coincideBeca;
  });

  // Ordenamiento
  const estudiantesOrdenados = [...estudiantesFiltrados].sort((a, b) => {
    if (ordenarPor === 'nombre') {
      return `${a.nombres} ${a.apellidos}`.localeCompare(`${b.nombres} ${b.apellidos}`);
    } else if (ordenarPor === 'promedio') {
      return b.promedio - a.promedio; // Mayor promedio primero
    } else {
      return b.semestre - a.semestre; // Mayor semestre primero
    }
  });

  // Obtener opciones únicas para los filtros
  const instituciones = [...new Set(estudiantes.map(e => e.institucion.nombre_institucion))];
  const regiones = [...new Set(estudiantes.map(e => e.region))];

  const estudiantesActivos = estudiantesOrdenados.filter(e => e.estado).length;
  const estudiantesInactivos = estudiantesOrdenados.filter(e => !e.estado).length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Navbar */}
      <nav style={{
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            🏛️ Fundación
          </h1>
          <button 
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/dashboard')}
          >
            ← Volver al Dashboard
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>{usuario?.tipo || 'Usuario'}: {usuario?.email || 'Cargando...'}</span>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#dc2626',
              border: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido Principal */}
      <div style={{ padding: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, marginBottom: '0.5rem' }}>
            🎓 Generación {año}
          </h2>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Gestión completa de estudiantes de la generación {año} con filtros avanzados
          </p>
        </div>

        {/* Estadísticas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '2rem' }}>📊</div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Total</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{estudiantesOrdenados.length}</p>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '2rem' }}>✅</div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Activos</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#10b981' }}>{estudiantesActivos}</p>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '2rem' }}>⏸️</div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Inactivos</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#ef4444' }}>{estudiantesInactivos}</p>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '2rem' }}>📊</div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Promedio General</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#3b82f6' }}>
                  {estudiantesOrdenados.length > 0 
                    ? (estudiantesOrdenados.reduce((sum, e) => sum + e.promedio, 0) / estudiantesOrdenados.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros Avanzados */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            🔍 Filtros y Búsqueda Avanzada
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            {/* Búsqueda general */}
            <div>
              <label style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                Buscar estudiante:
              </label>
              <input
                type="text"
                placeholder="Nombre, RUT, email, carrera..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Filtro por estado */}
            <div>
              <label style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                Estado:
              </label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="todos">Todos los estudiantes</option>
                <option value="activos">Solo activos</option>
                <option value="inactivos">Solo inactivos</option>
              </select>
            </div>

            {/* Filtro por institución */}
            <div>
              <label style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                Institución:
              </label>
              <select
                value={filtroInstitucion}
                onChange={(e) => setFiltroInstitucion(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="todas">Todas las instituciones</option>
                {instituciones.map(inst => (
                  <option key={inst} value={inst}>{inst}</option>
                ))}
              </select>
            </div>

            {/* Filtro por región */}
            <div>
              <label style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                Región:
              </label>
              <select
                value={filtroRegion}
                onChange={(e) => setFiltroRegion(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="todas">Todas las regiones</option>
                {regiones.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* Filtro por beca */}
            <div>
              <label style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                Becas:
              </label>
              <select
                value={filtroBeca}
                onChange={(e) => setFiltroBeca(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="todas">Todas las becas</option>
                <option value="con_beca">Con beca</option>
                <option value="sin_beca">Sin beca</option>
              </select>
            </div>

            {/* Ordenar por */}
            <div>
              <label style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                Ordenar por:
              </label>
              <select
                value={ordenarPor}
                onChange={(e) => setOrdenarPor(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="nombre">Nombre (A-Z)</option>
                <option value="promedio">Promedio (mayor)</option>
                <option value="semestre">Semestre (mayor)</option>
              </select>
            </div>
          </div>

          {/* Botón limpiar filtros y resultados */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => {
                setBusqueda('');
                setFiltroEstado('todos');
                setFiltroInstitucion('todas');
                setFiltroRegion('todas');
                setFiltroBeca('todas');
                setOrdenarPor('nombre');
              }}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                backgroundColor: '#f9fafb',
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontWeight: '500',
                color: '#374151'
              }}
            >
              🗑️ Limpiar filtros
            </button>

            <div style={{ 
              padding: '0.75rem 1rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              <strong>{estudiantesOrdenados.length}</strong> estudiante(s) encontrado(s)
              {busqueda && (
                <span> • Búsqueda: "{busqueda}"</span>
              )}
            </div>
          </div>
        </div>

        {/* Lista de estudiantes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem'
        }}>
          {estudiantesOrdenados.map(estudiante => (
            <div
              key={estudiante.id}
              onClick={() => navigate(`/estudiante/${estudiante.id}`)}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Status indicator */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: estudiante.estado ? '#10b981' : '#ef4444'
              }}></div>

              {/* Header con foto y nombre */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#374151'
                }}>
                  {(estudiante.nombres + ' ' + estudiante.apellidos).split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    margin: 0,
                    color: '#111827'
                  }}>
                    {estudiante.nombres} {estudiante.apellidos}
                  </h3>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280', 
                    margin: '0.25rem 0 0 0'
                  }}>
                    RUT: {estudiante.rut}
                  </p>
                </div>
              </div>

              {/* Información académica */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: '0.875rem' }}>📚</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{estudiante.carrera}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  <span>Semestre: {estudiante.semestre}°</span>
                  <span style={{ 
                    color: estudiante.promedio >= 5.5 ? '#10b981' : 
                           estudiante.promedio >= 4.0 ? '#f59e0b' : '#ef4444',
                    fontWeight: '500'
                  }}>
                    Promedio: {estudiante.promedio}
                  </span>
                </div>
              </div>

              {/* Información institucional */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: '0.875rem' }}>🏫</span>
                  <span style={{ 
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    {estudiante.institucion.nombre_institucion}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  <span>📍</span>
                  <span>{estudiante.region}, {estudiante.ciudad}</span>
                </div>
              </div>

              {/* Información adicional */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {estudiante.beca !== 'Sin beca' && (
                    <span style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      🎓 {estudiante.beca.length > 15 ? 'Beca' : estudiante.beca}
                    </span>
                  )}
                  <span style={{
                    backgroundColor: estudiante.estado ? '#d1fae5' : '#fee2e2',
                    color: estudiante.estado ? '#065f46' : '#991b1b',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {estudiante.estado ? '✅ Activo' : '⏸️ Inactivo'}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>
                  <span>📧</span>
                  <span>{estudiante.email.split('@')[0]}...</span>
                </div>
              </div>

              {/* Hover indicator */}
              <div style={{
                position: 'absolute',
                bottom: '0.5rem',
                right: '0.5rem',
                fontSize: '0.75rem',
                color: '#9ca3af',
                opacity: '0.7'
              }}>
                Click para ver detalles →
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje cuando no hay resultados */}
        {estudiantesOrdenados.length === 0 && (
          <div style={{
            backgroundColor: 'white',
            padding: '3rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            textAlign: 'center' as const
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
              No se encontraron estudiantes
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Intenta ajustar los filtros de búsqueda o limpiar todos los filtros.
            </p>
            <button
              onClick={() => {
                setBusqueda('');
                setFiltroEstado('todos');
                setFiltroInstitucion('todas');
                setFiltroRegion('todas');
                setFiltroBeca('todas');
                setOrdenarPor('nombre');
              }}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: '#3b82f6',
                color: 'white',
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};