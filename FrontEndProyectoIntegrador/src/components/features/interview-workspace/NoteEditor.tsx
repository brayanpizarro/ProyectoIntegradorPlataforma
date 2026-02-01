import { useState, useEffect, useMemo } from 'react';
import type { Estudiante } from '../../../types';
import { entrevistaService } from '../../../services';

// INTERFACE: Estructura de notas
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
  entrevistaId: string | null;
  showFiltersExternal?: boolean;
  onFiltersVisibilityChange?: (visible: boolean) => void;
}

export function NoteEditor({
  tabId,
  sectionTitle,
  estudiante,
  entrevistaId,
  showFiltersExternal,
  onFiltersVisibilityChange
}: NoteEditorProps) {
  const draftKey = useMemo(() => {
    // Clave de almacenamiento local por entrevista y etiqueta
    const entrevistaKey = entrevistaId || estudiante?.id_estudiante || 'sin-entrevista';
    return `entrevistaDraft:${entrevistaKey}:${sectionTitle}`;
  }, [entrevistaId, estudiante?.id_estudiante, sectionTitle]);

  // ESTADOS: Gestión de notas y búsqueda
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const updateShowFilters = (visible: boolean) => {
    setShowFilters(visible);
    onFiltersVisibilityChange?.(visible);
  };

  useEffect(() => {
    if (typeof showFiltersExternal === 'boolean') {
      setShowFilters(showFiltersExternal);
    }
  }, [showFiltersExternal]);

  // CARGAR NOTAS: Cargar desde backend
  useEffect(() => {
    // Intentar cargar borrador local en cuanto monta
    if (!draftLoaded) {
      try {
        const stored = localStorage.getItem(draftKey);
        if (stored) setNewNote(stored);
      } catch {
        // ignorar errores de storage
      } finally {
        setDraftLoaded(true);
      }
    }

    const loadNotas = async () => {
      if (!entrevistaId && !estudiante?.id_estudiante) return;
      try {
        setIsLoading(true);
        let textos = [];
        // Si hay estudiante, cargar todos los textos históricos
        if (estudiante?.id_estudiante) {
          textos = await entrevistaService.getAllTextosByEstudiante(estudiante.id_estudiante.toString());
        } else if (entrevistaId) {
          textos = await entrevistaService.getTextos(entrevistaId);
        }
        // Filtrar por etiqueta (sectionTitle)
        const textosFiltrados = textos.filter(
          (texto: any) => texto.nombre_etiqueta === sectionTitle
        );
        // Convertir a formato Note
        const notasFormateadas: Note[] = textosFiltrados.map((texto: any) => ({
          id: texto.id,
          content: texto.contenido,
          timestamp: new Date(texto.fecha),
        }));
        // Ordenar por fecha descendente
        notasFormateadas.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setNotes(notasFormateadas);
      } catch (error) {
        console.error('Error al cargar notas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadNotas();
  }, [tabId, sectionTitle, entrevistaId, estudiante?.id_estudiante, draftKey, draftLoaded]);

  // Persistir borrador localmente mientras se escribe
  useEffect(() => {
    if (!draftLoaded) return;
    try {
      if (newNote.trim()) {
        localStorage.setItem(draftKey, newNote);
      } else {
        localStorage.removeItem(draftKey);
      }
    } catch {
      // ignorar errores de storage
    }
  }, [newNote, draftKey, draftLoaded]);

  // FUNCIONES: Gestión de notas
  const handleSaveNote = async () => {
    if (!newNote.trim() || !entrevistaId) return;
    
    setIsLoading(true);
    
    try {
      // Guardar en el backend
      const textoGuardado = await entrevistaService.addTexto(entrevistaId, {
        nombre_etiqueta: sectionTitle,
        contenido: newNote.trim(),
        contexto: `Entrevista con ${estudiante.nombre || estudiante.nombres}`
      });
      
      // Añadir a la lista local
      const note: Note = {
        id: textoGuardado.id,
        content: textoGuardado.contenido,
        timestamp: new Date(textoGuardado.fecha),
      };
      
      setNotes(prev => [note, ...prev]);
      setNewNote('');
      try {
        localStorage.removeItem(draftKey);
      } catch {
        // ignorar
      }
    } catch (error) {
      console.error('Error al guardar nota:', error);
      alert('Error al guardar la nota. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // FILTROS: Aplicar búsqueda
  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchTerm || 
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !searchDate || 
      note.timestamp.toISOString().split('T')[0] === searchDate;
    
    return matchesSearch && matchesDate;
  });

  // HELPERS: Formateo de fechas
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
    <div className="h-full flex flex-col bg-white">
      {showFilters && (
        <div className="px-4 pb-3 pt-2 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex-1 min-w-[220px]">
              <label className="block text-xs text-gray-600 mb-1">Texto</label>
              <input
                type="text"
                placeholder="Buscar en las notas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none box-border focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Fecha</label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchDate('');
                }}
                className="px-3 py-2 bg-white border border-gray-300 rounded-md cursor-pointer text-sm text-gray-600"
              >
                Limpiar
              </button>
              <button
                onClick={() => updateShowFilters(false)}
                className="px-3 py-2 bg-[var(--color-turquoise)] text-white border border-[var(--color-turquoise)] rounded-md text-sm"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LISTA DE NOTAS PREVIAS */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-gray-400 text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-sm">
              {notes.length === 0 
                ? `No hay notas sobre ${sectionTitle.toLowerCase()} aún`
                : 'No se encontraron notas con esos criterios'
              }
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
              >
                {/* Header de la nota */}
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] text-gray-500 flex items-center gap-2">
                    <span>🕒</span>
                    <span>{formatDate(note.timestamp)}</span>
                    <span>•</span>
                    <span>{formatTime(note.timestamp)}</span>
                  </div>
                </div>
                
                {/* Contenido de la nota */}
                <div className="text-[13px] text-gray-800 leading-6 whitespace-pre-wrap break-words" style={{ overflowWrap: 'anywhere' }}>
                  {note.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDITOR DE NUEVA NOTA */}
      <div className="border-t border-gray-200 p-3 bg-gray-50">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ✍️ Nueva observación sobre {sectionTitle.toLowerCase()}
          </label>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder={`Escribe tus observaciones sobre ${sectionTitle.toLowerCase()} durante la entrevista...`}
            autoFocus
            className="w-full min-h-[60px] p-3 border border-gray-300 rounded-md text-[13px] font-inherit resize-y outline-none box-border focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                handleSaveNote();
              }
            }}
          />
        </div>
        
        {/* Botones de acción */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            💡 Ctrl+Enter para guardar rápido
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setNewNote('')}
              disabled={!newNote.trim()}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-500 cursor-pointer text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Limpiar
            </button>
            
            <button
              onClick={handleSaveNote}
              disabled={!newNote.trim() || isLoading}
              className={`px-6 py-2 ${newNote.trim() ? 'bg-[var(--color-turquoise)] text-white' : 'bg-gray-200 text-gray-400'} border-none rounded-md cursor-pointer text-sm font-medium flex items-center gap-2 disabled:cursor-not-allowed`}
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