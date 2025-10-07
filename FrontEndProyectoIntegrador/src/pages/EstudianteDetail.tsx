import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/authService';

// Datos de estudiantes - exactamente los mismos que en GeneracionView
const estudiantes = [
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
];

export const EstudianteDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const estudiante = estudiantes.find(e => e.id === parseInt(id || '0'));

  const handleActualizarDatos = () => {
    setMostrarFormulario(true);
  };

  const handleIngresarEntrevista = () => {
    alert('La funcionalidad de entrevistas se implementará en la siguiente fase.');
  };

  if (!estudiante) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Estudiante no encontrado</h2>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

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
            onClick={() => navigate(-1)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            ← Volver
          </button>
          <h1 style={{ margin: 0 }}>Ficha del Estudiante</h1>
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
        
        {/* Información Personal */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                👤
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', margin: 0, marginBottom: '0.5rem' }}>
                  {estudiante.nombres} {estudiante.apellidos}
                </h2>
                <p style={{ margin: 0, opacity: 0.9 }}>
                  {estudiante.carrera} • {estudiante.universidad}
                </p>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  backgroundColor: estudiante.estado === 'Estudiando' ? '#10b981' : '#ef4444',
                  color: 'white',
                  fontSize: '0.875rem'
                }}>
                  {estudiante.estado}
                </span>
              </div>
            </div>
          </div>

          {/* Datos Personales */}
          <div style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>📋 Datos Personales</h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              <div>
                <label style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block' }}>Nombre</label>
                <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>
                  {estudiante.nombres} {estudiante.apellidos}
                </p>
              </div>
              
              <div>
                <label style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block' }}>RUT</label>
                <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>{estudiante.rut}</p>
              </div>
              
              <div>
                <label style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block' }}>Teléfono</label>
                <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>{estudiante.telefono}</p>
              </div>
              
              <div>
                <label style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block' }}>Fecha de Nacimiento</label>
                <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>
                  {new Date(estudiante.fecha_nacimiento).toLocaleDateString('es-CL')}
                </p>
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block' }}>Dirección</label>
                <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>{estudiante.direccion}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '2rem'
        }}>
          <h3 style={{ marginBottom: '1.5rem' }}>⚡ Acciones</h3>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleActualizarDatos}
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              📝 Actualizar Datos
            </button>
            
            <button
              onClick={handleIngresarEntrevista}
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              💬 Ingresar a Entrevista
            </button>
          </div>
        </div>

        {/* Modal */}
        {mostrarFormulario && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.5rem',
              maxWidth: '400px',
              width: '90%'
            }}>
              <h3>📝 Actualizar Datos</h3>
              <p style={{ color: '#6b7280' }}>
                Esta funcionalidad se implementará en la siguiente fase del proyecto.
              </p>
              <button
                onClick={() => setMostrarFormulario(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};