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
    genero: estudiante.genero || '',
    direccion: estudiante.direccion || '',
    fecha_de_nacimiento: estudiante.fecha_de_nacimiento 
      ? (typeof estudiante.fecha_de_nacimiento === 'string' 
          ? estudiante.fecha_de_nacimiento.split('T')[0]
          : new Date(estudiante.fecha_de_nacimiento).toISOString().split('T')[0])
      : '',
    año_ingreso_beca: estudiante.informacionAcademica?.año_ingreso_beca ?? '',
    // Campos de información académica del liceo
    colegio: estudiante.informacionAcademica?.colegio ?? '',
    especialidad_colegio: estudiante.informacionAcademica?.especialidad_colegio ?? '',
    comuna_colegio: estudiante.informacionAcademica?.comuna_colegio ?? '',
    // Campos de información universitaria
    carrera_especialidad: estudiante.institucion?.carrera_especialidad ?? '',
    duracion: estudiante.institucion?.duracion ?? '',
    universidad: estudiante.institucion?.nombre ?? '',
    via_acceso: estudiante.informacionAcademica?.via_acceso ?? ''
  });

  // ✅ Actualizar formData cuando cambie el estudiante
  useEffect(() => {
    const newFormData = {
      nombre: estudiante.nombre || '',
      rut: estudiante.rut || '',
      telefono: estudiante.telefono || '',
      email: estudiante.email || '',
      genero: estudiante.genero || '',
      direccion: estudiante.direccion || '',
      fecha_de_nacimiento: estudiante.fecha_de_nacimiento 
        ? (typeof estudiante.fecha_de_nacimiento === 'string' 
            ? estudiante.fecha_de_nacimiento.split('T')[0]
            : new Date(estudiante.fecha_de_nacimiento).toISOString().split('T')[0])
        : '',
      año_ingreso_beca: estudiante.informacionAcademica?.año_ingreso_beca ?? '',
      // Campos de información académica del liceo
      colegio: estudiante.informacionAcademica?.colegio ?? '',
      especialidad_colegio: estudiante.informacionAcademica?.especialidad_colegio ?? '',
      comuna_colegio: estudiante.informacionAcademica?.comuna_colegio ?? '',
      // Campos de información universitaria
      carrera_especialidad: estudiante.institucion?.carrera_especialidad ?? '',
      duracion: estudiante.institucion?.duracion ?? '',
      universidad: estudiante.institucion?.nombre ?? '',
      via_acceso: estudiante.informacionAcademica?.via_acceso ?? ''
    };
    console.log('🔄 Inicializando formData:', newFormData);
    console.log('🎓 Año ingreso beca del estudiante:', estudiante.informacionAcademica?.año_ingreso_beca);
    setFormData(newFormData);
  }, [estudiante]);

  // ✅ Handler para cambios en inputs
  const handleInputChange = (campo: string, valor: any) => {
    console.log(`📝 Cambiando campo: ${campo}, valor:`, valor);
    setFormData(prev => {
      const newData = {
        ...prev,
        [campo]: valor
      };
      console.log(`📝 FormData actualizado:`, newData);
      return newData;
    });

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

          {/* Generación */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Generación</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={estudiante.generacion || ''}
                  onBlur={(e) => handleInputChange('generacion', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleInputChange('generacion', e.currentTarget.value);
                    }
                  }}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="2023"
                  maxLength={4}
                />
              ) : (
                <span>{estudiante.generacion || 'Sin definir'}</span>
              )}
            </td>
          </tr>

          {/* Año Ingreso Beca */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Año Ingreso Beca</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  inputMode="numeric"
                  defaultValue={estudiante.informacionAcademica?.año_ingreso_beca || ''}
                  onBlur={(e) => handleInputChange('año_ingreso_beca', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleInputChange('año_ingreso_beca', e.currentTarget.value);
                    }
                  }}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="2023"
                  maxLength={4}
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

          {/* ✅ INPUT CONTROLADO - Género */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Género</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <select 
                  value={formData.genero}
                  onChange={(e) => handleInputChange('genero', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar género</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                  <option value="prefiero_no_decir">Prefiero no decir</option>
                </select>
              ) : (
                <span>{estudiante.genero || 'Sin definir'}</span>
              )}
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

          {/* ✅ INPUT CONTROLADO - Dirección */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Dirección</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  value={formData.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Dirección completa"
                />
              ) : (
                <span>{estudiante.direccion || 'Sin definir'}</span>
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
                  value={formData.colegio ?? ''}
                  onChange={(e) => handleInputChange('colegio', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre del liceo"
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
                  value={formData.especialidad_colegio ?? ''}
                  onChange={(e) => handleInputChange('especialidad_colegio', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Especialidad del liceo"
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
                  value={formData.comuna_colegio ?? ''}
                  onChange={(e) => handleInputChange('comuna_colegio', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Comuna del liceo"
                />
              ) : (
                <span>{getInfoAcademicaData('comuna_colegio')}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Promedios Enseñanza Media</td>
            <td className="p-2 border border-gray-300 bg-white">
              <span>{formatearPromedios()}</span>
            </td>
          </tr>
          
          {/* PAES */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">PAES</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={estudiante.informacionAcademica?.puntajes_admision?.descripcion || ''}
                  onBlur={(e) => handleInputChange('puntajes_paes', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleInputChange('puntajes_paes', e.currentTarget.value);
                    }
                  }}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Matemáticas: 720, Lenguaje: 650"
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
                  value={formData.carrera_especialidad ?? ''}
                  onChange={(e) => handleInputChange('carrera_especialidad', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre de la carrera"
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
                  value={formData.duracion ?? ''}
                  onChange={(e) => handleInputChange('duracion', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 10 semestres, 5 años"
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
                  value={formData.universidad ?? ''}
                  onChange={(e) => handleInputChange('universidad', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre de la universidad"
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
                  value={formData.via_acceso ?? ''}
                  onChange={(e) => handleInputChange('via_acceso', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: PAES, Admisión especial"
                />
              ) : (
                <span>{getInfoAcademicaData('via_acceso')}</span>
              )}
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

          {/* Status Detalle */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Status Detalle</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <textarea 
                  defaultValue={estudiante.status_detalle || ''}
                  onBlur={(e) => handleInputChange('status_detalle', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleInputChange('status_detalle', e.currentTarget.value);
                    }
                  }}
                  className="w-full min-h-[100px] px-2 py-1 border border-gray-300 rounded resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Detalles del status académico..."
                />
              ) : (
                <span>{estudiante.status_detalle || 'Sin definir'}</span>
              )}
            </td>
          </tr>

          {/* Status Detalle */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Status Detalle</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <textarea 
                  defaultValue={estudiante.status_detalle || ''}
                  onBlur={(e) => handleInputChange('status_detalle', e.target.value)}
                  className="w-full min-h-[100px] px-2 py-1 border border-gray-300 rounded resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Detalles del status académico..."
                />
              ) : (
                <span>{estudiante.status_detalle || 'Sin definir'}</span>
              )}
            </td>
          </tr>

          {/* Observaciones */}
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Observaciones</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <textarea 
                  defaultValue={estudiante.observaciones || ''}
                  onBlur={(e) => handleInputChange('observaciones', e.target.value)}
                  className="w-full min-h-[100px] px-2 py-1 border border-gray-300 rounded resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Agregar observaciones..."
                />
              ) : (
                <span>{estudiante.observaciones || 'Sin observaciones'}</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};