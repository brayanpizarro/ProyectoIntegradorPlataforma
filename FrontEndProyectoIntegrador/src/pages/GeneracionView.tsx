import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { Estudiante } from '../types';

// Datos mock de estudiantes por generación - actualizados con todos los campos
const estudiantesPorGeneracion: { [key: number]: Estudiante[] } = {
  2024: [
    {
      id: 1,
      nombres: 'Juan Carlos',
      apellidos: 'González Pérez',
      rut: '12.345.678-9',
      email: 'juan.gonzalez@email.com',
      telefono: '+56 9 8765 4321',
      direccion: 'Av. Principal 123, Santiago',
      fecha_nacimiento: '1998-05-15',
      institucion: { nombre_institucion: 'Universidad de Chile' },
      estado: 'Estudiando',
      año_generacion: 2024,
      carrera: 'Ingeniería Civil',
      liceo: 'Liceo A-1 de Santiago',
      especialidad: 'Científico-Humanista',
      promedio_liceo: 6.5,
      universidad: 'Universidad de Chile',
      duracion_carrera: '6 años',
      via_acceso: 'PSU',
      semestre: 6,
      promedio: 6.2,
      beca: 'Beca de Excelencia Académica',
      region: 'Metropolitana'
    },
    {
      id: 2,
      nombres: 'María Elena',
      apellidos: 'Rodríguez Silva',
      rut: '13.456.789-0',
      email: 'maria.rodriguez@email.com',
      telefono: '+56 9 7654 3210',
      direccion: 'Calle Secundaria 456, Valparaíso',
      fecha_nacimiento: '1999-03-22',
      institucion: { nombre_institucion: 'Pontificia Universidad Católica' },
      estado: 'Estudiando',
      año_generacion: 2024,
      carrera: 'Medicina',
      liceo: 'Carmela Carvajal',
      especialidad: 'Científico',
      promedio_liceo: 6.8,
      universidad: 'Pontificia Universidad Católica',
      duracion_carrera: '7 años',
      via_acceso: 'PSU',
      semestre: 8,
      promedio: 6.8,
      beca: 'Beca Socioeconómica',
      region: 'Valparaíso'
    },
    {
      id: 3,
      nombres: 'Pedro Antonio',
      apellidos: 'Martínez López',
      rut: '14.567.890-1',
      email: 'pedro.martinez@email.com',
      telefono: '+56 9 6543 2109',
      direccion: 'Pasaje Tercero 789, Concepción',
      fecha_nacimiento: '1997-11-08',
      institucion: { nombre_institucion: 'Universidad de Concepción' },
      estado: 'Retirado',
      año_generacion: 2024,
      carrera: 'Psicología',
      liceo: 'Liceo Enrique Molina',
      especialidad: 'Humanista',
      promedio_liceo: 6.0,
      universidad: 'Universidad de Concepción',
      duracion_carrera: '5 años',
      via_acceso: 'PSU',
      semestre: 4,
      promedio: 5.8,
      beca: 'Sin beca',
      region: 'Biobío'
    }
  ],
  2023: [
    {
      id: 4,
      nombres: 'Ana Sofía',
      apellidos: 'López García',
      rut: '15.678.901-2',
      email: 'ana.lopez@email.com',
      telefono: '+56 9 5432 1098',
      direccion: 'Calle Libertad 321, Santiago',
      fecha_nacimiento: '1999-08-12',
      institucion: { nombre_institucion: 'Universidad de Chile' },
      estado: 'Estudiando',
      año_generacion: 2023,
      carrera: 'Derecho',
      liceo: 'Liceo Gabriela Mistral',
      especialidad: 'Humanista',
      promedio_liceo: 6.7,
      universidad: 'Universidad de Chile',
      duracion_carrera: '5 años',
      via_acceso: 'PSU',
      semestre: 7,
      promedio: 6.5,
      beca: 'Beca de Excelencia Académica',
      region: 'Metropolitana'
    },
    {
      id: 5,
      nombres: 'Carlos Alberto',
      apellidos: 'Hernández Soto',
      rut: '16.789.012-3',
      email: 'carlos.hernandez@email.com',
      telefono: '+56 9 4321 0987',
      direccion: 'Av. España 456, Valparaíso',
      fecha_nacimiento: '1998-12-03',
      institucion: { nombre_institucion: 'Pontificia Universidad Católica' },
      estado: 'Egresado',
      año_generacion: 2023,
      carrera: 'Arquitectura',
      liceo: 'Liceo de Valparaíso',
      especialidad: 'Artístico',
      promedio_liceo: 6.4,
      universidad: 'Pontificia Universidad Católica',
      duracion_carrera: '6 años',
      via_acceso: 'PSU',
      semestre: 12,
      promedio: 6.3,
      beca: 'Sin beca',
      region: 'Valparaíso'
    }
  ],
  2022: [
    {
      id: 6,
      nombres: 'Valentina Isabel',
      apellidos: 'Morales Castro',
      rut: '17.890.123-4',
      email: 'valentina.morales@email.com',
      telefono: '+56 9 3210 9876',
      direccion: 'Av. Los Pinos 789, Concepción',
      fecha_nacimiento: '1999-06-18',
      institucion: { nombre_institucion: 'Universidad de Concepción' },
      estado: 'Egresado',
      año_generacion: 2022,
      carrera: 'Enfermería',
      liceo: 'Liceo Bicentenario',
      especialidad: 'Científico',
      promedio_liceo: 6.6,
      universidad: 'Universidad de Concepción',
      duracion_carrera: '5 años',
      via_acceso: 'PSU',
      semestre: 10,
      promedio: 6.7,
      beca: 'Beca Socioeconómica',
      region: 'Biobío'
    }
  ],
  2021: [
    {
      id: 7,
      nombres: 'Diego Alejandro',
      apellidos: 'Vargas Ruiz',
      rut: '18.901.234-5',
      email: 'diego.vargas@email.com',
      telefono: '+56 9 2109 8765',
      direccion: 'Calle Nueva 456, Valparaíso',
      fecha_nacimiento: '1998-04-25',
      institucion: { nombre_institucion: 'Universidad Técnica Federico Santa María' },
      estado: 'Egresado',
      año_generacion: 2021,
      carrera: 'Ingeniería Informática',
      liceo: 'Liceo Industrial',
      especialidad: 'Técnico Profesional',
      promedio_liceo: 6.3,
      universidad: 'Universidad Técnica Federico Santa María',
      duracion_carrera: '5 años',
      via_acceso: 'PSU',
      semestre: 10,
      promedio: 6.4,
      beca: 'Beca de Excelencia Académica',
      region: 'Valparaíso'
    }
  ]
};

export const GeneracionView = () => {
  const navigate = useNavigate();
  const { año } = useParams();
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'estudiando' | 'egresado' | 'retirado'>('todos');
  const [filtroCarrera, setFiltroCarrera] = useState('todas');
  const [filtroBeca, setFiltroBeca] = useState<'todas' | 'con-beca' | 'sin-beca'>('todas');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  // Obtener estudiantes de la generación actual
  const añoActual = parseInt(año || '2024');
  const estudiantesGeneracion = estudiantesPorGeneracion[añoActual] || [];

  // Obtener carreras únicas para el filtro
  const carrerasUnicas = [...new Set(estudiantesGeneracion.map(e => e.carrera))];

  // Filtrar estudiantes
  const estudiantesFiltrados = estudiantesGeneracion.filter(estudiante => {
    const coincideBusqueda = 
      estudiante.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
      estudiante.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
      estudiante.rut.includes(busqueda) ||
      estudiante.carrera.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado = filtroEstado === 'todos' || 
      estudiante.estado.toLowerCase() === filtroEstado.toLowerCase();

    const coincideCarrera = filtroCarrera === 'todas' || estudiante.carrera === filtroCarrera;

    const coincideBeca = filtroBeca === 'todas' || 
      (filtroBeca === 'con-beca' && estudiante.beca !== 'Sin beca') ||
      (filtroBeca === 'sin-beca' && estudiante.beca === 'Sin beca');

    return coincideBusqueda && coincideEstado && coincideCarrera && coincideBeca;
  });

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroEstado('todos');
    setFiltroCarrera('todas');
    setFiltroBeca('todas');
  };

  const handleAgregarEstudiante = () => {
    alert('La funcionalidad de agregar estudiante se implementará en la siguiente fase.');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            ← Volver al Dashboard
          </button>
          <h1 style={{ margin: 0 }}>Generación {año}</h1>
        </div>
        
        <button
          onClick={() => {
            authService.logout();
            navigate('/');
          }}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Estadísticas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '2rem', margin: 0, color: '#3b82f6' }}>
              {estudiantesFiltrados.length}
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>Estudiantes Encontrados</p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '2rem', margin: 0, color: '#10b981' }}>
              {estudiantesFiltrados.filter(e => e.estado === 'Estudiando').length}
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>Estudiando</p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '2rem', margin: 0, color: '#f59e0b' }}>
              {estudiantesFiltrados.filter(e => e.estado === 'Egresado').length}
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>Egresados</p>
          </div>
        </div>

        {/* Filtros */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>🔍 Filtros y Búsqueda</h3>
            <button
              onClick={handleAgregarEstudiante}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              ➕ Agregar Estudiante
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <input
              type="text"
              placeholder="Buscar por nombre, RUT o carrera..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as any)}
              style={{
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            >
              <option value="todos">Todos los estados</option>
              <option value="estudiando">Estudiando</option>
              <option value="egresado">Egresado</option>
              <option value="retirado">Retirado</option>
            </select>

            <select
              value={filtroCarrera}
              onChange={(e) => setFiltroCarrera(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            >
              <option value="todas">Todas las carreras</option>
              {carrerasUnicas.map(carrera => (
                <option key={carrera} value={carrera}>{carrera}</option>
              ))}
            </select>

            <select
              value={filtroBeca}
              onChange={(e) => setFiltroBeca(e.target.value as any)}
              style={{
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            >
              <option value="todas">Todas las becas</option>
              <option value="con-beca">Con beca</option>
              <option value="sin-beca">Sin beca</option>
            </select>
          </div>

          <button
            onClick={limpiarFiltros}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            🔄 Limpiar Filtros
          </button>
        </div>

        {/* Tabla de Estudiantes */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: 0 }}>👥 Estudiantes de la Generación {año}</h3>
          </div>

          {estudiantesFiltrados.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
              <p>No se encontraron estudiantes que coincidan con los filtros.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Nombre</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>RUT</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Carrera</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Estado</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Promedio</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantesFiltrados.map((estudiante) => (
                    <tr key={estudiante.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: '500' }}>
                            {estudiante.nombres} {estudiante.apellidos}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {estudiante.email}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>{estudiante.rut}</td>
                      <td style={{ padding: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: '500' }}>{estudiante.carrera}</div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {estudiante.universidad}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          backgroundColor: 
                            estudiante.estado === 'Estudiando' ? '#dcfce7' :
                            estudiante.estado === 'Egresado' ? '#fef3c7' : '#fee2e2',
                          color:
                            estudiante.estado === 'Estudiando' ? '#166534' :
                            estudiante.estado === 'Egresado' ? '#92400e' : '#991b1b'
                        }}>
                          {estudiante.estado}
                        </span>
                      </td>
                      <td style={{ 
                        padding: '1rem',
                        fontWeight: '500',
                        color: estudiante.promedio >= 6.0 ? '#10b981' : '#ef4444'
                      }}>
                        {estudiante.promedio}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button
                          onClick={() => navigate(`/estudiante/${estudiante.id}`)}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                          }}
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};