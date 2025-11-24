import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { logger } from '../../config';
import type { LoginCredentials } from '../../types';

export const LoginForm: React.FC = () => {
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
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      logger.log('🔐 Intentando iniciar sesión...');
      const response = await authService.login(credentials);
      
      logger.log('✅ Login exitoso, redirigiendo según tipo de usuario...');
      
      switch (response.user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'academico':
          navigate('/academico');
          break;
        case 'estudiante':
          navigate('/estudiante');
          break;
        default:
          setError('Tipo de usuario no reconocido');
      }
      
    } catch (error: any) {
      logger.error('❌ Error en login:', error);
      
      if (error.response?.status === 401) {
        setError('Email o contraseña incorrectos');
      } else if (error.response?.status === 404) {
        setError('Usuario no encontrado');
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Error al iniciar sesión. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5">
      <div className="bg-white rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] p-10 w-full max-w-[400px] animate-[slideIn_0.6s_ease-out]">
        <div className="text-center mb-8">
          <h1 className="text-[#2c3e50] text-[2rem] mb-2.5 font-bold">Iniciar Sesión</h1>
          <p className="text-[#6c757d] text-base m-0">Plataforma de Gestión - Fundación</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[#495057] font-semibold text-sm">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              placeholder="tu@email.com"
              disabled={loading}
              required
              className="px-4 py-3 border-2 border-[#e9ecef] rounded-[10px] text-base transition-all duration-300 bg-[#f8f9fa] focus:outline-none focus:border-[#667eea] focus:bg-white focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[#495057] font-semibold text-sm">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Tu contraseña"
              disabled={loading}
              required
              className="px-4 py-3 border-2 border-[#e9ecef] rounded-[10px] text-base transition-all duration-300 bg-[#f8f9fa] focus:outline-none focus:border-[#667eea] focus:bg-white focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
          
          {error && (
            <div className="bg-[#f8d7da] text-[#721c24] px-4 py-3 rounded-lg text-sm text-center border border-[#f5c6cb]">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none px-5 py-3.5 rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 mt-2.5 hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_8px_20px_rgba(102,126,234,0.3)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div className="mt-6 text-center flex flex-col gap-2.5">
          <p>
            <button
              type="button"
              className="bg-transparent border-none text-[#667eea] underline cursor-pointer text-sm transition-colors duration-300 hover:text-[#764ba2]"
              onClick={() => navigate('/solicitar-recuperacion')}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </p>
          <p>
            <button
              type="button"
              className="bg-transparent border-none text-[#667eea] underline cursor-pointer text-sm transition-colors duration-300 hover:text-[#764ba2]"
              onClick={() => navigate('/login-admin')}
            >
              Acceso Administrador
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};