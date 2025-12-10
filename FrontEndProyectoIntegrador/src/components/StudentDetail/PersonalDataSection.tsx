import React from 'react';
import type { Estudiante } from '../../types';

interface PersonalDataSectionProps {
  estudiante: Estudiante;
  modoEdicion: boolean;
}

export const PersonalDataSection: React.FC<PersonalDataSectionProps> = ({ 
  estudiante, 
  modoEdicion 
}) => {
  // Helpers para acceder a datos anidados de forma segura
  const getInstitucionData = (field: keyof NonNullable<typeof estudiante.institucion>) => {
    return estudiante.institucion?.[field] || 'Sin definir';
  };

  const getInfoAcademicaData = (field: keyof NonNullable<typeof estudiante.informacion_academica>) => {
    return estudiante.informacion_academica?.[field] || 'Sin definir';
  };

  const calcularEdad = (fechaNacimiento?: Date | string) => {
    if (!fechaNacimiento) return 'Sin definir';
    const fecha = typeof fechaNacimiento === 'string' ? new Date(fechaNacimiento) : fechaNacimiento;
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }
    return edad;
  };

  const formatearPromedios = () => {
    const infoAcad = estudiante.informacion_academica;
    if (!infoAcad) return 'Sin definir';
    
    const promedios = [
      infoAcad.promedio_1 ? `1°M: ${infoAcad.promedio_1}` : null,
      infoAcad.promedio_2 ? `2°M: ${infoAcad.promedio_2}` : null,
      infoAcad.promedio_3 ? `3°M: ${infoAcad.promedio_3}` : null,
      infoAcad.promedio_4 ? `4°M: ${infoAcad.promedio_4}` : null,
    ].filter(Boolean);

    return promedios.length > 0 ? promedios.join(' | ') : 'Sin definir';
  };

  const formatearPuntajesPAES = () => {
    const puntajes = estudiante.informacion_academica?.puntajes_admision;
    if (!puntajes || typeof puntajes !== 'object') return 'Sin definir';
    
    return Object.entries(puntajes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' | ') || 'Sin definir';
  };

  const getHistorialStatus = (año: number, semestre: number) => {
    const historial = estudiante.historial_academico?.find(
      h => h.año === año && h.semestre === semestre
    );
    return historial ? 'Registrado' : 'Sin definir';
  };

  const getTrayectoriaAcademica = () => {
    const historiales = estudiante.historial_academico;
    if (!historiales || historiales.length === 0) return 'Sin definir';
    
    const trayectorias = historiales
      .flatMap(h => h.trayectoria_academica || [])
      .filter(Boolean);
    
    return trayectorias.length > 0 ? trayectorias.join(', ') : 'Sin definir';
  };

  return (
    <div>
      <div className="bg-[var(--color-turquoise)] text-white text-center font-bold text-xl py-3 mb-4">
        Datos Personales
      </div>
      <table 
        className="w-full border-collapse border border-gray-300"
        role="table"
        aria-label="Tabla de datos personales del estudiante"
      >
        <tbody>
          {/* Datos Básicos del Estudiante */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Nombre</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={estudiante.nombre || ''}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.nombre || 'Sin definir'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Apellidos</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={'Sin definir'}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>Sin definir</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Rut</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={estudiante.rut || ''}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.rut || 'Sin definir'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Teléfono</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="tel" 
                  defaultValue={estudiante.telefono || ''}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.telefono || 'Sin definir'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Año Ingreso Beca</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="number" 
                  defaultValue={estudiante.informacion_academica?.año_ingreso_beca || ''}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.informacion_academica?.año_ingreso_beca || 'Sin definir'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Fecha de Nacimiento</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="date" 
                  defaultValue={
                    typeof estudiante.fecha_de_nacimiento === 'string' 
                      ? estudiante.fecha_de_nacimiento 
                      : estudiante.fecha_de_nacimiento?.toISOString().split('T')[0] || ''
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>
                  {estudiante.fecha_de_nacimiento 
                    ? new Date(estudiante.fecha_de_nacimiento).toLocaleDateString('es-CL')
                    : 'Sin definir'
                  }
                </span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Edad</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{calcularEdad(estudiante.fecha_de_nacimiento)}</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Género</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <select 
                  defaultValue={'Sin definir'}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                  <option value="Sin definir">Prefiero no decir</option>
                </select>
              ) : (
                <span>Sin definir</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Email</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="email" 
                  defaultValue={estudiante.email || ''}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.email || 'Sin definir'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Dirección</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={'Sin definir'}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>Sin definir</span>
              )}
            </td>
          </tr>

          {/* Información Académica Previa (Liceo) */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Liceo</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={String(getInfoAcademicaData('colegio'))}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{getInfoAcademicaData('colegio')}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Especialidad</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={String(getInfoAcademicaData('especialidad_colegio'))}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{getInfoAcademicaData('especialidad_colegio')}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Comuna Liceo</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={String(getInfoAcademicaData('comuna_colegio'))}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{getInfoAcademicaData('comuna_colegio')}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Promedios Enseñanza Media</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={formatearPromedios()}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{formatearPromedios()}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Puntajes PAES 2021/1|2</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={formatearPuntajesPAES()}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{formatearPuntajesPAES()}</span>
              )}
            </td>
          </tr>

          {/* Información Universidad/Carrera */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Carrera</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={String(getInstitucionData('carrera_especialidad'))}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{getInstitucionData('carrera_especialidad')}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Duración Carrera</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={String(getInstitucionData('duracion'))}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{getInstitucionData('duracion')}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Universidad</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={String(getInstitucionData('nombre'))}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{getInstitucionData('nombre')}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Vía de acceso</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={String(getInfoAcademicaData('via_acceso'))}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{getInfoAcademicaData('via_acceso')}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Trayectoria Académica</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={getTrayectoriaAcademica()}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{getTrayectoriaAcademica()}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Otros Beneficios</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={String(getInfoAcademicaData('beneficios'))}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{getInfoAcademicaData('beneficios')}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Vencimiento Gratuidad</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="date" 
                  defaultValue={''}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>Sin definir</span>
              )}
            </td>
          </tr>

          {/* Status por Semestre - Historial Académico */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Status 2022/1S</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{getHistorialStatus(2022, 1)}</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Status 2022/2S</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{getHistorialStatus(2022, 2)}</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Status 2023/1S</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{getHistorialStatus(2023, 1)}</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Status 2023/2S</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{getHistorialStatus(2023, 2)}</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Status 2024/1S</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{getHistorialStatus(2024, 1)}</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Status 2024/2S</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{getHistorialStatus(2024, 2)}</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Status 2025/1S</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{getHistorialStatus(2025, 1)}</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Status 2025/2S</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{getHistorialStatus(2025, 2)}</span>
            </td>
          </tr>

          {/* Observaciones */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Observaciones</td>
            <td className="p-2 border border-gray-300 bg-white">
              <textarea 
                className="w-full min-h-[100px] px-2 py-1 border border-gray-300 rounded resize-y"
                placeholder="Agregar observaciones..."
                disabled={!modoEdicion}
                defaultValue={'Sin definir'}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
