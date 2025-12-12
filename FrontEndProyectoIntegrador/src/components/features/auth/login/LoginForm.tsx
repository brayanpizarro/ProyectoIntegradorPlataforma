import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Alert, Link, CircularProgress, Stack } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { authService } from '../../../../services/authService';
import { logger } from '../../../../config';
import type { LoginCredentials } from '../../../../types';
import { LoginFormContainer } from '../shared';

export function LoginForm() {
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
    <LoginFormContainer
      title="Iniciar Sesión"
      subtitle="Plataforma de Gestión - Fundación"
      icon={<LoginIcon sx={{ fontSize: 64, color: '#667eea' }} />}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          fullWidth
          type="email"
          id="email"
          name="email"
          label="Email"
          value={credentials.email}
          onChange={handleInputChange}
          placeholder="tu@email.com"
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
          label="Contraseña"
          value={credentials.password}
          onChange={handleInputChange}
          placeholder="Tu contraseña"
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'none',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            },
            '&:disabled': {
              background: 'rgba(0, 0, 0, 0.12)',
              transform: 'none'
            }
          }}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>

        <Stack spacing={1} sx={{ mt: 2, textAlign: 'center' }}>
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={() => navigate('/solicitar-recuperacion')}
            sx={{
              color: '#667eea',
              textDecoration: 'underline',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
              '&:hover': {
                color: '#764ba2'
              }
            }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={() => navigate('/login-admin')}
            sx={{
              color: '#667eea',
              textDecoration: 'underline',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
              '&:hover': {
                color: '#764ba2'
              }
            }}
          >
            Acceso Administrador
          </Link>
        </Stack>
      </Box>
    </LoginFormContainer>
  );
}