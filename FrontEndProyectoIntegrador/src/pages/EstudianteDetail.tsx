import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/authService';
import PermissionService from '../services/permissionService';
import { encontrarEstudiantePorId } from '../data/mockData';
import type { Usuario } from '../types';

export const EstudianteDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/');
      return;
    }
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, [navigate]);

  const canManageStudents = PermissionService.canManageStudents(currentUser);
  const canViewInterviews = PermissionService.canViewInterviews(currentUser);
  const canManageInterviews = PermissionService.canManageInterviews(currentUser);

  const estudiante = encontrarEstudiantePorId(id || '0');

  const handleActualizarDatos = () => {
    setMostrarFormulario(true);
  };

  const handleIngresarEntrevista = () => {
    if (estudiante) {
      navigate(`/entrevista/${estudiante.id}`);
    }
  };

  if (!estudiante) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Estudiante no encontrado</h2>
        <button 
          onClick={() => navigate(-1)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          ← Volver
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <button 
            onClick={() => navigate(-1)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            ← Volver
          </button>
          
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
              Usuario: {localStorage.getItem('user') || 'Admin'}
            </p>
          </div>
        </div>

        <h1 style={{ 
          margin: 0, 
          fontSize: '2rem', 
          color: '#1f2937' 
        }}>
          📊 Detalle del Estudiante
        </h1>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          margin: '0 0 1.5rem 0', 
          color: '#1f2937',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '0.5rem'
        }}>
          👤 {estudiante.nombres} {estudiante.apellidos}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          <div>
            <h3>📋 Información Personal</h3>
            <div style={{ lineHeight: '1.6' }}>
              <p><strong>RUT:</strong> {estudiante.rut}</p>
              <p><strong>Email:</strong> {estudiante.email}</p>
              <p><strong>Universidad:</strong> {estudiante.universidad}</p>
              <p><strong>Carrera:</strong> {estudiante.carrera}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {canManageStudents && (
          <button
            onClick={handleActualizarDatos}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            📝 Actualizar Datos
          </button>
        )}
        
        {canManageInterviews && (
          <button
            onClick={handleIngresarEntrevista}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            💬 Ingresar a Entrevista
          </button>
        )}

        <button
          onClick={() => navigate(`/avance-curricular/${estudiante.id}`)}
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          🎓 Avance Curricular
        </button>

        {!canViewInterviews && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#fef3c7',
            borderRadius: '0.5rem',
            border: '1px solid #fbbf24',
            color: '#92400e',
            fontSize: '0.875rem',
            width: '100%'
          }}>
            ℹ️ Como invitado, puedes ver la información del estudiante pero no tienes acceso a las entrevistas.
          </div>
        )}
      </div>

      {mostrarFormulario && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem'
          }}>
            <h3>Actualizar datos del estudiante</h3>
            <p>Funcionalidad en desarrollo...</p>
            <button
              onClick={() => setMostrarFormulario(false)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};