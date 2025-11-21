import React from 'react';

interface LoadingStateProps {
  message?: string;
}

/**
 * Loading state component for workspace
 */
export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Preparando entrevista' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h2 className="text-2xl font-bold text-gray-900">Cargando workspace...</h2>
        <p className="text-slate-600">{message}</p>
      </div>
    </div>
  );
};
