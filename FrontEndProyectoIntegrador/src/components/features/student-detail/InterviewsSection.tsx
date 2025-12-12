/**
 * Sección de entrevistas
 * Lista de entrevistas con botón para agregar nueva
 */
import React from 'react';
import { EntrevistaReportGenerator } from '../../EntrevistaReportGenerator';

interface InterviewsSectionProps {
  onNuevaEntrevista: () => void;
  estudiante?: any;
}

export const InterviewsSection: React.FC<InterviewsSectionProps> = ({ onNuevaEntrevista, estudiante }) => {
  const mockEntrevistas = [
    { 
      id: 1,
      fecha: '2025.05.15', 
      tipo: 'Seguimiento Académico', 
      observaciones: 'Buen desempeño general. Estudiante motivado.',
      tutor: 'María Silva',
      temas_abordados: 'Rendimiento académico, motivación, planificación',
      texto_0: 'El estudiante muestra un compromiso excepcional con sus estudios.',
      texto_1: 'Se trabajó en estrategias de organización del tiempo para el próximo semestre.',
      comentarios_0: 'Mantener el buen desempeño',
      comentarios_1: 'Reforzar técnicas de estudio'
    },
    { 
      id: 2,
      fecha: '2025.03.10', 
      tipo: 'Inicio de Semestre', 
      observaciones: 'Estudiante con expectativas altas para el semestre.',
      tutor: 'Juan Pérez',
      temas_abordados: 'Objetivos del semestre, planificación académica',
      texto_0: 'Reunión de inicio de semestre muy productiva.',
      texto_1: 'Se establecieron metas claras para los próximos meses.',
      comentarios_0: 'Seguimiento mensual recomendado'
    },
    { 
      id: 3,
      fecha: '2024.12.05', 
      tipo: 'Cierre de Semestre', 
      observaciones: 'Excelente rendimiento. Aprobó todos los ramos.',
      tutor: 'Ana Torres',
      temas_abordados: 'Evaluación del semestre, logros obtenidos',
      texto_0: 'Cierre de semestre exitoso con todas las asignaturas aprobadas.',
      comentarios_0: 'Felicitaciones por el esfuerzo'
    },
  ];

  // Generar entrevista consolidada con todos los datos
  const entrevistaConsolidada = {
    id: 'consolidado',
    fecha: new Date(),
    estudiante: estudiante || {
      nombre: 'Estudiante',
      apellido_paterno: '',
      apellido_materno: '',
      rut: '',
      email: '',
      telefono: '',
      fecha_nacimiento: '',
      genero: '',
      direccion: '',
      id: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    tutor: 'Reporte Consolidado',
    temas_abordados: `Resumen de ${mockEntrevistas.length} entrevistas realizadas`,
    observaciones: `Este documento contiene el historial completo de entrevistas del estudiante.`,
    ...mockEntrevistas.reduce((acc, ent, idx) => {
      acc[`texto_${idx}`] = `[${ent.fecha}] ${ent.tipo}: ${ent.observaciones}`;
      acc[`comentarios_${idx}`] = `Tutor: ${ent.tutor} - ${ent.temas_abordados}`;
      return acc;
    }, {} as any),
    created_at: new Date(),
    updated_at: new Date()
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Entrevistas</h2>
        <div className="flex gap-3">
          <EntrevistaReportGenerator entrevista={entrevistaConsolidada} />
          <button 
            onClick={onNuevaEntrevista}
            className="px-5 py-2.5 bg-[var(--color-turquoise)] text-white rounded-lg hover:bg-[var(--color-turquoise-light)] transition-colors text-sm font-medium"
          >
            ➕ Nueva Entrevista
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {mockEntrevistas.map((entrevista, idx) => (
          <div 
            key={idx} 
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{entrevista.tipo}</h3>
                <p className="text-sm text-gray-500">Fecha: {entrevista.fecha}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                Completada
              </span>
            </div>
            
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Observaciones:</p>
              <p className="text-sm text-gray-600">{entrevista.observaciones}</p>
            </div>

            <div className="mt-4 flex gap-3">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                👁️ Ver Detalle
              </button>
              <button className="px-4 py-2 bg-[var(--color-turquoise)]/10 text-[var(--color-turquoise)] rounded-lg hover:bg-[var(--color-turquoise)]/20 transition-colors text-sm">
                ✏️ Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {mockEntrevistas.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow-md border border-gray-200 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold mb-2">No hay entrevistas registradas</h3>
          <p className="text-gray-500 mb-6">
            Comienza agregando la primera entrevista del estudiante.
          </p>
          <button 
            onClick={onNuevaEntrevista}
            className="px-6 py-3 bg-[var(--color-turquoise)] text-white rounded-lg hover:bg-[var(--color-turquoise-light)] transition-colors text-sm font-medium"
          >
            ➕ Agregar Primera Entrevista
          </button>
        </div>
      )}
    </div>
  );
};
