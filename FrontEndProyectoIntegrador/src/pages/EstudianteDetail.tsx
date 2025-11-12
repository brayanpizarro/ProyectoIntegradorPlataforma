import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { encontrarEstudiantePorId } from '../data/mockData';
import { apiService } from '../services/apiService';

type SeccionActiva = 'personal' | 'familiar' | 'informe' | 'desempeno';

export const EstudianteDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [seccionActiva, setSeccionActiva] = useState<SeccionActiva>('personal');
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/');
    }
    const fetchEstudiante = async () => {
      try {
        const data = await apiService.getEstudiantePorId(id || '');
        setEstudiante(data);
      } catch (error) {
        setEstudiante(encontrarEstudiantePorId(id || ''));
      }
    }
    fetchEstudiante();
  }, [navigate]);


  const formatearFecha = (fecha: any) => {
    if (!fecha) return 'No especificado';
    if (fecha instanceof Date) return fecha.toLocaleDateString();
    return String(fecha);
  };

  const handleIngresarEntrevista = () => {
    if (estudiante) {
      navigate(`/entrevista/${estudiante.id}`);
    }
  };

  if (!estudiante) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}><h2>Estudiante no encontrado</h2></div>;
  }

  const tabs = [
    { id: 'personal' as SeccionActiva, label: 'Datos Personales' },
    { id: 'familiar' as SeccionActiva, label: 'Información Familiar' },
    { id: 'informe' as SeccionActiva, label: 'Informe Académico General' },
    { id: 'desempeno' as SeccionActiva, label: 'Desempeño por Semestre' },
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
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#1f2937', fontWeight: '600' }}>
              {estudiante.nombres} {estudiante.apellidos}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button onClick={() => setModoEdicion(!modoEdicion)} style={{ padding: '0.625rem 1.25rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}>
              {modoEdicion ? 'Vista Lectura' : 'Modo Edición'}
            </button>
            <button onClick={handleIngresarEntrevista} style={{ padding: '0.625rem 1.25rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}>
              Ir a Entrevista
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
        {seccionActiva === 'personal' && (
          <div>
            <h2 style={estilos.tituloSeccion}>Datos Personales</h2>
            <table style={estilos.tabla}>
              <tbody>
                <tr>
                  <td style={estilos.celdaLabel}>Nombre</td>
                  <td style={estilos.celdaValor}>{estudiante.nombres} {estudiante.apellidos}</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Rut</td>
                  <td style={estilos.celdaValor}>{estudiante.rut}</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Teléfono</td>
                  <td style={estilos.celdaValor}>{estudiante.telefono || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Año Ingreso Beca</td>
                  <td style={estilos.celdaValor}>{estudiante.año_generacion || '2019'}</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Fecha de Nacimiento</td>
                  <td style={estilos.celdaValor}>
                    {formatearFecha(estudiante.fecha_de_nacimiento || estudiante.fecha_nacimiento)}
                  </td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Liceo</td>
                  <td style={estilos.celdaValor}>{estudiante.liceo || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Especialidad</td>
                  <td style={estilos.celdaValor}>{estudiante.especialidad || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Comuna Liceo</td>
                  <td style={estilos.celdaValor}>{estudiante.region || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Promedios Enseñanza Media</td>
                  <td style={estilos.celdaValor}>{estudiante.promedio_liceo || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Puntajes PAES 2021/1|2</td>
                  <td style={estilos.celdaValor}>No especificado</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Carrera</td>
                  <td style={estilos.celdaValor}>{estudiante.carrera || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Duración Carrera</td>
                  <td style={estilos.celdaValor}>{estudiante.duracion_carrera || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Universidad</td>
                  <td style={estilos.celdaValor}>{estudiante.universidad || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Vía de acceso</td>
                  <td style={estilos.celdaValor}>{estudiante.via_acceso || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Trayectoria Académica</td>
                  <td style={estilos.celdaValor}>Ingresa en {estudiante.año_generacion || '2022'}/1S</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Otros Beneficios</td>
                  <td style={estilos.celdaValor}>{estudiante.beca || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style={estilos.celdaLabel}>Vencimiento Gratuidad</td>
                  <td style={estilos.celdaValor}>No especificado</td>
                </tr>
                {['2022/1S', '2022/2S', '2023/1S', '2023/2S', '2024/1S', '2024/2S', '2025/1S', '2025/2S'].map((semestre) => (
                  <tr key={semestre}>
                    <td style={estilos.celdaLabel}>Status {semestre}</td>
                    <td style={estilos.celdaValor}>{estudiante.estado || 'Estudiando'}</td>
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
                      <th style={{ ...estilos.encabezadoTabla, width: '20%' }}>Ramo</th>
                      <th style={{ ...estilos.encabezadoTabla, width: '25%' }}>Comentarios</th>
                      <th style={{ ...estilos.encabezadoTabla, width: '15%' }}>Notas parciales</th>
                      <th style={{ ...estilos.encabezadoTabla, width: '12%' }}>Promedio final</th>
                      <th style={{ ...estilos.encabezadoTabla, width: '13%' }}>Aprobación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>1</td>
                      <td style={estilos.celdaValor}>Introducción al derecho</td>
                      <td style={estilos.celdaValor}>
                        <div style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
                          <div><strong>2025.03.15:</strong> Buen inicio de semestre</div>
                          <div><strong>2025.05.10:</strong> Estudió para la prueba</div>
                        </div>
                      </td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center', fontSize: '0.875rem' }}>5.1; 3.8; 4.0</td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center', fontWeight: '600', fontSize: '1rem' }}>4.6</td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center', backgroundColor: '#d1fae5', color: '#065f46', fontWeight: '600' }}>Aprobado</td>
                    </tr>
                    <tr>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>2</td>
                      <td style={estilos.celdaValor}>Derecho político</td>
                      <td style={estilos.celdaValor}>
                        <div style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
                          Le fue bien en la primera prueba
                        </div>
                      </td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center', fontSize: '0.875rem' }}>4.5; 2.1; 2.7</td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center', fontWeight: '600', fontSize: '1rem' }}>3.1</td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center', backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: '600' }}>Reprobado</td>
                    </tr>
                    <tr>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>3</td>
                      <td style={estilos.celdaValor}>Historia del derecho</td>
                      <td style={estilos.celdaValor}></td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center', fontSize: '0.875rem' }}>5.5; 6.0; 5.8</td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center', fontWeight: '600', fontSize: '1rem' }}>5.8</td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center', backgroundColor: '#d1fae5', color: '#065f46', fontWeight: '600' }}>Aprobado</td>
                    </tr>
                    <tr>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center' }}>4</td>
                      <td style={estilos.celdaValor}>Derecho civil I</td>
                      <td style={estilos.celdaValor}></td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center', fontSize: '0.875rem' }}>4.9; 5.2; 5.0</td>
                      <td style={{ ...estilos.celdaValor, textAlign: 'center', fontWeight: '600', fontSize: '1rem' }}>5.0</td>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '700', backgroundColor: '#e0e7ff', padding: '0.5rem', borderRadius: '0.25rem', textAlign: 'center' }}>
                  Comentarios Generales
                </h4>
                <div style={{ border: '1px solid #d1d5db', padding: '0.75rem', backgroundColor: 'white', minHeight: '120px', fontSize: '0.875rem', lineHeight: '1.5' }}>
                  <div style={{ marginBottom: '0.5rem' }}><strong>2025.09.04:</strong> Le cuesta organizar sus tiempos para estudiar.</div>
                  <div><strong>2025.10.11:</strong> Está asistiendo a apoyo psicopedagógico.</div>
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '700', backgroundColor: '#fef3c7', padding: '0.5rem', borderRadius: '0.25rem', textAlign: 'center' }}>
                  Principales dificultades / desafíos
                </h4>
                <div style={{ border: '1px solid #d1d5db', padding: '0.75rem', backgroundColor: 'white', minHeight: '120px', fontSize: '0.875rem', lineHeight: '1.5' }}>
                  Mantener buena asistencia a clases tempranas. Gestión del tiempo de estudio.
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '700', backgroundColor: '#d1fae5', padding: '0.5rem', borderRadius: '0.25rem', textAlign: 'center' }}>
                  Principales aprendizajes / logros
                </h4>
                <div style={{ border: '1px solid #d1d5db', padding: '0.75rem', backgroundColor: 'white', minHeight: '120px', fontSize: '0.875rem' }}>
                  {modoEdicion ? (
                    <textarea 
                      style={{ width: '100%', height: '100px', border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: 'inherit', resize: 'none' }}
                      placeholder="Agregar logros y aprendizajes..."
                    />
                  ) : (
                    <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Sin registro</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
