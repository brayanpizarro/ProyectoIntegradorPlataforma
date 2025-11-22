/**
 * Panel de acciones rápidas del Dashboard
 * Proporciona botones para crear estudiantes, ver reportes y exportar datos
 */
import React from 'react';

interface QuickActionsPanelProps {
  onNuevoEstudiante?: () => void;
  onVerReportes?: () => void;
  onExportarDatos?: () => void;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  onNuevoEstudiante,
  onVerReportes,
  onExportarDatos,
}) => {
  const handleNuevoEstudiante = () => {
    if (onNuevoEstudiante) {
      onNuevoEstudiante();
    } else {
      alert('Funcionalidad para crear nuevo estudiante - Por implementar');
    }
  };

  const handleVerReportes = () => {
    if (onVerReportes) {
      onVerReportes();
    } else {
      alert('Funcionalidad de reportes - Por implementar');
    }
  };

  const handleExportarDatos = () => {
    if (onExportarDatos) {
      onExportarDatos();
    } else {
      alert('Funcionalidad de exportación - Por implementar');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-bold mb-4">
        Acciones Rápidas
      </h3>
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={handleNuevoEstudiante}
          className="bg-[var(--color-turquoise)] text-white px-6 py-3 rounded-lg hover:bg-[var(--color-turquoise-light)] transition-colors text-sm font-medium"
        >
          👤 Nuevo Estudiante
        </button>
        <button
          onClick={handleVerReportes}
          className="bg-[var(--color-coral)] text-white px-6 py-3 rounded-lg hover:bg-[var(--color-coral-dark)] transition-colors text-sm font-medium"
        >
          📊 Ver Reportes
        </button>
        <button
          onClick={handleExportarDatos}
          className="bg-[var(--color-orange)] text-white px-6 py-3 rounded-lg hover:bg-[var(--color-yellow)] transition-colors text-sm font-medium"
        >
          📁 Exportar Datos
        </button>
      </div>
    </div>
  );
};
