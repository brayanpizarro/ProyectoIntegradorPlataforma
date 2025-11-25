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
    alert('Funcionalidad de generación de informe - Por implementar');
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
          <AcademicReportSection estudiante={estudiante} />
        )}

        {seccionActiva === 'desempeno' && (
          <SemesterPerformanceSection modoEdicion={modoEdicion} />
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
              {/* Semestre 2024/2S */}
              <div className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer transition-all hover:border-[var(--color-turquoise)]">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="m-0 mb-2 text-lg font-semibold text-gray-800">
                      Semestre 2024/2S
                    </h4>
                    <div className="text-sm text-gray-500">
                      <span>📅 Guardado: 20/12/2024</span>
                      <span className="mx-2">•</span>
                      <span>📊 Promedio: 5.2</span>
                      <span className="mx-2">•</span>
                      <span>📚 5 ramos (4 aprobados, 1 reprobado)</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[var(--color-turquoise)] text-white border-none rounded-md cursor-pointer text-sm font-medium">
                    Ver Detalle →
                  </button>
                </div>
              </div>

              {/* Semestre 2024/1S */}
              <div className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer transition-all hover:border-[var(--color-turquoise)]">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="m-0 mb-2 text-lg font-semibold text-gray-800">
                      Semestre 2024/1S
                    </h4>
                    <div className="text-sm text-gray-500">
                      <span>📅 Guardado: 30/06/2024</span>
                      <span className="mx-2">•</span>
                      <span>📊 Promedio: 5.5</span>
                      <span className="mx-2">•</span>
                      <span>📚 6 ramos (6 aprobados)</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[var(--color-turquoise)] text-white border-none rounded-md cursor-pointer text-sm font-medium">
                    Ver Detalle →
                  </button>
                </div>
              </div>

              {/* Semestre 2023/2S */}
              <div className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer transition-all hover:border-[var(--color-turquoise)]">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="m-0 mb-2 text-lg font-semibold text-gray-800">
                      Semestre 2023/2S
                    </h4>
                    <div className="text-sm text-gray-500">
                      <span>📅 Guardado: 15/12/2023</span>
                      <span className="mx-2">•</span>
                      <span>📊 Promedio: 5.8</span>
                      <span className="mx-2">•</span>
                      <span>📚 6 ramos (6 aprobados)</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[var(--color-turquoise)] text-white border-none rounded-md cursor-pointer text-sm font-medium">
                    Ver Detalle →
                  </button>
                </div>
              </div>
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
