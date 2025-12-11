import React, { useState, useEffect } from 'react';
import type { Estudiante } from '../../types';

interface PersonalDataSectionProps {
  estudiante: Estudiante;
  modoEdicion: boolean;
  onCampoChange?: (campo: string, valor: any) => void;
}

export const PersonalDataSection: React.FC<PersonalDataSectionProps> = ({ 
  estudiante, 
  modoEdicion,
  onCampoChange 
}) => {
  // ✅ Estado local para manejar los valores editables
  const [formData, setFormData] = useState({
    nombre: estudiante.nombre || '',
    rut: estudiante.rut || '',
    telefono: estudiante.telefono || '',
    email: estudiante.email || '',
    fecha_de_nacimiento: estudiante.fecha_de_nacimiento 
      ? (typeof estudiante.fecha_de_nacimiento === 'string' 
          ? estudiante.fecha_de_nacimiento.split('T')[0]
          : new Date(estudiante.fecha_de_nacimiento).toISOString().split('T')[0])
      : '',
    // ... más campos
  });

  // ✅ Actualizar formData cuando cambie el estudiante
  useEffect(() => {
    setFormData({
      nombre: estudiante.nombre || '',
      rut: estudiante.rut || '',
      telefono: estudiante.telefono || '',
      email: estudiante.email || '',
      fecha_de_nacimiento: estudiante.fecha_de_nacimiento 
        ? (typeof estudiante.fecha_de_nacimiento === 'string' 
            ? estudiante.fecha_de_nacimiento.split('T')[0]
            : new Date(estudiante.fecha_de_nacimiento).toISOString().split('T')[0])
        : '',
    });
  }, [estudiante]);

  // ✅ Handler para cambios en inputs
  const handleInputChange = (campo: string, valor: any) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));

    // Notificar al componente padre si existe callback
    if (onCampoChange) {
      onCampoChange(campo, valor);
    }
  };

  // Helpers (sin cambios)
  const getInstitucionData = (field: keyof NonNullable<typeof estudiante.institucion>) => {
    return estudiante.institucion?.[field] || 'Sin definir';
  };

  const getInfoAcademicaData = (field: keyof NonNullable<typeof estudiante.informacionAcademica>) => {
    return estudiante.informacionAcademica?.[field] || 'Sin definir';
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
    const infoAcad = estudiante.informacionAcademica;
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
    const puntajes = estudiante.informacionAcademica?.puntajes_admision;
    if (!puntajes || typeof puntajes !== 'object') return 'Sin definir';
    
    return Object.entries(puntajes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' | ') || 'Sin definir';
  };

  // Función para obtener estado del historial (pendiente de usar)
  // const getHistorialStatus = (año: number, semestre: number) => {
  //   const historial = estudiante.historialesAcademicos?.find(
  //     h => h.año === año && h.semestre === semestre
  //   );
  //   return historial ? 'Registrado' : 'Sin definir';
  // };

  const getTrayectoriaAcademica = () => {
    const historiales = estudiante.historialesAcademicos;
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
          {/* ✅ INPUT CONTROLADO - Nombre */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Nombre</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <span>{estudiante.nombre || 'Sin definir'}</span>
              )}
            </td>
          </tr>

          {/* Apellidos - Sin campo en backend aún */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Apellidos</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span className="text-gray-400 italic">Campo no disponible en backend</span>
            </td>
          </tr>

          {/* ✅ INPUT CONTROLADO - RUT */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">RUT</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  value={formData.rut}
                  onChange={(e) => handleInputChange('rut', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="12345678-9"
                />
              ) : (
                <span>{estudiante.rut || 'Sin definir'}</span>
              )}
            </td>
          </tr>

          {/* ✅ INPUT CONTROLADO - Teléfono */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Teléfono</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="tel" 
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+56912345678"
                />
              ) : (
                <span>{estudiante.telefono || 'Sin definir'}</span>
              )}
            </td>
          </tr>

          {/* Año Ingreso Beca */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Año Ingreso Beca</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="number" 
                  value={estudiante.informacionAcademica?.año_ingreso_beca || ''}
                  onChange={(e) => handleInputChange('año_ingreso_beca', parseInt(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <span>{estudiante.informacionAcademica?.año_ingreso_beca || 'Sin definir'}</span>
              )}
            </td>
          </tr>

          {/* ✅ INPUT CONTROLADO - Fecha de Nacimiento */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Fecha de Nacimiento</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="date" 
                  value={formData.fecha_de_nacimiento}
                  onChange={(e) => handleInputChange('fecha_de_nacimiento', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

          {/* Edad (calculada, no editable) */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Edad</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{calcularEdad(formData.fecha_de_nacimiento || estudiante.fecha_de_nacimiento)}</span>
            </td>
          </tr>

          {/* Género - Campo no disponible aún */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Género</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span className="text-gray-400 italic">Campo no disponible en backend</span>
            </td>
          </tr>

          {/* ✅ INPUT CONTROLADO - Email */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Email</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ejemplo@correo.com"
                />
              ) : (
                <span>{estudiante.email || 'Sin definir'}</span>
              )}
            </td>
          </tr>

          {/* Dirección - Campo no disponible */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Dirección</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span className="text-gray-400 italic">Campo no disponible en backend</span>
            </td>
          </tr>

          {/* Información Académica Previa (Liceo) - Solo lectura por ahora */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Liceo</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{getInfoAcademicaData('colegio')}</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Especialidad</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{getInfoAcademicaData('especialidad_colegio')}</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Comuna Liceo</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{getInfoAcademicaData('comuna_colegio')}</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Promedios Enseñanza Media</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{formatearPromedios()}</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Puntajes PAES 2021/1|2</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{formatearPuntajesPAES()}</span>
            </td>
          </tr>

          {/* Información Universidad/Carrera - Solo lectura */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Carrera</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{getInstitucionData('carrera_especialidad')}</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Duración Carrera</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{getInstitucionData('duracion')}</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Universidad</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{getInstitucionData('nombre')}</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Vía de acceso</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{getInfoAcademicaData('via_acceso')}</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Trayectoria Académica</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{getTrayectoriaAcademica()}</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Otros Beneficios</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{getInfoAcademicaData('beneficios')}</span>
            </td>
          </tr>

          {/* Status Detalle - Consolidado */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Status Detalle</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <textarea 
                  className="w-full min-h-[100px] px-2 py-1 border border-gray-300 rounded resize-y"
                  placeholder="Detalles del status académico..."
                  defaultValue={'Sin definir'}
                />
              ) : (
                <span>Sin definir</span>
              )}
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
                defaultValue={estudiante.observaciones || ''}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};