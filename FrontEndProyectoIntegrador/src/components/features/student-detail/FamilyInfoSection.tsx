import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper 
} from '@mui/material';
import { FamilyMemberRow } from './components';
import type { Estudiante } from '../../../types';

interface FamilyInfoSectionProps {
  estudiante: Estudiante;
  modoEdicion: boolean;
  onFamiliaChange?: (campo: string, valor: any) => void;
}

export function FamilyInfoSection({ 
  estudiante, 
  modoEdicion,
  onFamiliaChange 
}: FamilyInfoSectionProps) {
  // Helper para acceder a datos de familia de forma segura
  const familia = estudiante.familia;
  
  // Formatear descripciones como string para mostrar
  const formatearDescripciones = (descripciones?: string[] | string) => {
    if (!descripciones) return '';
    if (typeof descripciones === 'string') return descripciones;
    if (Array.isArray(descripciones) && descripciones.length === 0) return '';
    if (Array.isArray(descripciones)) return descripciones.join('\n');
    return '';
  };
  
  // Formatear hermanos para mostrar
  const formatearHermanos = () => {
    if (!familia?.hermanos || familia.hermanos.length === 0) return '';
    return familia.hermanos.map(h => h.nombre || h).join('; ');
  };
  
  // Formatear otros familiares
  const formatearOtrosFamiliares = () => {
    if (!familia?.otros_familiares || familia.otros_familiares.length === 0) return '';
    return familia.otros_familiares.map(f => f.nombre || f).join('; ');
  };

  // Helper para obtener observaciones de forma segura
  const getObservacionesHermanos = () => {
    if (!familia?.observaciones_hermanos) return '';
    if (typeof familia.observaciones_hermanos === 'string') return familia.observaciones_hermanos;
    return '';
  };

  const getObservacionesOtrosFamiliares = () => {
    if (!familia?.observaciones_otros_familiares) return '';
    if (typeof familia.observaciones_otros_familiares === 'string') return familia.observaciones_otros_familiares;
    return '';
  };

  const getObservacionesGenerales = () => {
    if (!familia?.observaciones) return '';
    if (typeof familia.observaciones === 'string') return familia.observaciones;
    return '';
  };
  return (
    <Box>
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText', 
          textAlign: 'center', 
          fontWeight: 700, 
          fontSize: '1.25rem', 
          py: 1.5, 
          mb: 3,
          borderRadius: 1
        }}
      >
        Información Familiar
      </Box>
      
      <TableContainer component={Paper} elevation={2}>
        <Table 
          sx={{ minWidth: 650 }}
          aria-label="Tabla de información familiar del estudiante"
        >
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'primary.contrastText', 
                  fontWeight: 700,
                  width: '20%'
                }}
              >
                Familiar
              </TableCell>
              <TableCell 
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'primary.contrastText', 
                  fontWeight: 700 
                }}
              >
                Observaciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <FamilyMemberRow
              label="Mamá"
              nombreValue={familia?.nombre_madre || ''}
              observacionesValue={formatearDescripciones(familia?.descripcion_madre)}
              modoEdicion={modoEdicion}
              nombrePlaceholder="Nombre de la madre"
              observacionesPlaceholder="Observaciones sobre la madre..."
              observacionesRows={4}
              onNombreChange={(valor) => onFamiliaChange?.('nombre_madre', valor)}
              onObservacionesChange={(valor) => onFamiliaChange?.('descripcion_madre', valor)}
            />

            <FamilyMemberRow
              label="Papá"
              nombreValue={familia?.nombre_padre || ''}
              observacionesValue={formatearDescripciones(familia?.descripcion_padre)}
              modoEdicion={modoEdicion}
              nombrePlaceholder="Nombre del padre"
              observacionesPlaceholder="Observaciones sobre el padre..."
              observacionesRows={3}
              onNombreChange={(valor) => onFamiliaChange?.('nombre_padre', valor)}
              onObservacionesChange={(valor) => onFamiliaChange?.('descripcion_padre', valor)}
            />

            <FamilyMemberRow
              label="Hermanas/os"
              nombreValue={formatearHermanos()}
              observacionesValue={getObservacionesHermanos()}
              modoEdicion={modoEdicion}
              nombrePlaceholder="Nombres de hermanos separados por ;"
              observacionesPlaceholder="Observaciones sobre hermanos..."
              observacionesRows={3}
              onNombreChange={(valor) => onFamiliaChange?.('hermanos', valor.split(';').map(h => ({ nombre: h.trim() })))}
              onObservacionesChange={(valor) => onFamiliaChange?.('observaciones_hermanos', valor)}
            />

            <FamilyMemberRow
              label="Otros familiares significativos"
              nombreValue={formatearOtrosFamiliares()}
              observacionesValue={getObservacionesOtrosFamiliares()}
              modoEdicion={modoEdicion}
              nombrePlaceholder="Otros familiares separados por ;"
              observacionesPlaceholder="Observaciones sobre otros familiares..."
              observacionesRows={3}
              onNombreChange={(valor) => onFamiliaChange?.('otros_familiares', valor.split(';').map(f => ({ nombre: f.trim() })))}
              onObservacionesChange={(valor) => onFamiliaChange?.('observaciones_otros_familiares', valor)}
            />

            <FamilyMemberRow
              label="Observaciones Generales"
              nombreValue=""
              observacionesValue={getObservacionesGenerales()}
              modoEdicion={modoEdicion}
              observacionesPlaceholder="Agregar observaciones generales sobre la familia..."
              observacionesRows={4}
              showNameField={false}
              onObservacionesChange={(valor) => onFamiliaChange?.('observaciones', valor)}
            />
          </TableBody>
      </Table>
      </TableContainer>
    </Box>
  );
};

