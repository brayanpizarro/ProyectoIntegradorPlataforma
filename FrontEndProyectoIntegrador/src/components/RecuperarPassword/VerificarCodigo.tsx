import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

export const VerificarCodigo: React.FC = () => {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigo) {
      setError('Por favor, ingresa el código');
      return;
    }

    if (!email) {
      setError('Email no encontrado. Vuelve a solicitar la recuperación.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const isValid = await authService.verifyResetCode(email, codigo);
      
      if (isValid) {
        navigate('/nueva-password', { state: { email, codigo } });
      } else {
        setError('Código inválido o expirado');
      }
      
    } catch (error: any) {
      console.error('Error verificando código:', error);
      setError('Error al verificar el código. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Verificar Código</h1>
          <p>Ingresa el código que recibiste en tu email</p>
          {email && <p className="email-info">Email: {email}</p>}
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="codigo">Código de Verificación</label>
            <input
              type="text"
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="123456"
              disabled={loading}
              required
              maxLength={6}
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
            {loading ? 'Verificando...' : 'Verificar Código'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            <button
              type="button"
              className="link-button"
              onClick={() => navigate('/solicitar-recuperacion')}
            >
              ← Solicitar nuevo código
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};