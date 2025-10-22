import React, { useState, useEffect } from 'react';
import type { Estudiante } from '../../types';

// ✅ INTERFACE: Estructura de notas
interface Note {
  id: string;
  content: string;
  timestamp: Date;
  tags?: string[];
}

interface NoteEditorProps {
  tabId: string;
  sectionTitle: string;
  estudiante: Estudiante;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  tabId,
  sectionTitle,
  estudiante
}) => {
  // ✅ ESTADOS: Gestión de notas y búsqueda
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ✅ CARGAR NOTAS: Simular carga desde backend
  useEffect(() => {
    // TODO Backend: Cargar notas reales de la sección específica
    // Por ahora usaremos datos mock
    const mockNotes: Note[] = [
      {
        id: '1',
        content: `Conversación sobre ${sectionTitle.toLowerCase()}. El estudiante menciona que...`,
        timestamp: new Date(Date.now() - 86400000), // Ayer
      },
      {
        id: '2',
        content: `Seguimiento de ${sectionTitle.toLowerCase()}. Progreso observado en...`,
        timestamp: new Date(Date.now() - 172800000), // Hace 2 días
      }
    ];
    setNotes(mockNotes);
  }, [tabId, sectionTitle]);

  // ✅ FUNCIONES: Gestión de notas
  const handleSaveNote = () => {
    if (!newNote.trim()) return;
    
    setIsLoading(true);
    
    // Simular guardado en backend
    setTimeout(() => {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote.trim(),
        timestamp: new Date(),
      };
      
      setNotes(prev => [note, ...prev]);
      setNewNote('');
      setIsLoading(false);
      
      // TODO Backend: Enviar nota al servidor
      console.log('Guardando nota:', {
        estudianteId: estudiante.id_estudiante || estudiante.id,
        seccion: sectionTitle,
        contenido: note.content,
        fecha: note.timestamp
      });
    }, 500);
  };

  // ✅ FILTROS: Aplicar búsqueda
  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchTerm || 
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !searchDate || 
      note.timestamp.toISOString().split('T')[0] === searchDate;
    
    return matchesSearch && matchesDate;
  });

  // ✅ HELPERS: Formateo de fechas
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-CL');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white'
    }}>
      {/* ✅ HEADER DE LA SECCIÓN */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#fafafa'
      }}>
        <h3 style={{
          margin: '0 0 0.5rem 0',
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#1e293b'
        }}>
          📝 {sectionTitle}
        </h3>
        <p style={{
          margin: 0,
          fontSize: '0.875rem',
          color: '#64748b'
        }}>
          Notas de entrevista para {estudiante.nombre || 
            `${estudiante.nombres} ${estudiante.apellidos}`}
        </p>
      </div>

      {/* ✅ BARRA DE BÚSQUEDA */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        gap: '0.75rem'
      }}>
        {/* Búsqueda por texto */}
        <div style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Buscar en las notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #cbd5e1',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#cbd5e1';
            }}
          />
        </div>
        
        {/* Búsqueda por fecha */}
        <div>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '1px solid #cbd5e1',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          />
        </div>
        
        {/* Limpiar filtros */}
        {(searchTerm || searchDate) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSearchDate('');
            }}
            style={{
              padding: '0.5rem',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#64748b'
            }}
          >
            🗑️
          </button>
        )}
      </div>

      {/* ✅ LISTA DE NOTAS PREVIAS */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem'
      }}>
        {filteredNotes.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: '#94a3b8',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
            <div style={{ fontSize: '0.875rem' }}>
              {notes.length === 0 
                ? `No hay notas sobre ${sectionTitle.toLowerCase()} aún`
                : 'No se encontraron notas con esos criterios'
              }
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem'
                }}
              >
                {/* Header de la nota */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>🕒</span>
                    <span>{formatDate(note.timestamp)}</span>
                    <span>•</span>
                    <span>{formatTime(note.timestamp)}</span>
                  </div>
                </div>
                
                {/* Contenido de la nota */}
                <div style={{
                  fontSize: '0.875rem',
                  color: '#1e293b',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap'
                }}>
                  {note.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ EDITOR DE NUEVA NOTA */}
      <div style={{
        borderTop: '1px solid #e2e8f0',
        padding: '1rem',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.25rem'
          }}>
            ✍️ Nueva observación sobre {sectionTitle.toLowerCase()}
          </label>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder={`Escribe tus observaciones sobre ${sectionTitle.toLowerCase()} durante la entrevista...`}
            autoFocus
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '0.75rem',
              border: '1px solid #cbd5e1',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#cbd5e1';
              e.target.style.boxShadow = 'none';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                handleSaveNote();
              }
            }}
          />
        </div>
        
        {/* Botones de acción */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#64748b'
          }}>
            💡 Ctrl+Enter para guardar rápido
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setNewNote('')}
              disabled={!newNote.trim()}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'white',
                border: '1px solid #cbd5e1',
                borderRadius: '0.375rem',
                color: '#64748b',
                cursor: newNote.trim() ? 'pointer' : 'not-allowed',
                fontSize: '0.875rem',
                opacity: newNote.trim() ? 1 : 0.5
              }}
            >
              Limpiar
            </button>
            
            <button
              onClick={handleSaveNote}
              disabled={!newNote.trim() || isLoading}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: newNote.trim() ? '#3b82f6' : '#e2e8f0',
                color: newNote.trim() ? 'white' : '#9ca3af',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: newNote.trim() ? 'pointer' : 'not-allowed',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {isLoading ? (
                <>
                  <span>⏳</span>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Guardar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};