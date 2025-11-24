/**
 * Barra de navegación superior del Dashboard
 * Muestra logo, navegación y acciones del usuario
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardNavbarProps {
  usuario: any;
  onLogout: () => void;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ usuario, onLogout }) => {
  const navigate = useNavigate();
  // Verificar role de manera flexible (compatibilidad temporal)
  const userRole = usuario?.role || usuario?.tipo || usuario?.rol;
  const isAdmin = userRole === 'admin';
  
  // Log para debug
  console.log('🔍 Usuario en navbar:', usuario);
  console.log('🔍 Role detectado:', userRole);
  console.log('🔍 Es admin?:', isAdmin);

  return (
    <nav className="bg-[var(--color-turquoise)] text-white px-8 py-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/dashboard')}>
          🏛️ Fundación
        </h1>
        <div className="flex items-center gap-2 ml-4">
          <button
            className="bg-transparent border border-white/30 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
            onClick={() => navigate('/dashboard')}
          >
            📊 Dashboard
          </button>
          {isAdmin && (
            <button
              className="bg-transparent border border-white/30 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
              onClick={() => navigate('/admin/usuarios')}
            >
              👥 Gestión de Usuarios
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm px-3 py-1 bg-white/10 rounded-lg">
          <span className="opacity-80">{userRole || 'Usuario'}:</span>{' '}
          <span className="font-semibold">{usuario?.email || 'Cargando...'}</span>
        </div>
        
        <button
          className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm flex items-center gap-2"
          onClick={() => navigate('/perfil')}
          title="Ver perfil"
        >
          👤 Perfil
        </button>
        
        <button
          onClick={onLogout}
          className="bg-[var(--color-coral-dark)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-coral)] transition-colors text-sm font-medium"
        >
          🚪 Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};
