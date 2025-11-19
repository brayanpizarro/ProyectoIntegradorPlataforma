import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { encontrarEstudiantePorId } from '../data/mockData';
import { apiService } from '../services/apiService';
import type { Estudiante } from '../types';

type SeccionActiva = 'perfil' | 'personal' | 'familiar' | 'informe' | 'desempeno' | 'entrevistas';

const EstudianteDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [seccionActiva, setSeccionActiva] = useState<SeccionActiva>('perfil');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [loading, setLoading] = useState(true);
  const [datosEditados, setDatosEditados] = useState<any>({}); // Para guardar cambios temporales
  const [mostrarModalNuevaEntrevista, setMostrarModalNuevaEntrevista] = useState(false);
  const [mostrarModalSemestresAnteriores, setMostrarModalSemestresAnteriores] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/');
      return;
    }
    
    const fetchEstudiante = async () => {
      try {
        setLoading(true);
        const data = await apiService.getEstudianteById(id || '');
        setEstudiante(data);
      } catch (error) {
        console.log('Backend no disponible, usando datos mock');
        const mockData = encontrarEstudiantePorId(id || '');
        if (mockData) {
          setEstudiante(mockData as any);
        } else {
          setEstudiante(null);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchEstudiante();
  }, [navigate, id]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Cargando datos del estudiante...</h2>
      </div>
    );
  }

  if (!estudiante) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Estudiante no encontrado</h2>
        <button 
          onClick={() => navigate(-1)}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Volver
        </button>
      </div>
    );
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Activo': return '#4CAF50';
      case 'Egresado': return '#2196F3';
      case 'Suspendido': return '#FF9800';
      case 'Desertor': return '#f44336';
      case 'Congelado': return '#9E9E9E';
      default: return '#4CAF50';
    }
  };

  const tabs = [
    { id: 'perfil' as SeccionActiva, label: 'Perfil' },
    { id: 'personal' as SeccionActiva, label: 'Datos Personales' },
    { id: 'familiar' as SeccionActiva, label: 'Información Familiar' },
    { id: 'informe' as SeccionActiva, label: 'Informe Académico General' },
    { id: 'desempeno' as SeccionActiva, label: 'Desempeño por Semestre' },
    { id: 'entrevistas' as SeccionActiva, label: 'Entrevistas' },
  ];

  const estilos = {
    tituloSeccion: {
      backgroundColor: '#10b981',
      color: 'white',
      padding: '0.75rem',
      fontSize: '1.125rem',
      fontWeight: '700',
      textAlign: 'center' as const,
      margin: 0,
      borderRadius: '0.375rem 0.375rem 0 0',
    },
    tabla: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      border: '1px solid #d1d5db',
      marginBottom: '1.5rem',
    },
    celdaLabel: {
      backgroundColor: '#fee2e2',
      padding: '0.75rem',
      fontWeight: '600',
      border: '1px solid #d1d5db',
      width: '35%',
      verticalAlign: 'top' as const,
    },
    celdaValor: {
      backgroundColor: 'white',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
    },
    encabezadoTabla: {
      backgroundColor: '#10b981',
      color: 'white',
      padding: '0.5rem',
      fontWeight: '600',
      border: '1px solid #d1d5db',
      textAlign: 'center' as const,
    },
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{ backgroundColor: 'white', padding: '1rem 2rem', borderBottom: '2px solid #e5e7eb', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => navigate(-1)} style={{ padding: '0.5rem 1rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem' }}>
              Volver
            </button>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#1f2937', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {estudiante.nombres} {estudiante.apellidos}
              <span style={{ 
                padding: '0.25rem 0.75rem', 
                backgroundColor: getEstadoColor(estudiante.estado || 'Activo'), 
                color: 'white', 
                borderRadius: '0.375rem', 
                fontSize: '0.875rem', 
                fontWeight: '600' 
              }}>
                {estudiante.estado || 'Activo'}
              </span>
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button 
              onClick={() => setModoEdicion(!modoEdicion)}
              style={{ padding: '0.625rem 1.25rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}
            >
              {modoEdicion ? '👁️ Modo Vista' : '✏️ Modo Edición'}
            </button>
            {modoEdicion && (
              <button style={{ padding: '0.625rem 1.25rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}>
                💾 Guardar
              </button>
            )}
            <button style={{ padding: '0.625rem 1.25rem', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}>
              📁 Guardar Semestre
            </button>
            <button 
              onClick={() => setMostrarModalSemestresAnteriores(true)}
              style={{ padding: '0.625rem 1.25rem', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}
            >
              📚 Ver Semestres Anteriores
            </button>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {tabs.map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setSeccionActiva(tab.id)} 
              style={{ 
                padding: '1rem 1.5rem', 
                backgroundColor: seccionActiva === tab.id ? 'white' : 'transparent', 
                color: seccionActiva === tab.id ? '#10b981' : '#6b7280', 
                border: 'none', 
                borderBottom: seccionActiva === tab.id ? '2px solid #10b981' : '2px solid transparent', 
                cursor: 'pointer', 
                fontSize: '0.875rem', 
                fontWeight: seccionActiva === tab.id ? '600' : '400', 
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        {seccionActiva === 'perfil' && (
          <div>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '0.75rem', 
              padding: '2rem', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem', alignItems: 'start' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: '180px', 
                    height: '180px', 
                    borderRadius: '50%', 
                    backgroundColor: '#e5e7eb', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '4rem',
                    color: '#6b7280',
                    marginBottom: '1rem'
                  }}>
                    👤
                  </div>
                  <div style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: getEstadoColor(estudiante.estado || 'Activo'), 
                    color: 'white', 
                    borderRadius: '0.5rem', 
                    fontWeight: '600',
                    fontSize: '1rem'
                  }}>
                    {estudiante.estado || 'Activo'}
                  </div>
                </div>

                <div>
                  <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>
                    {estudiante.nombres} {estudiante.apellidos}
                  </h2>
                  <p style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', color: '#6b7280' }}>
                    RUT: {estudiante.rut}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Carrera</div>
                      <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>{estudiante.carrera || 'No especificado'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Universidad</div>
                      <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>{estudiante.universidad || 'No especificado'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Promedio General</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>{estudiante.promedio || '0.0'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Total Entrevistas (2025)</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6' }}>2</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Teléfono</div>
                      <div style={{ fontSize: '1rem', fontWeight: '500', color: '#1f2937' }}>{estudiante.telefono || 'No especificado'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Año Ingreso Beca</div>
                      <div style={{ fontSize: '1rem', fontWeight: '500', color: '#1f2937' }}>{estudiante.año_generacion || '2019'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Semestre Actual</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1f2937' }}>{estudiante.semestre || 7}</div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Ramos Aprobados</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#10b981' }}>43</div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Ramos Reprobados</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#f44336' }}>0</div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>% Aprobación</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#10b981' }}>100%</div>
              </div>
            </div>
          </div>
        )}

        {seccionActiva === 'personal' && (
          <div>
            <h2 style={estilos.tituloSeccion}>Datos Personales</h2>
            <table style={estilos.tabla}>
              <tbody>
                <tr>
                  <td style={estilos.celdaLabel}>Nombre</td>
                  <td style={estilos.celdaValor}>
                    {modoEdicion ? (
                      <input 
                        type="text" 
                        defaultValue={`${estudiante.nombres} ${estudiante.apellidos}`}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <span>{estudiante.nombres} {estudiante.apellidos}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Rut</td>
                  <td style={estilos.celdaValor}>
                    {modoEdicion ? (
                      <input 
                        type="text" 
                        defaultValue={estudiante.rut}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <span>{estudiante.rut}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Teléfono</td>
                  <td style={estilos.celdaValor}>
                    {modoEdicion ? (
                      <input 
                        type="text" 
                        defaultValue={estudiante.telefono || ''}
                        placeholder="No especificado"
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <span>{estudiante.telefono || 'No especificado'}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Año Ingreso Beca</td>
                  <td style={estilos.celdaValor}>
                    {modoEdicion ? (
                      <input 
                        type="text" 
                        defaultValue={estudiante.año_generacion || '2019'}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <span>{estudiante.año_generacion || '2019'}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Fecha de Nacimiento</td>
                  <td style={estilos.celdaValor}>
                    {modoEdicion ? (
                      <input 
                        type="date" 
                        defaultValue={typeof estudiante.fecha_de_nacimiento === 'string' ? estudiante.fecha_de_nacimiento : ''}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <span>{typeof estudiante.fecha_de_nacimiento === 'string' ? new Date(estudiante.fecha_de_nacimiento).toLocaleDateString('es-CL') : 'No especificado'}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Liceo</td>
                  <td style={estilos.celdaValor}>
                    {modoEdicion ? (
                      <input 
                        type="text" 
                        defaultValue={estudiante.liceo || ''}
                        placeholder="No especificado"
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <span>{estudiante.liceo || 'No especificado'}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Especialidad</td>
                  <td style={estilos.celdaValor}>
                    {modoEdicion ? (
                      <input 
                        type="text" 
                        defaultValue={estudiante.especialidad || ''}
                        placeholder="No especificado"
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <span>{estudiante.especialidad || 'No especificado'}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Comuna Liceo</td>
                  <td style={estilos.celdaValor}>
                    {modoEdicion ? (
                      <input 
                        type="text" 
                        defaultValue={estudiante.region || ''}
                        placeholder="No especificado"
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <span>{estudiante.region || 'No especificado'}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Promedios Enseñanza Media</td>
                  <td style={estilos.celdaValor}>
                    {modoEdicion ? (
                      <input 
                        type="text" 
                        defaultValue={estudiante.promedio_liceo || ''}
                        placeholder="No especificado"
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <span>{estudiante.promedio_liceo || 'No especificado'}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Puntajes PAES 2021/1|2</td>
                  <td style={estilos.celdaValor}>
                    {modoEdicion ? (
                      <input 
                        type="text" 
                        placeholder="No especificado"
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <span>No especificado</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Carrera</td>
                  <td style={estilos.celdaValor}>
                    {modoEdicion ? (
                      <input 
                        type="text" 
                        defaultValue={estudiante.carrera || ''}
                        placeholder="No especificado"
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <span>{estudiante.carrera || 'No especificado'}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Duración Carrera</td>
                  <td style={estilos.celdaValor}>
                    {modoEdicion ? (
                      <input 
                        type="text" 
                        defaultValue={estudiante.duracion_carrera || ''}
                        placeholder="No especificado"
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <span>{estudiante.duracion_carrera || 'No especificado'}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Universidad</td>
                  <td style={estilos.celdaValor}>
                    {modoEdicion ? (
                      <input 
                        type="text" 
                        defaultValue={estudiante.universidad || ''}
                        placeholder="No especificado"
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <span>{estudiante.universidad || 'No especificado'}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Vía de acceso</td>
                  <td style={estilos.celdaValor}>
                    {modoEdicion ? (
                      <input 
                        type="text" 
                        defaultValue={estudiante.via_acceso || ''}
                        placeholder="No especificado"
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <span>{estudiante.via_acceso || 'No especificado'}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Trayectoria Académica</td>
                  <td style={estilos.celdaValor}>
                    {modoEdicion ? (
                      <input 
                        type="text" 
                        defaultValue={`Ingresa en ${estudiante.año_generacion || '2022'}/1S`}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <span>Ingresa en {estudiante.año_generacion || '2022'}/1S</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Otros Beneficios</td>
                  <td style={estilos.celdaValor}>
                    {modoEdicion ? (
                      <input 
                        type="text" 
                        defaultValue={estudiante.beca || ''}
                        placeholder="No especificado"
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <span>{estudiante.beca || 'No especificado'}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Vencimiento Gratuidad</td>
                  <td style={estilos.celdaValor}>
                    {modoEdicion ? (
                      <input 
                        type="date" 
                        placeholder="No especificado"
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <span>No especificado</span>
                    )}
                  </td>
                </tr>
                {['2022/1S', '2022/2S', '2023/1S', '2023/2S', '2024/1S', '2024/2S', '2025/1S', '2025/2S'].map((semestre) => (
                  <tr key={semestre}>
                    <td style={estilos.celdaLabel}>Status {semestre}</td>
                    <td style={estilos.celdaValor}>
                      {modoEdicion ? (
                        <select 
                          defaultValue={estudiante.estado || 'Activo'}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontFamily: 'inherit' }}
                        >
                          <option value="Activo">Activo</option>
                          <option value="Egresado">Egresado</option>
                          <option value="Suspendido">Suspendido</option>
                          <option value="Desertor">Desertor</option>
                          <option value="Congelado">Congelado</option>
                        </select>
                      ) : (
                        <span>{estudiante.estado || 'Activo'}</span>
                      )}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td style={estilos.celdaLabel}>Observaciones</td>
                  <td style={estilos.celdaValor}>
                    <textarea 
                      style={{ width: '100%', minHeight: '80px', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontFamily: 'inherit', resize: 'vertical' }}
                      placeholder="Agregar observaciones..."
                      disabled={!modoEdicion}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {seccionActiva === 'familiar' && (
          <div>
            <h2 style={estilos.tituloSeccion}>Información Familiar</h2>
            <table style={estilos.tabla}>
              <thead>
                <tr>
                  <th style={{ ...estilos.encabezadoTabla, width: '20%' }}>Familiar</th>
                  <th style={estilos.encabezadoTabla}>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={estilos.celdaLabel}>
                    <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>Mamá</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 'normal' }}>María (65 años)</div>
                  </td>
                  <td style={estilos.celdaValor}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <div><strong>2021.05.11:</strong> Conversan para organizarse con la ayuda que le entrega la Fundación.</div>
                      <div>Ha mejorado su relación con su mamá desde que ingresó a la beca.</div>
                      <div><strong>2022.09.02:</strong> Está enferma, pero ya se encuentra mejor.</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>
                    <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>Papá</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 'normal' }}>Pedro (61 años)</div>
                  </td>
                  <td style={estilos.celdaValor}>
                    <div style={{ fontSize: '0.875rem' }}>
                      <strong>2021.05.11:</strong> Vive fuera de la región, no tienen contacto directo.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>
                    <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>Hermanas/os</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 'normal' }}>Carlos (25); Pedro (18); María (11)</div>
                  </td>
                  <td style={estilos.celdaValor}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <div><strong>2021.05.11:</strong> Comparte habitación con sus hermanos menores.</div>
                      <div><strong>2022.05.04:</strong> Fue el cumpleaños de su hermana menor, organizaron una pequeña celebración.</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>
                    <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>Otros familiares significativos</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 'normal' }}>Abuela materna (Juana); Tío materno (Claudio)</div>
                  </td>
                  <td style={estilos.celdaValor}>
                    <div style={{ fontSize: '0.875rem' }}>
                      <strong>2024.11.23:</strong> Su tío llegó a vivir a su casa. Son muy cercanos y él le ayuda con sus estudios.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}><strong>Observaciones Generales</strong></td>
                  <td style={estilos.celdaValor}>
                    <textarea 
                      style={{ width: '100%', minHeight: '100px', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontFamily: 'inherit', resize: 'vertical' }}
                      placeholder="Agregar observaciones generales sobre la familia..."
                      disabled={!modoEdicion}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {seccionActiva === 'informe' && (
          <div>
            <h2 style={estilos.tituloSeccion}>Informe Académico General</h2>
            <div style={{ backgroundColor: '#fef3c7', padding: '0.5rem', textAlign: 'center', fontWeight: '600', marginBottom: '1rem', border: '1px solid #d1d5db', fontSize: '0.9rem' }}>
              Resumen académico (2024/1S)
            </div>

            <table style={{ ...estilos.tabla, marginBottom: '2rem' }}>
              <tbody>
                <tr>
                  <td style={{ ...estilos.celdaLabel, backgroundColor: '#fee2e2', width: '25%', textAlign: 'center', verticalAlign: 'middle' }} rowSpan={10}>
                    <div style={{ fontSize: '1.125rem', fontWeight: '700', padding: '1rem' }}>
                      {estudiante.nombres} {estudiante.apellidos}
                    </div>
                  </td>
                  <td style={estilos.celdaLabel}>Nº de carrera cursada</td>
                  <td style={estilos.celdaValor}>1</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Nº semestres finalizados</td>
                  <td style={estilos.celdaValor}>{estudiante.semestre || 7}</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Nº semestres suspendidos</td>
                  <td style={estilos.celdaValor}>0</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Nº semestres de carrera</td>
                  <td style={estilos.celdaValor}>{estudiante.duracion_carrera ? parseInt(estudiante.duracion_carrera) : 10}</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Total ramos aprobados</td>
                  <td style={estilos.celdaValor}>43</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Total ramos reprobados</td>
                  <td style={estilos.celdaValor}>0</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Total eliminados</td>
                  <td style={estilos.celdaValor}>0</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>% Ramos aprobados</td>
                  <td style={estilos.celdaValor}>100.0%</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>% Reprobados</td>
                  <td style={estilos.celdaValor}>0.0%</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>% Total cursados</td>
                  <td style={estilos.celdaValor}>100.0%</td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1f2937' }}>Detalle por año y semestre</h3>
            <table style={estilos.tabla}>
              <thead>
                <tr>
                  <th style={estilos.encabezadoTabla}>Año</th>
                  <th style={estilos.encabezadoTabla}>Semestre</th>
                  <th style={estilos.encabezadoTabla}>Nº Semestre Carrera</th>
                  <th style={estilos.encabezadoTabla}>Ramos Aprobados</th>
                  <th style={estilos.encabezadoTabla}>Ramos Reprobados</th>
                  <th style={estilos.encabezadoTabla}>Ramos Eliminados</th>
                  <th style={estilos.encabezadoTabla}>Total Ramos</th>
                  <th style={estilos.encabezadoTabla}>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { anio: 2021, sem: 1, nSem: 1, aprob: 6, reprob: 0, elim: 0, total: 6 },
                  { anio: 2021, sem: 2, nSem: 2, aprob: 6, reprob: 0, elim: 0, total: 6 },
                  { anio: 2022, sem: 1, nSem: 3, aprob: 6, reprob: 0, elim: 0, total: 6 },
                  { anio: 2022, sem: 2, nSem: 4, aprob: 6, reprob: 0, elim: 0, total: 6 },
                  { anio: 2023, sem: 1, nSem: 5, aprob: 6, reprob: 0, elim: 0, total: 6 },
                  { anio: 2023, sem: 2, nSem: 6, aprob: 6, reprob: 0, elim: 0, total: 6 },
                  { anio: 2024, sem: 1, nSem: 7, aprob: 6, reprob: 0, elim: 0, total: 6 },
                  { anio: 2024, sem: 2, nSem: 8, aprob: 7, reprob: 0, elim: 0, total: 7 },
                  { anio: 2025, sem: 1, nSem: 9, aprob: 0, reprob: 0, elim: 0, total: 0 },
                  { anio: 2025, sem: 2, nSem: 10, aprob: 0, reprob: 0, elim: 0, total: 0 },
                ].map((fila, idx) => (
                  <tr key={idx}>
                    <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>{fila.anio}</td>
                    <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>{fila.sem}</td>
                    <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>{fila.nSem}</td>
                    <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>{fila.aprob}</td>
                    <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>{fila.reprob}</td>
                    <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>{fila.elim}</td>
                    <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>{fila.total}</td>
                    <td style={estilos.celdaValor}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {seccionActiva === 'desempeno' && (
          <div>
            <h2 style={estilos.tituloSeccion}>Desempeño Académico por Semestre</h2>
            <div style={{ backgroundColor: '#fef3c7', padding: '0.5rem', textAlign: 'center', fontWeight: '600', marginBottom: '1rem', border: '1px solid #d1d5db', fontSize: '0.9rem' }}>
              Semestre 2025/1S
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <table style={estilos.tabla}>
                  <thead>
                    <tr>
                      <th style={{ ...estilos.encabezadoTabla, width: '5%' }}>Nº</th>
                      <th style={{ ...estilos.encabezadoTabla, width: '15%' }}>Ramo</th>
                      <th style={{ ...estilos.encabezadoTabla, width: '40%' }}>Comentarios</th>
                      <th style={{ ...estilos.encabezadoTabla, width: '12%' }}>Notas parciales</th>
                      <th style={{ ...estilos.encabezadoTabla, width: '10%' }}>Promedio final</th>
                      <th style={{ ...estilos.encabezadoTabla, width: '13%' }}>Aprobación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>1</td>
                      <td style={estilos.celdaValor}>
                        {modoEdicion ? (
                          <input type="text" defaultValue="Introducción al derecho" style={{ width: '100%', padding: '0.375rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '0.875rem' }} />
                        ) : (
                          'Introducción al derecho'
                        )}
                      </td>
                      <td style={estilos.celdaValor}>
                        {modoEdicion ? (
                          <textarea 
                            defaultValue="2025.03.15: Buen inicio de semestre&#10;2025.05.10: Estudió para la prueba"
                            style={{ width: '100%', minHeight: '120px', padding: '0.375rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '0.75rem', fontFamily: 'inherit', resize: 'vertical' }}
                            placeholder="Agregar comentarios..."
                          />
                        ) : (
                          <div style={{ fontSize: '0.75rem', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>2025.03.15: Buen inicio de semestre{'\n'}2025.05.10: Estudió para la prueba</div>
                        )}
                      </td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>
                        {modoEdicion ? (
                          <input type="text" defaultValue="5.1; 3.8; 4.0" style={{ width: '100%', padding: '0.375rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '0.875rem', textAlign: 'center' }} />
                        ) : (
                          '5.1; 3.8; 4.0'
                        )}
                      </td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>
                        {modoEdicion ? (
                          <input type="text" defaultValue="4.6" style={{ width: '100%', padding: '0.375rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '1rem', fontWeight: '600', textAlign: 'center' }} />
                        ) : (
                          <strong>4.6</strong>
                        )}
                      </td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center', backgroundColor: '#d1fae5', color: '#065f46', fontWeight: '600' }}>Aprobado</td>
                    </tr>
                    <tr>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>2</td>
                      <td style={estilos.celdaValor}>
                        {modoEdicion ? (
                          <input type="text" defaultValue="Derecho político" style={{ width: '100%', padding: '0.375rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '0.875rem' }} />
                        ) : (
                          'Derecho político'
                        )}
                      </td>
                      <td style={estilos.celdaValor}>
                        {modoEdicion ? (
                          <textarea 
                            defaultValue="Le fue bien en la primera prueba"
                            style={{ width: '100%', minHeight: '120px', padding: '0.375rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '0.75rem', fontFamily: 'inherit', resize: 'vertical' }}
                            placeholder="Agregar comentarios..."
                          />
                        ) : (
                          <div style={{ fontSize: '0.75rem', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>Le fue bien en la primera prueba</div>
                        )}
                      </td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>
                        {modoEdicion ? (
                          <input type="text" defaultValue="4.5; 2.1; 2.7" style={{ width: '100%', padding: '0.375rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '0.875rem', textAlign: 'center' }} />
                        ) : (
                          '4.5; 2.1; 2.7'
                        )}
                      </td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>
                        {modoEdicion ? (
                          <input type="text" defaultValue="3.1" style={{ width: '100%', padding: '0.375rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '1rem', fontWeight: '600', textAlign: 'center' }} />
                        ) : (
                          <strong>3.1</strong>
                        )}
                      </td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center', backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: '600' }}>Reprobado</td>
                    </tr>
                    <tr>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>3</td>
                      <td style={estilos.celdaValor}>
                        {modoEdicion ? (
                          <input type="text" defaultValue="Historia del derecho" style={{ width: '100%', padding: '0.375rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '0.875rem' }} />
                        ) : (
                          'Historia del derecho'
                        )}
                      </td>
                      <td style={estilos.celdaValor}>
                        {modoEdicion ? (
                          <textarea 
                            style={{ width: '100%', minHeight: '120px', padding: '0.375rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '0.75rem', fontFamily: 'inherit', resize: 'vertical' }}
                            placeholder="Agregar comentarios..."
                          />
                        ) : (
                          <div style={{ fontSize: '0.75rem', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}></div>
                        )}
                      </td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>
                        {modoEdicion ? (
                          <input type="text" defaultValue="5.5; 6.0; 5.8" style={{ width: '100%', padding: '0.375rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '0.875rem', textAlign: 'center' }} />
                        ) : (
                          '5.5; 6.0; 5.8'
                        )}
                      </td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>
                        {modoEdicion ? (
                          <input type="text" defaultValue="5.8" style={{ width: '100%', padding: '0.375rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '1rem', fontWeight: '600', textAlign: 'center' }} />
                        ) : (
                          <strong>5.8</strong>
                        )}
                      </td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center', backgroundColor: '#d1fae5', color: '#065f46', fontWeight: '600' }}>Aprobado</td>
                    </tr>
                    <tr>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>4</td>
                      <td style={estilos.celdaValor}>
                        {modoEdicion ? (
                          <input type="text" defaultValue="Derecho civil I" style={{ width: '100%', padding: '0.375rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '0.875rem' }} />
                        ) : (
                          'Derecho civil I'
                        )}
                      </td>
                      <td style={estilos.celdaValor}>
                        {modoEdicion ? (
                          <textarea 
                            style={{ width: '100%', minHeight: '120px', padding: '0.375rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '0.75rem', fontFamily: 'inherit', resize: 'vertical' }}
                            placeholder="Agregar comentarios..."
                          />
                        ) : (
                          <div style={{ fontSize: '0.75rem', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}></div>
                        )}
                      </td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>
                        {modoEdicion ? (
                          <input type="text" defaultValue="4.9; 5.2; 5.0" style={{ width: '100%', padding: '0.375rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '0.875rem', textAlign: 'center' }} />
                        ) : (
                          '4.9; 5.2; 5.0'
                        )}
                      </td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>
                        {modoEdicion ? (
                          <input type="text" defaultValue="5.0" style={{ width: '100%', padding: '0.375rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '1rem', fontWeight: '600', textAlign: 'center' }} />
                        ) : (
                          <strong>5.0</strong>
                        )}
                      </td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center', backgroundColor: '#d1fae5', color: '#065f46', fontWeight: '600' }}>Aprobado</td>
                    </tr>
                    <tr>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>5</td>
                      <td style={estilos.celdaValor}></td>
                      <td style={estilos.celdaValor}></td>
                      <td style={estilos.celdaValor}></td>
                      <td style={estilos.celdaValor}></td>
                      <td style={estilos.celdaValor}></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <div style={{ backgroundColor: '#dbeafe', padding: '1rem', borderRadius: '0.375rem', border: '1px solid #93c5fd' }}>
                  <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', fontWeight: '700', color: '#1e40af', textAlign: 'center' }}>Resumen Final Ramos</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid #bfdbfe' }}>
                      <span>Total inscritos:</span>
                      <strong>4</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid #bfdbfe' }}>
                      <span>Total aprobados:</span>
                      <strong style={{ color: '#065f46' }}>3</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid #bfdbfe' }}>
                      <span>Total reprobados:</span>
                      <strong style={{ color: '#991b1b' }}>1</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                      <span>Total eliminados:</span>
                      <strong>0</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de Comentarios - Layout Vertical con más espacio */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
              <div>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: '700', backgroundColor: '#e0e7ff', padding: '0.75rem', borderRadius: '0.375rem', textAlign: 'center', color: '#1e40af' }}>
                  📝 Comentarios Generales del Semestre
                </h4>
                {modoEdicion ? (
                  <textarea 
                    defaultValue="2025.09.04: Le cuesta organizar sus tiempos para estudiar.&#10;2025.10.11: Está asistiendo a apoyo psicopedagógico."
                    style={{ width: '100%', minHeight: '100px', padding: '1rem', border: '2px solid #d1d5db', borderRadius: '0.375rem', fontFamily: 'inherit', fontSize: '0.875rem', lineHeight: '1.6', resize: 'vertical' }}
                    placeholder="Agregar comentarios generales sobre el desempeño del semestre..."
                  />
                ) : (
                  <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', backgroundColor: '#f9fafb', minHeight: '100px', fontSize: '0.875rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    2025.09.04: Le cuesta organizar sus tiempos para estudiar.
                    2025.10.11: Está asistiendo a apoyo psicopedagógico.
                  </div>
                )}
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: '700', backgroundColor: '#fef3c7', padding: '0.75rem', borderRadius: '0.375rem', textAlign: 'center', color: '#92400e' }}>
                  ⚠️ Principales Dificultades / Desafíos
                </h4>
                {modoEdicion ? (
                  <textarea 
                    defaultValue="Mantener buena asistencia a clases tempranas. Gestión del tiempo de estudio."
                    style={{ width: '100%', minHeight: '100px', padding: '1rem', border: '2px solid #d1d5db', borderRadius: '0.375rem', fontFamily: 'inherit', fontSize: '0.875rem', lineHeight: '1.6', resize: 'vertical' }}
                    placeholder="Describir las principales dificultades o desafíos que enfrenta el estudiante..."
                  />
                ) : (
                  <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', backgroundColor: '#f9fafb', minHeight: '100px', fontSize: '0.875rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    Mantener buena asistencia a clases tempranas. Gestión del tiempo de estudio.
                  </div>
                )}
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: '700', backgroundColor: '#d1fae5', padding: '0.75rem', borderRadius: '0.375rem', textAlign: 'center', color: '#065f46' }}>
                  🎯 Principales Aprendizajes / Logros
                </h4>
                {modoEdicion ? (
                  <textarea 
                    style={{ width: '100%', minHeight: '100px', padding: '1rem', border: '2px solid #d1d5db', borderRadius: '0.375rem', fontFamily: 'inherit', fontSize: '0.875rem', lineHeight: '1.6', resize: 'vertical' }}
                    placeholder="Destacar los logros y aprendizajes más importantes del semestre..."
                  />
                ) : (
                  <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', backgroundColor: '#f9fafb', minHeight: '100px', fontSize: '0.875rem', lineHeight: '1.6', fontStyle: 'italic', color: '#9ca3af' }}>
                    Sin registro
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {seccionActiva === 'entrevistas' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>📋 Historial de Entrevistas</h2>
              <button 
                onClick={() => setMostrarModalNuevaEntrevista(true)}
                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
              >
                ➕ Nueva Entrevista
              </button>
            </div>

            {/* Dashboard de Entrevistas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '2rem' }}>📊</div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Entrevistas 2025</div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>2</div>
                  </div>
                </div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '2rem' }}>📅</div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Última Entrevista</div>
                    <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>15/03/2025</div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Hace 5 días</div>
                  </div>
                </div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '2rem' }}>👥</div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Entrevistadores</div>
                    <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>María G., Pedro R.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards de Entrevistas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Entrevista 1 */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937' }}>📝 Entrevista - 15/03/2025</div>
                      <span style={{ padding: '0.25rem 0.75rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: '600' }}>Reciente</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                      <strong>Entrevistador:</strong> María González
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/entrevista/${id}`)}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}
                  >
                    Ver Detalle →
                  </button>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>Temas Tratados:</div>
                  <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>Rendimiento académico, adaptación al semestre</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>Observaciones:</div>
                  <div style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.5' }}>
                    El estudiante muestra buena disposición. Comentó que está teniendo dificultades con una asignatura específica. Se acordó hacer seguimiento en próxima entrevista.
                  </div>
                </div>
              </div>

              {/* Entrevista 2 */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>📝 Entrevista - 10/02/2025</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                      <strong>Entrevistador:</strong> Pedro Ramírez
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/entrevista/${id}`)}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}
                  >
                    Ver Detalle →
                  </button>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>Temas Tratados:</div>
                  <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>Inicio de semestre, planificación</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>Observaciones:</div>
                  <div style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.5' }}>
                    Se revisó el plan de estudios para el semestre. El estudiante se comprometió a mejorar su asistencia.
                  </div>
                </div>
              </div>

              {/* Entrevista 3 */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', opacity: 0.8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>📝 Entrevista - 20/12/2024</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                      <strong>Entrevistador:</strong> María González
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/entrevista/${id}`)}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}
                  >
                    Ver Detalle →
                  </button>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>Temas Tratados:</div>
                  <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>Cierre de semestre, resultados finales</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>Observaciones:</div>
                  <div style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.5' }}>
                    Buen desempeño general. Se felicitó al estudiante por su esfuerzo y mejora en el promedio.
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Nueva Entrevista */}
            {mostrarModalNuevaEntrevista && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', maxWidth: '500px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                  <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>➕ Nueva Entrevista</h3>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      Fecha <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="date" 
                      defaultValue={new Date().toISOString().split('T')[0]}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      Entrevistador <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      defaultValue={authService.getCurrentUser()?.nombres || 'Usuario Actual'}
                      readOnly
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', backgroundColor: '#f9fafb' }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      Temas Tratados (opcional)
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ej: Rendimiento académico, situación familiar..."
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      Observaciones Generales (opcional)
                    </label>
                    <textarea 
                      placeholder="Observaciones iniciales de la entrevista..."
                      style={{ width: '100%', minHeight: '100px', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', fontFamily: 'inherit', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => setMostrarModalNuevaEntrevista(false)}
                      style={{ padding: '0.75rem 1.5rem', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={() => {
                        setMostrarModalNuevaEntrevista(false);
                        navigate(`/entrevista/${id}`);
                      }}
                      style={{ padding: '0.75rem 1.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}
                    >
                      Crear y Abrir Entrevista
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Ver Semestres Anteriores */}
      {mostrarModalSemestresAnteriores && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', maxWidth: '900px', width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>📚 Semestres Guardados</h3>
              <button 
                onClick={() => setMostrarModalSemestresAnteriores(false)}
                style={{ padding: '0.5rem', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
              Aquí puedes ver snapshots de semestres anteriores guardados. Selecciona un semestre para ver su información.
            </p>

            {/* Lista de Semestres Guardados */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Semestre 2024/2S */}
              <div style={{ border: '2px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
                   onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10b981'}
                   onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                      Semestre 2024/2S
                    </h4>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      <span>📅 Guardado: 20/12/2024</span>
                      <span style={{ margin: '0 0.5rem' }}>•</span>
                      <span>📊 Promedio: 5.2</span>
                      <span style={{ margin: '0 0.5rem' }}>•</span>
                      <span>📚 7 ramos (6 aprobados, 1 reprobado)</span>
                    </div>
                  </div>
                  <button style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}>
                    Ver Detalle →
                  </button>
                </div>
              </div>

              {/* Semestre 2024/1S */}
              <div style={{ border: '2px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
                   onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10b981'}
                   onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                      Semestre 2024/1S
                    </h4>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      <span>📅 Guardado: 30/06/2024</span>
                      <span style={{ margin: '0 0.5rem' }}>•</span>
                      <span>📊 Promedio: 5.5</span>
                      <span style={{ margin: '0 0.5rem' }}>•</span>
                      <span>📚 6 ramos (6 aprobados)</span>
                    </div>
                  </div>
                  <button style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}>
                    Ver Detalle →
                  </button>
                </div>
              </div>

              {/* Semestre 2023/2S */}
              <div style={{ border: '2px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
                   onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10b981'}
                   onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                      Semestre 2023/2S
                    </h4>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      <span>📅 Guardado: 15/12/2023</span>
                      <span style={{ margin: '0 0.5rem' }}>•</span>
                      <span>📊 Promedio: 5.8</span>
                      <span style={{ margin: '0 0.5rem' }}>•</span>
                      <span>📚 6 ramos (6 aprobados)</span>
                    </div>
                  </div>
                  <button style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}>
                    Ver Detalle →
                  </button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                💡 <strong>Nota:</strong> Los semestres guardados son snapshots de solo lectura. No se pueden editar una vez guardados.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstudianteDetail;
