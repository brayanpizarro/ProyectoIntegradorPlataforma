import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Alert,
  Link,
  CircularProgress
} from '@mui/material';
import { Shield as ShieldIcon } from '@mui/icons-material';
import { authService } from '../../../../services/authService';
import type { LoginCredentials } from '../../../../types';
import { logger } from '../../../../config';
import { isValidEmail } from '../../../../utils/validators';
import { LoginFormContainer } from '../shared';

interface LoginAdminFormProps {
  onAuthChange?: (authenticated: boolean) => void;
}

export function LoginAdminForm({ onAuthChange }: LoginAdminFormProps) {
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
    <LoginFormContainer
      title="Panel de Administración"
      subtitle="Acceso exclusivo para administradores"
      icon={<ShieldIcon sx={{ fontSize: 64, color: '#4db6ac' }} />}
      gradientColors={{ from: '#4db6ac', to: '#ff6f61' }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          fullWidth
          type="email"
          id="email"
          name="email"
          label="Email de Administrador"
          value={credentials.email}
          onChange={handleInputChange}
          placeholder="admin@fundacion.cl"
          disabled={loading}
          required
          autoComplete="email"
          variant="outlined"
          error={!!error}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#f8f9fa',
              '&:hover': {
                backgroundColor: '#fff'
              },
              '&.Mui-focused': {
                backgroundColor: '#fff'
              }
            }
          }}
        />

        <TextField
          fullWidth
          type="password"
          id="password"
          name="password"
          label="Contraseña de Administrador"
          value={credentials.password}
          onChange={handleInputChange}
          placeholder="Contraseña segura"
          disabled={loading}
          required
          autoComplete="current-password"
          variant="outlined"
          error={!!error}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#f8f9fa',
              '&:hover': {
                backgroundColor: '#fff'
              },
              '&.Mui-focused': {
                backgroundColor: '#fff'
              }
            }
          }}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{
            mt: 1,
            py: 1.5,
            background: 'linear-gradient(135deg, #4db6ac 0%, #ff6f61 100%)',
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'none',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(77, 182, 172, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(77, 182, 172, 0.4)',
              background: 'linear-gradient(135deg, #4db6ac 0%, #ff6f61 100%)'
            },
            '&:disabled': {
              background: 'rgba(0, 0, 0, 0.12)',
              transform: 'none'
            }
          }}
        >
          {loading ? 'Verificando credenciales...' : 'Acceder al Panel'}
        </Button>

        <Box sx={{ mt: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={() => navigate('/solicitar-recuperacion')}
            sx={{
              color: '#4db6ac',
              textDecoration: 'underline',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
              '&:hover': {
                color: '#ff6f61'
              }
            }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={() => navigate('/')}
            sx={{
              color: '#4db6ac',
              textDecoration: 'underline',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
              '&:hover': {
                color: '#ff6f61'
              }
            }}
          >
            ← Volver al login general
          </Link>
        </Box>
      </Box>
    </LoginFormContainer>
  );
};