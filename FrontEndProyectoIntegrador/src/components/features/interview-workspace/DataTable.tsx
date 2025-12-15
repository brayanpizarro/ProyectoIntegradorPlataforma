import { Fragment } from 'react';
import type { Estudiante } from '../../../types';

interface DataTableProps {
  tabId: string;
  sectionTitle: string;
  estudiante: Estudiante;
}

export function DataTable({
  tabId,
  sectionTitle,
  estudiante
}: DataTableProps) {
  // FUNCIÓN: Obtener contenido según la sección
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

  // RENDER: Información personal
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
            <Fragment key={index}>
              <div className="text-sm font-medium text-gray-700 p-3 bg-gray-50 rounded-md">
                {item.label}
              </div>
              <div className="text-sm text-gray-800 p-3 bg-white border border-gray-200 rounded-md">
                {item.value}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    );
  };

  // RENDER: Avance académico
  const renderAvanceAcademico = () => {
    const getValor = (valor?: string | number | null) => {
      if (valor === null || valor === undefined || valor === '') return 'No especificada';
      return typeof valor === 'number' ? valor.toString() : valor;
    };

    const datosAcademicos = [
      {
        label: 'Carrera',
        value:
          estudiante.carrera ||
          estudiante.institucion?.carrera_especialidad ||
          estudiante.institucion?.nombre_institucion ||
          'No especificada'
      },
      {
        label: 'Universidad',
        value:
          estudiante.universidad ||
          estudiante.institucion?.nombre ||
          estudiante.institucion?.nombre_institucion ||
          'No especificada'
      },
      {
        label: 'Año de generación',
        value: getValor(estudiante.año_generacion ?? estudiante.generacion)
      },
      {
        label: 'Semestre actual',
        value: getValor((estudiante as any).semestre)
      },
      {
        label: 'Promedio actual',
        value: getValor(
          estudiante.promedio ??
          estudiante.informacionAcademica?.promedio_acumulado ??
          estudiante.informacionAcademica?.promedio_1
        )
      },
      {
        label: 'Estado académico',
        value: estudiante.status || estudiante.estado || 'No especificado'
      }
    ];

    return (
      <div className="p-6">
        <div className="grid grid-cols-[1fr_2fr] gap-4 max-w-[700px]">
          {datosAcademicos.map((item, index) => (
            <Fragment key={index}>
              <div className="text-sm font-medium text-gray-700 p-3 bg-[var(--color-turquoise)]/10 rounded-md">
                {item.label}
              </div>
              <div className="text-sm text-gray-800 p-3 bg-white border border-blue-200 rounded-md">
                {item.value}
              </div>
            </Fragment>
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
                className="h-full bg-[var(--color-turquoise)] rounded"
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

  // RENDER: Historial académico
  const renderHistorial = () => {
    const historiales = (estudiante.historialesAcademicos || []).filter(
      (h) => h.año !== null && h.año !== undefined && h.semestre !== null && h.semestre !== undefined
    );

    if (historiales.length === 0) {
      return (
        <div className="p-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="m-0 mb-3 text-base font-semibold text-gray-800">📚 Historial por Semestre</h4>
            <p className="m-0 text-sm text-gray-600">Sin registros de historial académico para este estudiante.</p>
          </div>
        </div>
      );
    }

    const ordenados = [...historiales].sort((a, b) => {
      if ((a.año ?? 0) !== (b.año ?? 0)) return (b.año ?? 0) - (a.año ?? 0);
      return (b.semestre ?? 0) - (a.semestre ?? 0);
    });

    const filas = ordenados.map((h) => {
      const asignaturas = (h.ramos_aprobados ?? 0) + (h.ramos_reprobados ?? 0) + (h.ramos_eliminados ?? 0);
      const promedio = h.promedio_semestre ?? null;
      const estado = (h as any).estado
        || (promedio !== null ? (promedio >= 4 ? 'Aprobado' : 'Reprobado') : 'Sin estado');

      return {
        periodo: `${h.año ?? ''}-${h.semestre ?? ''}`.trim(),
        asignaturas,
        promedio,
        estado,
      };
    });

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
              {filas.map((registro, index) => (
                <tr key={index} className={index < filas.length - 1 ? 'border-b border-gray-100' : ''}>
                  <td className="p-3 text-sm text-gray-800">
                    {registro.periodo}
                  </td>
                  <td className="p-3 text-center text-sm text-gray-800">
                    {registro.asignaturas}
                  </td>
                  <td
                    className="p-3 text-center text-sm font-medium"
                    style={{ color: (registro.promedio ?? 0) >= 6.0 ? '#059669' : '#dc2626' }}
                  >
                    {registro.promedio ?? '—'}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: registro.estado === 'Aprobado' ? '#d1fae5' : '#fee2e2',
                        color: registro.estado === 'Aprobado' ? '#065f46' : '#b91c1c'
                      }}
                    >
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

  // RENDER: Información familiar
  const renderFamiliaData = () => {
    const familia = estudiante.familia;

    const formatTexto = (valor?: string | string[]) => {
      if (!valor) return 'Sin información';
      if (Array.isArray(valor)) {
        const limpio = valor.filter(Boolean);
        return limpio.length ? limpio.join('\n') : 'Sin información';
      }
      return valor;
    };

    const formatListado = (items?: any[]) => {
      if (!items || items.length === 0) return 'Sin información';

      const nombres = items
        .map((item) => {
          if (!item) return '';
          if (typeof item === 'string') return item;
          if (typeof item === 'object') return (item as any).nombre || (item as any).name || '';
          return '';
        })
        .filter(Boolean);

      if (nombres.length > 0) return nombres.join(', ');
      return `${items.length} registrado${items.length === 1 ? '' : 's'}`;
    };

    const formatObservacionesGenerales = () => {
      const obs = familia?.observaciones as any;
      if (!obs) return 'Sin observaciones';
      if (typeof obs === 'string') return obs;
      if (Array.isArray(obs)) {
        const limpio = obs.filter(Boolean);
        return limpio.length ? limpio.join('\n') : 'Sin observaciones';
      }
      if (Array.isArray(obs?.general)) {
        const limpio = obs.general.filter(Boolean);
        return limpio.length ? limpio.join('\n') : 'Sin observaciones';
      }
      return 'Sin observaciones';
    };

    if (!familia) {
      return (
        <div className="p-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-[700px]">
            <h4 className="m-0 mb-3 text-base font-semibold text-gray-800">
              👨‍👩‍👧‍👦 Información Familiar
            </h4>
            <p className="m-0 text-sm text-gray-600">
              Este estudiante aún no tiene información familiar registrada en el sistema.
            </p>
          </div>
        </div>
      );
    }

    const descripcionMadre = formatTexto(familia.descripcion_madre);
    const descripcionPadre = formatTexto(familia.descripcion_padre);
    const hermanosDetalle = formatListado(familia.hermanos);
    const otrosFamiliaresDetalle = formatListado(familia.otros_familiares);
    const obsHermanos = formatTexto(familia.observaciones_hermanos);
    const obsOtros = formatTexto(familia.observaciones_otros_familiares);
    const obsGenerales = formatObservacionesGenerales();

    return (
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 max-w-[900px]">
          {/* Información de los padres */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="m-0 mb-4 text-base font-semibold text-gray-800">
              👨‍👩‍👧‍👦 Información Familiar
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="m-0 mb-2 text-sm font-medium text-gray-700">
                  Madre
                </h5>
                <div className="text-sm text-gray-800">
                  {familia.nombre_madre || 'No registrada'}
                  <div className="text-xs text-gray-600 mt-1 whitespace-pre-line">
                    {descripcionMadre}
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="m-0 mb-2 text-sm font-medium text-gray-700">
                  Padre
                </h5>
                <div className="text-sm text-gray-800">
                  {familia.nombre_padre || 'No registrado'}
                  <div className="text-xs text-gray-600 mt-1 whitespace-pre-line">
                    {descripcionPadre}
                  </div>
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
              {hermanosDetalle}
              {obsHermanos !== 'Sin información' && (
                <div className="text-xs text-gray-600 mt-1 whitespace-pre-line">{obsHermanos}</div>
              )}
            </div>

            <div className="text-sm font-medium text-gray-700 p-3 bg-orange-50 rounded-md">
              Otros familiares significativos
            </div>
            <div className="text-sm text-gray-800 p-3 bg-white border border-orange-200 rounded-md">
              {otrosFamiliaresDetalle}
              {obsOtros !== 'Sin información' && (
                <div className="text-xs text-gray-600 mt-1 whitespace-pre-line">{obsOtros}</div>
              )}
            </div>

            <div className="text-sm font-medium text-gray-700 p-3 bg-orange-50 rounded-md">
              Observaciones generales
            </div>
            <div className="text-sm text-gray-800 p-3 bg-white border border-orange-200 rounded-md">
              <div className="whitespace-pre-line">{obsGenerales}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // RENDER: Datos genéricos
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
      {/* HEADER DE LA SECCIÓN */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="m-0 mb-2 text-lg font-semibold text-gray-800">
          📊 {sectionTitle}
        </h3>
        <p className="m-0 text-sm text-gray-500">
          Información del estudiante {estudiante.nombre || 
            `${estudiante.nombres} ${estudiante.apellidos}`}
        </p>
      </div>

      {/* CONTENIDO DE LA SECCIÓN */}
      <div className="flex-1 overflow-y-auto">
        {getSectionContent()}
      </div>
    </div>
  );
};