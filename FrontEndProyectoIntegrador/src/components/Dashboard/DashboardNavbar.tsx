/**
 * Barra de navegación superior del Dashboard
 * Muestra logo, usuario actual y botón de cerrar sesión
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardNavbarProps {
  usuario: any;
  onLogout: () => void;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ usuario, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-[var(--color-turquoise)] text-white px-8 py-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-bold">
          🏛️ Fundación
        </h1>
        <button
          className="bg-transparent border border-white/30 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => navigate('/dashboard')}
        >
          Inicio
        </button>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm">{usuario?.tipo || 'Usuario'}: {usuario?.email || 'Cargando...'}</span>
        <button
          onClick={onLogout}
          className="bg-[var(--color-coral-dark)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-coral)] transition-colors text-sm font-medium"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};
