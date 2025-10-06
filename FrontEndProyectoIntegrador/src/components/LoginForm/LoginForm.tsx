import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import type { LoginCredentials } from '../../types';
import './LoginForm.css';

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
    // Limpiar error cuando el usuario empieza a escribir
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
      console.log('🔐 Intentando iniciar sesión...');
      const response = await authService.login(credentials);
      
      console.log('✅ Login exitoso, redirigiendo según tipo de usuario...');
      
      // Redirigir según el tipo de usuario
      switch (response.usuario.tipo) {
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
      console.error('❌ Error en login:', error);
      
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
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Iniciar Sesión</h1>
          <p>Plataforma de Gestión - Fundación</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              placeholder="tu@email.com"
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Tu contraseña"
              disabled={loading}
              required
            />
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            <button
              type="button"
              className="link-button"
              onClick={() => navigate('/solicitar-recuperacion')}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </p>
          <p>
            <button
              type="button"
              className="link-button"
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