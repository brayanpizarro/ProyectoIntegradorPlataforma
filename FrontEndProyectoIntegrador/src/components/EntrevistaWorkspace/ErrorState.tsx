import React from 'react';

interface ErrorStateProps {
  error: string;
  onBack: () => void;
}

/**
 * Error state component for workspace
 */
export const ErrorState: React.FC<ErrorStateProps> = ({ error, onBack }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-md p-8">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar</h2>
        <p className="text-slate-600 mb-4">{error}</p>
        <button 
          onClick={onBack}
          className="px-6 py-3 bg-[var(--color-turquoise)] text-white rounded-lg hover:bg-[var(--color-turquoise-light)] transition-colors"
        >
          ← Volver
        </button>
      </div>
    </div>
  );
};
