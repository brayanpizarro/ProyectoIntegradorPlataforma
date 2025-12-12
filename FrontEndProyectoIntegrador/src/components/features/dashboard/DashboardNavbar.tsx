/**
 * Barra de navegación superior del Dashboard
 * Muestra logo, navegación y acciones del usuario
 */
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Box, Typography, Button, Chip } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';

interface DashboardNavbarProps {
  usuario: any;
  onLogout: () => void;
}

export function DashboardNavbar({ usuario, onLogout }: DashboardNavbarProps) {
  const navigate = useNavigate();
  // Verificar role de manera flexible (compatibilidad temporal)
  const userRole = usuario?.role || usuario?.tipo || usuario?.rol;
  const isAdmin = userRole === 'admin';

  // Log para debug
  console.log('🔍 Usuario en navbar:', usuario);
  console.log('🔍 Role detectado:', userRole);
  console.log('🔍 Es admin?:', isAdmin);

  return (
    <AppBar
      position="static"
      elevation={2}
      sx={{
        backgroundColor: '#4db6ac',
        color: 'white'
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1 }}>
        {/* Logo y navegación */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              '&:hover': { opacity: 0.9 }
            }}
            onClick={() => navigate('/dashboard')}
          >
            <AccountBalanceIcon sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight="bold">
              Fundación
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Dashboard
            </Button>
            {isAdmin && (
              <Button
                variant="outlined"
                startIcon={<PeopleIcon />}
                onClick={() => navigate('/admin/usuarios')}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Gestión de Usuarios
              </Button>
            )}
          </Box>
        </Box>

        {/* Información de usuario y acciones */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip
            label={
              <Box component="span">
                <Box component="span" sx={{ opacity: 0.8 }}>{userRole || 'Usuario'}:</Box>
                {' '}
                <Box component="span" sx={{ fontWeight: 600 }}>{usuario?.email || 'Cargando...'}</Box>
              </Box>
            }
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '0.875rem'
            }}
          />

          <Button
            variant="text"
            startIcon={<AccountCircleIcon />}
            onClick={() => navigate('/perfil')}
            title="Ver perfil"
            sx={{
              color: 'white',
              textTransform: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            Perfil
          </Button>

          <Button
            variant="contained"
            startIcon={<LogoutIcon />}
            onClick={onLogout}
            sx={{
              backgroundColor: '#ff6f61',
              color: 'white',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#e55b4e'
              }
            }}
          >
            Cerrar Sesión
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
