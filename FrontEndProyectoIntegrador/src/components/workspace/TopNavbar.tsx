import React from 'react';
import type { Estudiante } from '../../types';

interface TopNavbarProps {
  estudiante: Estudiante;
  onNavigateBack: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ estudiante, onNavigateBack }) => {
  // ✅ DATOS: Obtener información con compatibilidad híbrida
  const nombreCompleto = estudiante.nombre || 
    `${estudiante.nombres || ''} ${estudiante.apellidos || ''}`.trim();
  const carrera = estudiante.carrera || estudiante.informacionAcademica?.carrera || 'Sin especificar';
  const universidad = estudiante.universidad || 
    estudiante.institucion?.nombre_institucion || 
    'Sin especificar';

  return (
    <div style={{
      height: '64px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      {/* ✅ LADO IZQUIERDO: Logo y navegación */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Botón volver */}
        <button
          onClick={onNavigateBack}
          style={{
            padding: '0.5rem',
            backgroundColor: '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: '#475569'
          }}
        >
          ← Volver
        </button>
        
        {/* Breadcrumb */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          color: '#64748b'
        }}>
          <span>Entrevistas</span>
          <span>→</span>
          <span style={{ color: '#1e293b', fontWeight: '500' }}>
            {nombreCompleto}
          </span>
        </div>
      </div>

      {/* ✅ CENTRO: Información del estudiante */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flex: 1,
        justifyContent: 'center'
      }}>
        {/* Avatar del estudiante */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#e0f2fe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          color: '#0891b2'
        }}>
          👤
        </div>
        
        {/* Datos del estudiante */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1e293b'
          }}>
            {nombreCompleto}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#64748b'
          }}>
            {carrera} • {universidad}
          </div>
        </div>
      </div>

      {/* ✅ LADO DERECHO: Usuario actual */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        {/* Indicador de sesión activa */}
        <div style={{
          padding: '0.25rem 0.75rem',
          backgroundColor: '#dcfce7',
          color: '#166534',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '500'
        }}>
          🟢 Entrevista Activa
        </div>
        
        {/* Avatar del usuario actual */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          A
        </div>
        
        {/* Información del usuario */}
        <div style={{ fontSize: '0.875rem' }}>
          <div style={{ color: '#1e293b', fontWeight: '500' }}>Admin</div>
          <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Entrevistador</div>
        </div>
      </div>
    </div>
  );
};