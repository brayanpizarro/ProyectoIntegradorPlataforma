import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import type { LoginCredentials } from '../../types';
import './LoginForm.css';

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
    
    console.log('🔍 Datos del formulario:', credentials);
    
    if (!credentials.email || !credentials.password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('👨‍💼 Intentando login...');
      const resultado = await authService.login(credentials);
      console.log('📋 Resultado del login:', resultado);
      
      console.log('✅ Login exitoso');
      
      // Notificar al componente padre que la autenticación cambió
      if (onAuthChange) {
        onAuthChange(true);
      }
      
      // También navegar por si acaso
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      setError('Credenciales incorrectas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card admin-card">
        <div className="login-header">
          <div className="admin-icon">🛡️</div>
          <h1>Panel de Administración</h1>
          <p>Acceso exclusivo para administradores</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email de Administrador</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              placeholder="admin@fundacion.cl"
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña de Administrador</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Contraseña segura"
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
            className="login-button admin-button"
            disabled={loading}
          >
            {loading ? 'Verificando credenciales...' : 'Acceder al Panel'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            <button
              type="button"
              className="link-button"
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