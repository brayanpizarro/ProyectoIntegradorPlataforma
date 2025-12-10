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

  const handleGuardar = () => {
    alert('Funcionalidad de guardado - Por implementar');
  };

  const handleGenerarInforme = () => {
    // Capturar los datos actuales del informe académico y desempeño
    const nuevoInforme = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      fechaFormateada: new Date().toLocaleDateString('es-CL', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      semestre: `${new Date().getFullYear()}-${new Date().getMonth() < 6 ? '1S' : '2S'}`,
      // Aquí se guardarían los datos del formulario
      // Por ahora guardamos estructura básica
    };

    const informesActualizados = [...informesGuardados, nuevoInforme];
    setInformesGuardados(informesActualizados);
    
    // Guardar en localStorage para persistencia
    localStorage.setItem(`informes_estudiante_${id}`, JSON.stringify(informesActualizados));
    
    alert(`✅ Informe generado correctamente\nSemestre: ${nuevoInforme.semestre}\nFecha: ${nuevoInforme.fechaFormateada}`);
    logger.log('✅ Informe guardado:', nuevoInforme);
  };

  // Cargar informes guardados al montar el componente
  useEffect(() => {
    const informesGuardadosStr = localStorage.getItem(`informes_estudiante_${id}`);
    if (informesGuardadosStr) {
      try {
        const informes = JSON.parse(informesGuardadosStr);
        setInformesGuardados(informes);
        logger.log('📂 Informes cargados:', informes.length);
      } catch (error) {
        logger.error('❌ Error al cargar informes:', error);
      }
    }
  }, [id]);

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
                informesGuardados.map((informe) => (
                  <div 
                    key={informe.id}
                    className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer transition-all hover:border-[var(--color-turquoise)]"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="m-0 mb-2 text-lg font-semibold text-gray-800">
                          Semestre {informe.semestre}
                        </h4>
                        <div className="text-sm text-gray-500">
                          <span>📅 Guardado: {informe.fechaFormateada}</span>
                          <span className="mx-2">•</span>
                          <span>🕐 {new Date(informe.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => alert(`Ver detalles del semestre ${informe.semestre}\n\nEsta funcionalidad mostrará:\n- Informe Académico General\n- Desempeño por Semestre\n- Datos guardados en ese momento`)}
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
