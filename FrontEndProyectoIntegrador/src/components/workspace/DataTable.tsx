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
      <div className="p-6">
        <div className="grid grid-cols-[1fr_2fr] gap-4 max-w-[600px]">
          {datos.map((item, index) => (
            <React.Fragment key={index}>
              <div className="text-sm font-medium text-gray-700 p-3 bg-gray-50 rounded-md">
                {item.label}
              </div>
              <div className="text-sm text-gray-800 p-3 bg-white border border-gray-200 rounded-md">
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
      <div className="p-6">
        <div className="grid grid-cols-[1fr_2fr] gap-4 max-w-[700px]">
          {datosAcademicos.map((item, index) => (
            <React.Fragment key={index}>
              <div className="text-sm font-medium text-gray-700 p-3 bg-blue-50 rounded-md">
                {item.label}
              </div>
              <div className="text-sm text-gray-800 p-3 bg-white border border-blue-200 rounded-md">
                {item.value}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Indicador de progreso */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="m-0 mb-3 text-base font-semibold text-gray-800">
            📊 Progreso Académico
          </h4>
          
          <div className="flex items-center gap-4 mb-2">
            <span className="text-sm text-gray-500 min-w-[100px]">
              Avance de carrera:
            </span>
            <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded"
                style={{ width: `${((estudiante.semestre || 0) / 10) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-800">
              {estudiante.semestre || 0}/10
            </span>
          </div>
          
          <div className="text-xs text-gray-500">
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
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h4 className="m-0 text-base font-semibold text-gray-800">
              📚 Historial por Semestre
            </h4>
          </div>
          
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                  Período
                </th>
                <th className="p-3 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
                  Asignaturas
                </th>
                <th className="p-3 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
                  Promedio
                </th>
                <th className="p-3 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {historialMock.map((registro, index) => (
                <tr key={index} className={index < historialMock.length - 1 ? 'border-b border-gray-100' : ''}>
                  <td className="p-3 text-sm text-gray-800">
                    {registro.periodo}
                  </td>
                  <td className="p-3 text-center text-sm text-gray-800">
                    {registro.asignaturas}
                  </td>
                  <td className="p-3 text-center text-sm font-medium" style={{ color: registro.promedio >= 6.0 ? '#059669' : '#dc2626' }}>
                    {registro.promedio}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 max-w-[700px]">
          {/* Información de los padres */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="m-0 mb-4 text-base font-semibold text-gray-800">
              👨‍👩‍👧‍👦 Información Familiar
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="m-0 mb-2 text-sm font-medium text-gray-700">
                  Madre
                </h5>
                <div className="text-sm text-gray-800">
                  {familiaData.madre.nombre}<br />
                  {familiaData.madre.edad} años<br />
                  {familiaData.madre.ocupacion}
                </div>
              </div>
              
              <div>
                <h5 className="m-0 mb-2 text-sm font-medium text-gray-700">
                  Padre
                </h5>
                <div className="text-sm text-gray-800">
                  {familiaData.padre.nombre}<br />
                  {familiaData.padre.edad} años<br />
                  {familiaData.padre.ocupacion}
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-[1fr_2fr] gap-4">
            <div className="text-sm font-medium text-gray-700 p-3 bg-orange-50 rounded-md">
              Hermanos
            </div>
            <div className="text-sm text-gray-800 p-3 bg-white border border-orange-200 rounded-md">
              {familiaData.hermanos}
            </div>

            <div className="text-sm font-medium text-gray-700 p-3 bg-orange-50 rounded-md">
              Situación económica
            </div>
            <div className="text-sm text-gray-800 p-3 bg-white border border-orange-200 rounded-md">
              {familiaData.situacionEconomica}
            </div>

            <div className="text-sm font-medium text-gray-700 p-3 bg-orange-50 rounded-md">
              Contacto de emergencia
            </div>
            <div className="text-sm text-gray-800 p-3 bg-white border border-orange-200 rounded-md">
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
      <div className="p-8 text-center text-gray-500">
        <div className="text-5xl mb-4">📊</div>
        <h3 className="m-0 mb-2 text-gray-800">
          {sectionTitle}
        </h3>
        <p className="m-0 text-sm">
          Los datos para esta sección se implementarán próximamente
        </p>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* ✅ HEADER DE LA SECCIÓN */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="m-0 mb-2 text-lg font-semibold text-gray-800">
          📊 {sectionTitle}
        </h3>
        <p className="m-0 text-sm text-gray-500">
          Información del estudiante {estudiante.nombre || 
            `${estudiante.nombres} ${estudiante.apellidos}`}
        </p>
      </div>

      {/* ✅ CONTENIDO DE LA SECCIÓN */}
      <div className="flex-1 overflow-y-auto">
        {getSectionContent()}
      </div>
    </div>
  );
};