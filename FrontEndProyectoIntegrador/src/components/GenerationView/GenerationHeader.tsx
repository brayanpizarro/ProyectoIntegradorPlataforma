import React from 'react';

interface GenerationHeaderProps {
  generationYear: number;
  totalStudents: number;
  onBack: () => void;
  onAddStudent: () => void;
}

/**
 * Header component for generation view
 * Shows generation year, total students, and action buttons
 */
export const GenerationHeader: React.FC<GenerationHeaderProps> = ({
  generationYear,
  totalStudents,
  onBack,
  onAddStudent,
}) => {
  return (
    <div className="mb-8">
      {/* Breadcrumb / Navigation */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
        <button 
          onClick={onBack}
          className="hover:text-[var(--color-turquoise)] transition-colors flex items-center gap-1"
        >
          <span>← Dashboard</span>
        </button>
        <span>/</span>
        <span className="text-gray-900 font-medium">Generación {generationYear}</span>
      </div>

      {/* Header con estilo de carpeta */}
      <div className="bg-gradient-to-r from-[var(--color-turquoise)] to-[var(--color-turquoise-light)] text-white rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Icono de carpeta */}
            <div className="text-6xl">📁</div>
            <div>
              <h1 className="text-3xl font-bold mb-1">
                Generación {generationYear}
              </h1>
              <p className="text-white/90 text-lg flex items-center gap-2">
                <span>👥</span>
                {totalStudents} estudiante{totalStudents !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          {/* Botón de acción destacado */}
          <button
            onClick={onAddStudent}
            className="px-6 py-3 bg-white text-[var(--color-turquoise)] rounded-lg hover:bg-gray-50 transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Agregar Estudiante
          </button>
        </div>
      </div>
    </div>
  );
};
