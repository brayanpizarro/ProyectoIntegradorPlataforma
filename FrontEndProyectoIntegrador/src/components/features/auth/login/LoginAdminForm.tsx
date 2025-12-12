import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../../services/authService';
import type { LoginCredentials } from '../../../../types';
import { logger } from '../../../../config';
import { isValidEmail } from '../../../../utils/validators';

interface LoginAdminFormProps {
  onAuthChange?: (authenticated: boolean) => void;
}

export const LoginAdminForm: React.FC<LoginAdminFormProps> = ({ onAuthChange }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empieza a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    logger.log('🔍 Datos del formulario (admin):', { email: credentials.email });
    
    if (!credentials.email || !credentials.password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    if (!isValidEmail(credentials.email)) {
      setError('Por favor, ingresa un email válido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      logger.log('👨‍💼 Intentando login de administrador...');
      await authService.login(credentials);
      logger.log('✅ Login exitoso');
      
      // Notificar al componente padre que la autenticación cambió
      if (onAuthChange) {
        onAuthChange(true);
      }
      
      navigate('/dashboard');
      
    } catch (error: any) {
      logger.error('❌ Error en login:', error);
      setError('Credenciales incorrectas. Por favor, verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-turquoise)] to-[var(--color-coral)] p-5">
      <div className="bg-white rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] p-10 w-full max-w-[400px] animate-[slideIn_0.6s_ease-out]">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🛡️</div>
          <h1 className="text-[#2c3e50] text-[2rem] mb-2.5 font-bold">Panel de Administración</h1>
          <p className="text-[#6c757d] text-base m-0">Acceso exclusivo para administradores</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[#495057] font-semibold text-sm">Email de Administrador</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              placeholder="admin@fundacion.cl"
              disabled={loading}
              required
              aria-label="Email de administrador"
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
              autoComplete="email"
              className="px-4 py-3 border-2 border-[#e9ecef] rounded-[10px] text-base transition-all duration-300 bg-[#f8f9fa] focus:outline-none focus:border-[var(--color-turquoise)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(77,182,172,0.1)] disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[#495057] font-semibold text-sm">Contraseña de Administrador</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Contraseña segura"
              disabled={loading}
              required
              aria-label="Contraseña de administrador"
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
              autoComplete="current-password"
              className="px-4 py-3 border-2 border-[#e9ecef] rounded-[10px] text-base transition-all duration-300 bg-[#f8f9fa] focus:outline-none focus:border-[var(--color-turquoise)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(77,182,172,0.1)] disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
          
          {error && (
            <div className="bg-[#f8d7da] text-[#721c24] px-4 py-3 rounded-lg text-sm text-center border border-[#f5c6cb]" role="alert" aria-live="polite">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="bg-gradient-to-br from-[var(--color-turquoise)] to-[var(--color-coral)] text-white border-none px-5 py-3.5 rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 mt-2.5 hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_8px_20px_rgba(77,182,172,0.3)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            disabled={loading}
          >
            {loading ? 'Verificando credenciales...' : 'Acceder al Panel'}
          </button>
        </form>
        
        <div className="mt-6 text-center flex flex-col gap-2.5">
          <p>
            <button
              type="button"
              className="bg-transparent border-none text-[var(--color-turquoise)] underline cursor-pointer text-sm transition-colors duration-300 hover:text-[var(--color-coral)]"
              onClick={() => navigate('/')}
            >
              ← Volver al login general
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};