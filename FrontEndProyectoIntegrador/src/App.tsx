import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/authService';
import PermissionService from './services/permissionService';
import { LoginAdminForm } from './components/LoginForm/LoginAdminForm';
import { Dashboard } from './pages/Dashboard';
import GeneracionViewSimple from './pages/GeneracionViewSimple';
import { EstudianteDetail } from './pages/EstudianteDetail';
import { EntrevistaWorkspace } from './pages/EntrevistaWorkspace';
import { AvanceCurricular } from './pages/AvanceCurricular';
import { UserProfile } from './pages/UserProfile';
import { UserManagement } from './pages/UserManagement';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      console.log('🔐 Estado de autenticación:', authenticated);
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Función para actualizar el estado de autenticación
  const handleAuthChange = (authenticated: boolean) => {
    console.log('🔄 Cambiando estado de autenticación a:', authenticated);
    setIsAuthenticated(authenticated);
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Cargando...</h2>
          <p>Verificando autenticación</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <LoginAdminForm onAuthChange={handleAuthChange} />
          }
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
              <Dashboard onAuthChange={handleAuthChange} /> : 
              <Navigate to="/" replace />
          }
        />
        <Route 
          path="/generacion/:id" 
          element={
            isAuthenticated ? 
              <GeneracionViewSimple /> : 
              <Navigate to="/" replace />
          }
        />
        <Route 
          path="/estudiante/:id" 
          element={
            isAuthenticated ? 
              <EstudianteDetail /> : 
              <Navigate to="/" replace />
          }
        />
        <Route 
          path="/entrevista/:id" 
          element={
            isAuthenticated && PermissionService.canManageInterviews(authService.getCurrentUser()) ? 
              <EntrevistaWorkspace /> : 
              <Navigate to="/dashboard" replace />
          }
        />
        <Route 
          path="/avance-curricular/:id" 
          element={
            isAuthenticated ? 
              <AvanceCurricular /> : 
              <Navigate to="/" replace />
          }
        />
        <Route 
          path="/profile" 
          element={
            isAuthenticated ? 
              <UserProfile /> : 
              <Navigate to="/" replace />
          }
        />
        <Route 
          path="/users" 
          element={
            isAuthenticated && PermissionService.canManageUsers(authService.getCurrentUser()) ? 
              <UserManagement /> : 
              <Navigate to="/dashboard" replace />
          }
        />
        <Route 
          path="/test" 
          element={
            <div style={{ padding: '20px', backgroundColor: 'cyan', color: 'black' }}>
              <h1>Página de Debug</h1>
              <p>Estado actual:</p>
              <ul>
                <li>Token: {localStorage.getItem('token') || 'No existe'}</li>
                <li>Usuario: {localStorage.getItem('user') || 'No existe'}</li>
                <li>Autenticado: {isAuthenticated ? 'SÍ' : 'NO'}</li>
              </ul>
              <button 
                onClick={() => {
                  localStorage.clear();
                  setIsAuthenticated(false);
                  window.location.href = '/';
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                🗑️ Limpiar localStorage y ir al login
              </button>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;