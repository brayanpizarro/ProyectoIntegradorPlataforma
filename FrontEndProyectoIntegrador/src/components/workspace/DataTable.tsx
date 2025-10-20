import React from 'react';
import type { Estudiante } from '../../types';

interface DataTableProps {
  tabId: string;
  sectionTitle: string;
  estudiante: Estudiante;
}

export const DataTable: React.FC<DataTableProps> = ({
  tabId,
  sectionTitle,
  estudiante
}) => {
  // ✅ FUNCIÓN: Obtener contenido según la sección
  const getSectionContent = () => {
    switch (tabId) {
      case 'tab-info-personal':
        return renderInfoPersonal();
      case 'tab-avance-academico':
        return renderAvanceAcademico();
      case 'tab-historial':
        return renderHistorial();
      case 'tab-familia-data':
        return renderFamiliaData();
      default:
        return renderGenericData();
    }
  };

  // ✅ RENDER: Información personal
  const renderInfoPersonal = () => {
    const nombreCompleto = estudiante.nombre || 
      `${estudiante.nombres || ''} ${estudiante.apellidos || ''}`.trim();

    const datos = [
      { label: 'Nombre completo', value: nombreCompleto },
      { label: 'RUT', value: estudiante.rut || 'No especificado' },
      { label: 'Email', value: estudiante.email || 'No especificado' },
      { label: 'Teléfono', value: estudiante.telefono || 'No especificado' },
      { label: 'Dirección', value: estudiante.direccion || 'No especificada' },
      { label: 'Fecha de nacimiento', value: estudiante.fecha_de_nacimiento?.toString() || 'No especificada' },
      { label: 'Región', value: estudiante.region || 'No especificada' },
      { label: 'Tipo de estudiante', value: estudiante.tipo_de_estudiante || 'No especificado' },
    ];

    return (
      <div style={{ padding: '1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '1rem',
          maxWidth: '600px'
        }}>
          {datos.map((item, index) => (
            <React.Fragment key={index}>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.375rem'
              }}>
                {item.label}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#1f2937',
                padding: '0.75rem',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem'
              }}>
                {item.value}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // ✅ RENDER: Avance académico
  const renderAvanceAcademico = () => {
    const datosAcademicos = [
      { 
        label: 'Carrera', 
        value: estudiante.carrera || estudiante.informacionAcademica?.carrera || 'No especificada'
      },
      { 
        label: 'Universidad', 
        value: estudiante.universidad || estudiante.institucion?.nombre_institucion || 'No especificada'
      },
      { 
        label: 'Año de generación', 
        value: estudiante.año_generacion?.toString() || 'No especificado'
      },
      { 
        label: 'Semestre actual', 
        value: estudiante.semestre?.toString() || 'No especificado'
      },
      { 
        label: 'Promedio actual', 
        value: (estudiante.promedio || estudiante.informacionAcademica?.promedio_actual)?.toString() || 'No especificado'
      },
      { 
        label: 'Estado académico', 
        value: estudiante.estado || estudiante.informacionAcademica?.status_actual || 'No especificado'
      },
      { 
        label: 'Vía de acceso', 
        value: estudiante.via_acceso || 'No especificada'
      },
      { 
        label: 'Beca', 
        value: estudiante.beca || 'Sin beca'
      },
    ];

    return (
      <div style={{ padding: '1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '1rem',
          maxWidth: '700px'
        }}>
          {datosAcademicos.map((item, index) => (
            <React.Fragment key={index}>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                padding: '0.75rem',
                backgroundColor: '#f0f9ff',
                borderRadius: '0.375rem'
              }}>
                {item.label}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#1f2937',
                padding: '0.75rem',
                backgroundColor: 'white',
                border: '1px solid #bfdbfe',
                borderRadius: '0.375rem'
              }}>
                {item.value}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Indicador de progreso */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{
            margin: '0 0 0.75rem 0',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#1e293b'
          }}>
            📊 Progreso Académico
          </h4>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '0.5rem'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', minWidth: '100px' }}>
              Avance de carrera:
            </span>
            <div style={{
              flex: 1,
              height: '8px',
              backgroundColor: '#e2e8f0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${((estudiante.semestre || 0) / 10) * 100}%`,
                backgroundColor: '#3b82f6',
                borderRadius: '4px'
              }} />
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e293b' }}>
              {estudiante.semestre || 0}/10
            </span>
          </div>
          
          <div style={{
            fontSize: '0.75rem',
            color: '#64748b'
          }}>
            * Basado en semestres cursados de carrera estimada en 10 semestres
          </div>
        </div>
      </div>
    );
  };

  // ✅ RENDER: Historial académico
  const renderHistorial = () => {
    // Mock de historial académico
    const historialMock = [
      { periodo: '2024-1', asignaturas: 6, promedio: 6.2, estado: 'Aprobado' },
      { periodo: '2023-2', asignaturas: 5, promedio: 6.5, estado: 'Aprobado' },
      { periodo: '2023-1', asignaturas: 6, promedio: 5.8, estado: 'Aprobado' },
      { periodo: '2022-2', asignaturas: 5, promedio: 6.1, estado: 'Aprobado' },
    ];

    return (
      <div style={{ padding: '1.5rem' }}>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <h4 style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: '600',
              color: '#1e293b'
            }}>
              📚 Historial por Semestre
            </h4>
          </div>
          
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  Período
                </th>
                <th style={{
                  padding: '0.75rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  Asignaturas
                </th>
                <th style={{
                  padding: '0.75rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  Promedio
                </th>
                <th style={{
                  padding: '0.75rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {historialMock.map((registro, index) => (
                <tr key={index} style={{
                  borderBottom: index < historialMock.length - 1 ? '1px solid #f3f4f6' : 'none'
                }}>
                  <td style={{
                    padding: '0.75rem',
                    fontSize: '0.875rem',
                    color: '#1f2937'
                  }}>
                    {registro.periodo}
                  </td>
                  <td style={{
                    padding: '0.75rem',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    color: '#1f2937'
                  }}>
                    {registro.asignaturas}
                  </td>
                  <td style={{
                    padding: '0.75rem',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: registro.promedio >= 6.0 ? '#059669' : '#dc2626'
                  }}>
                    {registro.promedio}
                  </td>
                  <td style={{
                    padding: '0.75rem',
                    textAlign: 'center'
                  }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: '#dcfce7',
                      color: '#166534'
                    }}>
                      {registro.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ✅ RENDER: Información familiar
  const renderFamiliaData = () => {
    // Mock de datos familiares
    const familiaData = {
      madre: { nombre: 'María González', edad: 48, ocupacion: 'Profesora' },
      padre: { nombre: 'Carlos Pérez', edad: 52, ocupacion: 'Ingeniero' },
      hermanos: 2,
      situacionEconomica: 'Clase media',
      contactoEmergencia: 'María González - +56 9 8765 4321'
    };

    return (
      <div style={{ padding: '1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1.5rem',
          maxWidth: '700px'
        }}>
          {/* Información de los padres */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '1rem'
          }}>
            <h4 style={{
              margin: '0 0 1rem 0',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#1e293b'
            }}>
              👨‍👩‍👧‍👦 Información Familiar
            </h4>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}>
              <div>
                <h5 style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Madre
                </h5>
                <div style={{ fontSize: '0.875rem', color: '#1f2937' }}>
                  {familiaData.madre.nombre}<br />
                  {familiaData.madre.edad} años<br />
                  {familiaData.madre.ocupacion}
                </div>
              </div>
              
              <div>
                <h5 style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Padre
                </h5>
                <div style={{ fontSize: '0.875rem', color: '#1f2937' }}>
                  {familiaData.padre.nombre}<br />
                  {familiaData.padre.edad} años<br />
                  {familiaData.padre.ocupacion}
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '1rem'
          }}>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              padding: '0.75rem',
              backgroundColor: '#fef7ed',
              borderRadius: '0.375rem'
            }}>
              Hermanos
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#1f2937',
              padding: '0.75rem',
              backgroundColor: 'white',
              border: '1px solid #fed7aa',
              borderRadius: '0.375rem'
            }}>
              {familiaData.hermanos}
            </div>

            <div style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              padding: '0.75rem',
              backgroundColor: '#fef7ed',
              borderRadius: '0.375rem'
            }}>
              Situación económica
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#1f2937',
              padding: '0.75rem',
              backgroundColor: 'white',
              border: '1px solid #fed7aa',
              borderRadius: '0.375rem'
            }}>
              {familiaData.situacionEconomica}
            </div>

            <div style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              padding: '0.75rem',
              backgroundColor: '#fef7ed',
              borderRadius: '0.375rem'
            }}>
              Contacto de emergencia
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#1f2937',
              padding: '0.75rem',
              backgroundColor: 'white',
              border: '1px solid #fed7aa',
              borderRadius: '0.375rem'
            }}>
              {familiaData.contactoEmergencia}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ✅ RENDER: Datos genéricos
  const renderGenericData = () => {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#64748b'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>
          {sectionTitle}
        </h3>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          Los datos para esta sección se implementarán próximamente
        </p>
      </div>
    );
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white'
    }}>
      {/* ✅ HEADER DE LA SECCIÓN */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#fafafa'
      }}>
        <h3 style={{
          margin: '0 0 0.5rem 0',
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#1e293b'
        }}>
          📊 {sectionTitle}
        </h3>
        <p style={{
          margin: 0,
          fontSize: '0.875rem',
          color: '#64748b'
        }}>
          Información del estudiante {estudiante.nombre || 
            `${estudiante.nombres} ${estudiante.apellidos}`}
        </p>
      </div>

      {/* ✅ CONTENIDO DE LA SECCIÓN */}
      <div style={{
        flex: 1,
        overflowY: 'auto'
      }}>
        {getSectionContent()}
      </div>
    </div>
  );
};