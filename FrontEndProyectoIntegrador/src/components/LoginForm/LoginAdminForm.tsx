import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import type { LoginCredentials } from '../../types';
import './LoginForm.css';

export const LoginAdminForm: React.FC = () => {
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
      console.log('👨‍💼 Intentando login de administrador...');
      await authService.loginAdmin(credentials);
      
      console.log('✅ Login admin exitoso, redirigiendo al dashboard...');
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('❌ Error en login admin:', error);
      
      if (error.response?.status === 401) {
        setError('Credenciales de administrador incorrectas');
      } else if (error.response?.status === 403) {
        setError('No tienes permisos de administrador');
      } else if (error.message === 'Usuario no es administrador') {
        setError('Este usuario no tiene permisos de administrador');
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Error al iniciar sesión como administrador');
      }
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