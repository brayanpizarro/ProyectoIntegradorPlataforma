import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { apiService } from '../services/apiService';
import type { Estudiante } from '../types';
import { logger } from '../config';
import { LoadingSpinner, ErrorMessage } from '../components/common';
import { 
  StudentHeader, 
  TabNavigation, 
  ProfileSection,
  PersonalDataSection,
  FamilyInfoSection,
  AcademicReportSection,
  SemesterPerformanceSection,
  InterviewsSection,
  type SeccionActiva 
} from '../components/StudentDetail';

const EstudianteDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [seccionActiva, setSeccionActiva] = useState<SeccionActiva>('perfil');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [loading, setLoading] = useState(true);
  const [mostrarModalNuevaEntrevista, setMostrarModalNuevaEntrevista] = useState(false);
  const [mostrarModalSemestresAnteriores, setMostrarModalSemestresAnteriores] = useState(false);
  const [informesGuardados, setInformesGuardados] = useState<any[]>([]);
  // Estado para almacenar cambios en modo edición (se usará cuando se implementen refs o controlled inputs)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [datosEditados, setDatosEditados] = useState<any>({});

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/');
      return;
    }
    
    const fetchEstudiante = async () => {
      try {
        setLoading(true);
        logger.log('🔍 Cargando estudiante:', id);
        const data = await apiService.getEstudiantePorId(id || '');
        setEstudiante(data);
        logger.log('✅ Estudiante cargado:', data.nombre);
      } catch (error) {
        logger.error('❌ Error al cargar estudiante:', error);
        setEstudiante(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchEstudiante();
  }, [navigate, id]);

  // Cargar historial académico al montar el componente
  useEffect(() => {
    const cargarHistorialAcademico = async () => {
      try {
        // TODO Backend: Cuando el backend esté listo, usar:
        // const historiales = await apiService.getHistorialAcademicoPorEstudiante(id);
        // setInformesGuardados(historiales);
        
        // Por ahora, cargar desde localStorage (mock)
        const historialGuardadoStr = localStorage.getItem(`historial_academico_${id}`);
        if (historialGuardadoStr) {
          const historiales = JSON.parse(historialGuardadoStr);
          setInformesGuardados(historiales);
          logger.log('📂 Historial académico cargado:', historiales.length, 'registros');
        }
      } catch (error) {
        logger.error('❌ Error al cargar historial académico:', error);
      }
    };

    if (id) {
      cargarHistorialAcademico();
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullScreen message="Cargando datos del estudiante..." />;
  }

  if (!estudiante) {
    return (
      <ErrorMessage 
        fullScreen 
        title="Estudiante no encontrado"
        message="No se pudo cargar la información del estudiante"
        onRetry={() => window.location.reload()}
      />
    );
  }

  const handleGuardar = async () => {
    if (!estudiante) return;

    try {
      logger.log('💾 Iniciando guardado de datos del estudiante...', datosEditados);

      // TODO Backend: Cuando el backend esté listo, descomentar estas secciones
      
      // ==========================================
      // 1. ACTUALIZAR DATOS PERSONALES
      // ==========================================
      // Endpoint: PATCH /estudiante/:id
      // Campos editables en PersonalDataSection:
      // - nombre, rut, telefono, fecha_de_nacimiento, email, tipo_de_estudiante
      // - dirección, región, comuna
      // - universidad, carrera, año_ingreso, estado_académico
      // - tipo_beca, monto_beca, duracion_beca
      
      /* TODO Backend: Descomentar cuando esté listo
      if (datosEditados.datosPersonales) {
        const updateData = {
          nombre: datosEditados.datosPersonales.nombre,
          rut: datosEditados.datosPersonales.rut,
          telefono: datosEditados.datosPersonales.telefono,
          fecha_de_nacimiento: datosEditados.datosPersonales.fecha_nacimiento,
          email: datosEditados.datosPersonales.email,
          tipo_de_estudiante: datosEditados.datosPersonales.tipo_estudiante,
          // ... más campos
        };
        
        await apiService.actualizarEstudiante(id, updateData);
        logger.log('✅ Datos personales actualizados');
      }
      */

      // ==========================================
      // 2. ACTUALIZAR INFORMACIÓN FAMILIAR
      // ==========================================
      // Endpoint: PATCH /estudiante/:id/familia (o crear endpoint específico)
      // Campos editables en FamilyInfoSection:
      // - Familiar (tipo: mamá, papá, hermanos, etc.) con nombres y edades
      // - Observaciones de cada familiar
      // - Observaciones generales
      
      /* TODO Backend: Descomentar cuando esté listo
      if (datosEditados.informacionFamiliar) {
        const familiaData = {
          mama: datosEditados.informacionFamiliar.mama,
          papa: datosEditados.informacionFamiliar.papa,
          hermanos: datosEditados.informacionFamiliar.hermanos,
          otros_familiares: datosEditados.informacionFamiliar.otros,
          observaciones_generales: datosEditados.informacionFamiliar.observaciones
        };
        
        await apiService.actualizarInformacionFamiliar(id, familiaData);
        logger.log('✅ Información familiar actualizada');
      }
      */

      // ==========================================
      // 3. ACTUALIZAR INFORME ACADÉMICO GENERAL
      // ==========================================
      // Endpoint: PATCH /historial-academico/:id
      // Campos editables en AcademicReportSection:
      // - Nº de carrera cursada, semestres finalizados, suspendidos
      // - Total ramos aprobados, reprobados, eliminados
      // - Porcentajes de aprobación
      // - Tabla de semestres (año, semestre, ramos, observaciones)
      
      /* TODO Backend: Descomentar cuando esté listo
      if (datosEditados.informeAcademico) {
        const informeData = {
          numero_carreras: datosEditados.informeAcademico.numero_carreras,
          semestres_finalizados: datosEditados.informeAcademico.semestres_finalizados,
          semestres_suspendidos: datosEditados.informeAcademico.semestres_suspendidos,
          semestres_carrera: datosEditados.informeAcademico.semestres_carrera,
          total_ramos_aprobados: datosEditados.informeAcademico.total_aprobados,
          total_ramos_reprobados: datosEditados.informeAcademico.total_reprobados,
          total_eliminados: datosEditados.informeAcademico.total_eliminados,
          porcentaje_aprobados: datosEditados.informeAcademico.porcentaje_aprobados,
          porcentaje_reprobados: datosEditados.informeAcademico.porcentaje_reprobados,
          porcentaje_cursados: datosEditados.informeAcademico.porcentaje_cursados,
          // Tabla de semestres
          semestres: datosEditados.informeAcademico.semestres
        };
        
        // Puede ser actualización de historial existente o creación de uno nuevo
        if (datosEditados.informeAcademico.id_historial) {
          await apiService.actualizarHistorialAcademico(
            datosEditados.informeAcademico.id_historial, 
            informeData
          );
        } else {
          await apiService.crearHistorialAcademico({
            id_estudiante: id,
            ...informeData
          });
        }
        logger.log('✅ Informe académico actualizado');
      }
      */

      // ==========================================
      // 4. ACTUALIZAR DESEMPEÑO POR SEMESTRE
      // ==========================================
      // Endpoint: POST/PATCH /asignatura (o endpoint específico para desempeño)
      // Campos editables en SemesterPerformanceSection:
      // - Asignaturas del semestre actual
      // - Notas, estado (aprobado/reprobado/cursando)
      // - Observaciones por asignatura
      
      /* TODO Backend: Descomentar cuando esté listo
      if (datosEditados.desempenoSemestre) {
        // Guardar cada asignatura del semestre
        for (const asignatura of datosEditados.desempenoSemestre.asignaturas) {
          if (asignatura.id) {
            // Actualizar asignatura existente
            await apiService.actualizarAsignatura(asignatura.id, {
              nombre: asignatura.nombre,
              nota: asignatura.nota,
              estado: asignatura.estado,
              observaciones: asignatura.observaciones
            });
          } else {
            // Crear nueva asignatura
            await apiService.crearAsignatura({
              id_estudiante: id,
              nombre: asignatura.nombre,
              nota: asignatura.nota,
              estado: asignatura.estado,
              observaciones: asignatura.observaciones,
              semestre: datosEditados.desempenoSemestre.semestre,
              año: datosEditados.desempenoSemestre.año
            });
          }
        }
        logger.log('✅ Desempeño por semestre actualizado');
      }
      */

      // ==========================================
      // SIMULACIÓN TEMPORAL (hasta tener backend)
      // ==========================================
      // Por ahora, simular guardado exitoso
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('✅ Cambios guardados correctamente\n\n' +
            '📝 Datos actualizados:\n' +
            '- Datos personales\n' +
            '- Información familiar\n' +
            '- Informe académico\n' +
            '- Desempeño semestre\n\n' +
            '⚠️ NOTA: Actualmente los cambios no persisten (mock).\n' +
            'Descomentar las secciones TODO Backend en handleGuardar() para conectar con el backend real.');

      // Desactivar modo edición después de guardar
      setModoEdicion(false);
      
      // Recargar datos del estudiante
      const dataActualizada = await apiService.getEstudiantePorId(id || '');
      setEstudiante(dataActualizada);
      
      logger.log('✅ Guardado completado');

    } catch (error) {
      logger.error('❌ Error al guardar cambios:', error);
      alert('❌ Error al guardar los cambios\n\nPor favor, intenta nuevamente.');
    }
  };

  const handleGenerarInforme = async () => {
    try {
      const añoActual = new Date().getFullYear();
      const semestreActual = new Date().getMonth() < 6 ? 1 : 2;

      // Estructura que coincide con CreateHistorialAcademicoDto del backend
      const historialData = {
        id_estudiante: id,
        año: añoActual,
        semestre: semestreActual,
        nivel_educativo: estudiante?.institucion?.nivel_educativo || 'Superior',
        ramos_aprobados: 0, // Estos valores vendrían del formulario en modo edición
        ramos_reprobados: 0,
        promedio_semestre: 0,
        trayectoria_academica: [], // Array de observaciones/notas del semestre
      };

      // TODO Backend: Cuando el backend esté listo, usar:
      // const response = await apiService.crearHistorialAcademico(historialData);
      
      // Por ahora, guardar en localStorage (mock)
      const nuevoInforme = {
        id: Date.now(),
        id_historial_academico: Date.now(), // Simula el ID que devolvería el backend
        ...historialData,
        fecha: new Date().toISOString(),
        fechaFormateada: new Date().toLocaleDateString('es-CL', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const informesActualizados = [...informesGuardados, nuevoInforme];
      setInformesGuardados(informesActualizados);
      
      // Guardar en localStorage para persistencia (temporal hasta tener backend)
      localStorage.setItem(`historial_academico_${id}`, JSON.stringify(informesActualizados));
      
      alert(`✅ Informe académico generado correctamente\nAño: ${añoActual}\nSemestre: ${semestreActual}\nFecha: ${nuevoInforme.fechaFormateada}`);
      logger.log('✅ Historial académico guardado:', nuevoInforme);
    } catch (error) {
      logger.error('❌ Error al generar informe:', error);
      alert('❌ Error al generar el informe académico');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <StudentHeader
        nombres={estudiante.nombres || ''}
        apellidos={estudiante.apellidos || ''}
        estado={estudiante.estado || 'Activo'}
        modoEdicion={modoEdicion}
        onToggleEdicion={() => setModoEdicion(!modoEdicion)}
        onGuardar={handleGuardar}
        onGenerarInforme={handleGenerarInforme}
      />

      <TabNavigation
        seccionActiva={seccionActiva}
        onSeccionChange={setSeccionActiva}
      />

      <div className="p-8 max-w-[1400px] mx-auto">
        {seccionActiva === 'perfil' && (
          <ProfileSection estudiante={estudiante} />
        )}

        {seccionActiva === 'personal' && (
          <PersonalDataSection estudiante={estudiante} modoEdicion={modoEdicion} />
        )}

        {seccionActiva === 'familiar' && (
          <FamilyInfoSection modoEdicion={modoEdicion} />
        )}

        {seccionActiva === 'informe' && (
          <div>
            {informesGuardados.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={() => setMostrarModalSemestresAnteriores(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  📋 Ver Semestres Anteriores ({informesGuardados.length})
                </button>
              </div>
            )}
            <AcademicReportSection estudiante={estudiante} modoEdicion={modoEdicion} />
          </div>
        )}

        {seccionActiva === 'desempeno' && (
          <div>
            {informesGuardados.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={() => setMostrarModalSemestresAnteriores(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  📋 Ver Semestres Anteriores ({informesGuardados.length})
                </button>
              </div>
            )}
            <SemesterPerformanceSection modoEdicion={modoEdicion} />
          </div>
        )}

        {seccionActiva === 'entrevistas' && (
          <InterviewsSection onNuevaEntrevista={() => setMostrarModalNuevaEntrevista(true)} />
        )}

        {/* Modal Nueva Entrevista */}
        {mostrarModalNuevaEntrevista && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
            <div className="bg-white rounded-xl p-8 max-w-[500px] w-[90%] shadow-2xl">
              <h3 className="m-0 mb-6 text-2xl font-bold text-gray-800">➕ Nueva Entrevista</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Entrevistador <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  defaultValue={authService.getCurrentUser()?.nombres || 'Usuario Actual'}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-md text-sm bg-gray-50"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Temas Tratados (opcional)
                </label>
                <input 
                  type="text" 
                  placeholder="Ej: Rendimiento académico, situación familiar..."
                  className="w-full p-3 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Observaciones Generales (opcional)
                </label>
                <textarea 
                  placeholder="Observaciones iniciales de la entrevista..."
                  className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md text-sm font-inherit resize-y"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setMostrarModalNuevaEntrevista(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 border-none rounded-md cursor-pointer text-sm font-semibold"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    setMostrarModalNuevaEntrevista(false);
                    navigate(`/entrevista/${id}`);
                  }}
                  className="px-6 py-3 bg-[var(--color-turquoise)] text-white border-none rounded-md cursor-pointer text-sm font-semibold"
                >
                  Crear y Abrir Entrevista
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Ver Semestres Anteriores */}
      {mostrarModalSemestresAnteriores && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-8">
          <div className="bg-white rounded-xl p-8 max-w-[900px] w-full max-h-[90vh] overflow-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="m-0 text-2xl font-bold text-gray-800">📚 Semestres Guardados</h3>
              <button 
                onClick={() => setMostrarModalSemestresAnteriores(false)}
                className="p-2 bg-gray-100 border-none rounded-md cursor-pointer text-xl text-gray-500"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Aquí puedes ver snapshots de semestres anteriores guardados. Selecciona un semestre para ver su información.
            </p>

            {/* Lista de Semestres Guardados */}
            <div className="flex flex-col gap-4">
              {informesGuardados.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">📭 No hay semestres guardados aún</p>
                  <p className="text-sm">Usa el botón "Generar Informe" para guardar el estado actual</p>
                </div>
              ) : (
                informesGuardados.map((historial) => (
                  <div 
                    key={historial.id || historial.id_historial_academico}
                    className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer transition-all hover:border-[var(--color-turquoise)]"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="m-0 mb-2 text-lg font-semibold text-gray-800">
                          {historial.año}/{historial.semestre}S - {historial.nivel_educativo || 'Superior'}
                        </h4>
                        <div className="text-sm text-gray-500 flex flex-col gap-1">
                          <div>
                            <span>📅 Guardado: {historial.fechaFormateada || new Date(historial.created_at || historial.fecha).toLocaleDateString('es-CL')}</span>
                            <span className="mx-2">•</span>
                            <span>🕐 {new Date(historial.created_at || historial.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div>
                            <span>📊 Promedio: {historial.promedio_semestre?.toFixed(1) || 'N/A'}</span>
                            <span className="mx-2">•</span>
                            <span className="text-green-600">✅ {historial.ramos_aprobados || 0} aprobados</span>
                            {historial.ramos_reprobados > 0 && (
                              <>
                                <span className="mx-2">•</span>
                                <span className="text-red-600">❌ {historial.ramos_reprobados} reprobados</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          // TODO Backend: Implementar vista detallada del historial
                          const detalles = `
Ver detalles del historial académico

Año: ${historial.año}
Semestre: ${historial.semestre}
Nivel: ${historial.nivel_educativo || 'N/A'}
Ramos aprobados: ${historial.ramos_aprobados || 0}
Ramos reprobados: ${historial.ramos_reprobados || 0}
Promedio: ${historial.promedio_semestre?.toFixed(2) || 'N/A'}
Trayectoria: ${historial.trayectoria_academica?.length || 0} registros

Esta funcionalidad mostrará el snapshot completo del semestre guardado.
                          `.trim();
                          alert(detalles);
                        }}
                        className="px-4 py-2 bg-[var(--color-turquoise)] text-white border-none rounded-md cursor-pointer text-sm font-medium hover:bg-[var(--color-turquoise)]/90 transition-colors"
                      >
                        Ver Detalle →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="m-0 text-sm text-gray-500">
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
