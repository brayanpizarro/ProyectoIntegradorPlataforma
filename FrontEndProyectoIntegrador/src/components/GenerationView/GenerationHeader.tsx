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
    <div className="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-5">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Estudiantes Generación {generationYear}
        </h1>
        <p className="text-gray-600 text-lg">
          {totalStudents} estudiante{totalStudents !== 1 ? 's' : ''} encontrado{totalStudents !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← Volver al Dashboard
        </button>
        <button
          onClick={onAddStudent}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Agregar Estudiante
        </button>
      </div>
    </div>
  );
};
