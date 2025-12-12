import { useState } from 'react';
import { estudianteService, historialAcademicoService, familiaService } from '../../../../services';
import type { Estudiante } from '../../../../types';
import { logger } from '../../../../config';

interface UseStudentEditingProps {
  id?: string;
  estudiante: Estudiante | null;
  reloadStudentData: () => Promise<void>;
  setInformesGuardados: (fn: (prev: any[]) => any[]) => void;
}

export const useStudentEditing = ({ id, estudiante, reloadStudentData, setInformesGuardados }: UseStudentEditingProps) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [datosEditados, setDatosEditados] = useState<Partial<Estudiante>>({});

  // Handler para capturar cambios en campos editables
  const handleCampoChange = (campo: string, valor: any) => {
    setDatosEditados(prev => ({
      ...prev,
      [campo]: valor
    }));
    
    logger.log(`📝 Campo editado: ${campo} =`, valor);
  };

  // Handler específico para cambios en familia
  const handleFamiliaChange = (campo: string, valor: any) => {
    setDatosEditados(prev => ({
      ...prev,
      familia: {
        ...(prev.familia as any || estudiante?.familia || {}),
        [campo]: valor
      } as any
    }));
    
    logger.log(`👨‍👩‍👧‍👦 Familia editada: ${campo} =`, valor);
  };

  // Handler de guardado con datos editados
  const handleGuardar = async () => {
    if (!estudiante || !id) return;

    // Validar que haya cambios
    if (Object.keys(datosEditados).length === 0) {
      alert('⚠️ No hay cambios para guardar');
      setModoEdicion(false);
      return;
    }

    try {
      logger.log('💾 Guardando cambios:', datosEditados);

      // Separar campos de estudiante vs información académica vs familia
      const camposEstudiante = ['nombre', 'rut', 'telefono', 'email', 'genero', 'direccion', 
        'fecha_de_nacimiento', 'tipo_de_estudiante', 'status', 'generacion', 'numero_carrera', 
        'observaciones', 'status_detalle', 'semestres_suspendidos', 'semestres_total_carrera'];
      
      const camposInfoAcademica = ['año_ingreso_beca', 'colegio', 'especialidad_colegio', 
        'comuna_colegio', 'via_acceso', 'beneficios', 'promedio_1', 'promedio_2', 
        'promedio_3', 'promedio_4', 'puntajes_paes'];

      const datosEstudiante: any = {};
      const datosInfoAcademica: any = {};
      const datosFamilia = datosEditados.familia;

      // Clasificar los cambios
      Object.keys(datosEditados).forEach(campo => {
        if (campo === 'familia') return; // Manejar familia por separado
        
        if (camposEstudiante.includes(campo)) {
          datosEstudiante[campo] = (datosEditados as any)[campo];
        } else if (camposInfoAcademica.includes(campo)) {
          datosInfoAcademica[campo] = (datosEditados as any)[campo];
        }
      });

      // Actualizar estudiante si hay cambios
      if (Object.keys(datosEstudiante).length > 0) {
        await estudianteService.update(id, datosEstudiante);
        logger.log('✅ Datos del estudiante actualizados');
      }

      // Actualizar información académica si hay cambios
      if (Object.keys(datosInfoAcademica).length > 0 && estudiante.informacionAcademica?.id_info_academico) {
        // Convertir año_ingreso_beca a número si existe
        if (datosInfoAcademica.año_ingreso_beca !== undefined) {
          const valor = parseInt(datosInfoAcademica.año_ingreso_beca);
          datosInfoAcademica.año_ingreso_beca = isNaN(valor) ? null : valor;
        }
        
        // Convertir promedios a número
        ['promedio_1', 'promedio_2', 'promedio_3', 'promedio_4'].forEach(campo => {
          if (datosInfoAcademica[campo] !== undefined) {
            const valor = parseFloat(datosInfoAcademica[campo]);
            datosInfoAcademica[campo] = isNaN(valor) ? null : valor;
          }
        });

        // Convertir puntajes_paes a puntajes_admision
        if (datosInfoAcademica.puntajes_paes !== undefined) {
          datosInfoAcademica.puntajes_admision = { descripcion: datosInfoAcademica.puntajes_paes };
          delete datosInfoAcademica.puntajes_paes;
        }

        const infoAcademicaId = estudiante.informacionAcademica.id_info_academico;
        const response = await fetch(`http://localhost:3000/informacion-academica/${infoAcademicaId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosInfoAcademica)
        });
        
        if (!response.ok) throw new Error('Error al actualizar información académica');
        logger.log('✅ Información académica actualizada');
      }

      // Actualizar familia si hay cambios
      if (datosFamilia && estudiante.familia?.id_familia) {
        const familiaId = estudiante.familia.id_familia;
        
        // Preparar datos de familia para el backend
        const familiaPayload: any = {};
        
        // Mapear campos simples
        if (datosFamilia.nombre_madre !== undefined) familiaPayload.nombre_madre = datosFamilia.nombre_madre;
        if (datosFamilia.nombre_padre !== undefined) familiaPayload.nombre_padre = datosFamilia.nombre_padre;
        if (datosFamilia.hermanos !== undefined) familiaPayload.hermanos = datosFamilia.hermanos;
        if (datosFamilia.otros_familiares !== undefined) familiaPayload.otros_familiares = datosFamilia.otros_familiares;
        if (datosFamilia.observaciones !== undefined) familiaPayload.observaciones = datosFamilia.observaciones;
        
        // Manejar descripciones incrementales (arrays)
        if (datosFamilia.descripcion_madre !== undefined) {
          familiaPayload.descripcion_madre = Array.isArray(datosFamilia.descripcion_madre) 
            ? datosFamilia.descripcion_madre 
            : [datosFamilia.descripcion_madre];
        }
        
        if (datosFamilia.descripcion_padre !== undefined) {
          familiaPayload.descripcion_padre = Array.isArray(datosFamilia.descripcion_padre)
            ? datosFamilia.descripcion_padre
            : [datosFamilia.descripcion_padre];
        }

        await familiaService.update(familiaId, familiaPayload);
        logger.log('✅ Información familiar actualizada');
      }
      
      logger.log('✅ Cambios guardados exitosamente');
      
      // Recargar datos actualizados
      await reloadStudentData();
      
      // Limpiar estado temporal y salir del modo edición
      setDatosEditados({});
      setModoEdicion(false);
      
      alert('✅ Cambios guardados correctamente');
      
    } catch (err: any) {
      logger.error('❌ Error al guardar cambios:', err);
      
      // Mensaje de error más específico
      const errorMsg = err.response?.data?.message || err.message || 'Error desconocido';
      alert(`❌ Error al guardar cambios:\n\n${errorMsg}`);
    }
  };

  // Manejar activación/cancelación de modo edición
  const handleToggleEdicion = () => {
    if (!modoEdicion) {
      // Activar modo edición → Limpiar cambios previos
      setDatosEditados({});
      logger.log('✏️ Modo edición ACTIVADO');
    } else {
      // Cancelar edición → Limpiar cambios temporales
      setDatosEditados({});
      logger.log('❌ Modo edición CANCELADO (cambios descartados)');
    }
    setModoEdicion(!modoEdicion);
  };

  // Generar informe académico
  const handleGenerarInforme = async () => {
    if (!id || !estudiante) return;

    try {
      const añoActual = new Date().getFullYear();
      const semestreActual = new Date().getMonth() < 6 ? 1 : 2;

      const historialData = {
        id_estudiante: id,
        año: añoActual,
        semestre: semestreActual,
        nivel_educativo: estudiante.institucion?.nivel_educativo || 'Superior',
        ramos_aprobados: 0,
        ramos_reprobados: 0,
        promedio_semestre: 0,
        trayectoria_academica: [],
      };

      const response = await historialAcademicoService.create(historialData);
      
      const nuevoInforme = {
        ...(response || {}),
        fechaFormateada: new Date().toLocaleDateString('es-CL', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
      };

      setInformesGuardados(prev => [...prev, nuevoInforme]);
      
      logger.log('✅ Informe generado:', nuevoInforme);
      alert(`✅ Informe generado\nAño: ${añoActual} | Semestre: ${semestreActual}`);
    } catch (err: any) {
      logger.error('❌ Error al generar informe:', err);
      alert(`❌ Error al generar informe: ${err.message}`);
    }
  };

  // Crear datos combinados para vista (datos originales + ediciones temporales)
  const getDatosCombinadosParaVista = () => {
    if (!estudiante) return null;
    
    return {
      ...estudiante,
      ...datosEditados
    };
  };

  return {
    modoEdicion,
    datosEditados,
    handleCampoChange,
    handleFamiliaChange,
    handleGuardar,
    handleToggleEdicion,
    handleGenerarInforme,
    getDatosCombinadosParaVista
  };
};