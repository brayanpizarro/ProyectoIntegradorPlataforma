import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export const SolicitarRecuperacion: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Por favor, ingresa tu email');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await authService.requestPasswordReset(email);
      setMessage('Se ha enviado un código de recuperación a tu email');
      
      // Redirigir a verificar código después de 3 segundos
      setTimeout(() => {
        navigate('/verificar-codigo', { state: { email } });
      }, 3000);
      
    } catch (error: any) {
      console.error('Error solicitando recuperación:', error);
      setError('Error al solicitar recuperación. Verifica tu email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Recuperar Contraseña</h1>
          <p>Ingresa tu email para recibir un código de recuperación</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              disabled={loading}
              required
            />
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {message && (
            <div className="success-message">
              {message}
            </div>
          )}
          
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Código'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            <button
              type="button"
              className="link-button"
              onClick={() => navigate('/')}
            >
              ← Volver al login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};