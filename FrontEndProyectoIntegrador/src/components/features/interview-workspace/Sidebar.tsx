import { Box, Typography, List, ListItemButton, Chip, Paper, Divider, Alert } from '@mui/material';
import { Notes as NotesIcon, TableChart as TableChartIcon } from '@mui/icons-material';

interface SidebarSection {
  title: string;
  items: Array<{
    id: string;
    title: string;
    icon: string;
    type: 'note' | 'data';
  }>;
}

interface SidebarProps {
  sections: SidebarSection[];
  onSectionClick: (sectionId: string, sectionTitle: string, type: 'note' | 'data') => void;
  activePanel?: 'left' | 'right';
  splitViewActive?: boolean;
}

export function Sidebar({ 
  sections, 
  onSectionClick, 
  activePanel = 'left',
  splitViewActive = false 
}: SidebarProps) {
  return (
    <Box sx={{ width: 280, minWidth: 280, maxWidth: 280, bgcolor: 'white', borderRight: 1, borderColor: 'grey.200', p: 2, overflowY: 'auto', flexShrink: 0 }}>
      {/* TÍTULO DEL SIDEBAR */}
      <Box sx={{ mb: 3, pb: 2, borderBottom: 1, borderColor: 'grey.200' }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          📝 Etiquetas de Entrevista
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Haz clic para abrir una pestaña
        </Typography>
        
        {/* INDICADOR DE PANEL ACTIVO */}
        {splitViewActive && (
          <Alert
            icon={activePanel === 'left' ? '📋' : '📊'}
            severity={activePanel === 'left' ? 'info' : 'warning'}
            sx={{ mt: 2, py: 0.5 }}
          >
            <Typography variant="caption" fontWeight={600}>
              Abrirá en panel {activePanel === 'left' ? 'izquierdo' : 'derecho'}
            </Typography>
          </Alert>
        )}
      </Box>

      {/* SECCIONES DE ETIQUETAS */}
      {sections.map((section, sectionIndex) => (
        <Box key={sectionIndex} sx={{ mb: 3 }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 1.5, display: 'block' }}>
            {section.title}
          </Typography>
          
          <List sx={{ p: 0 }}>
            {section.items.map((item) => (
              <ListItemButton
                key={item.id}
                onClick={() => onSectionClick(item.id, item.title, item.type)}
                sx={{ 
                  borderRadius: 1.5, 
                  mb: 0.5,
                  py: 1.5,
                  px: 2,
                  display: 'flex',
                  gap: 2,
                  '&:hover': {
                    bgcolor: 'grey.100',
                    transform: 'translateX(4px)',
                    transition: 'all 0.2s'
                  }
                }}
              >
                <Typography sx={{ fontSize: '1.25rem', width: 24, textAlign: 'center' }}>
                  {item.icon}
                </Typography>
                
                <Typography variant="body2" fontWeight={500} sx={{ flex: 1 }}>
                  {item.title}
                </Typography>
                
                <Chip
                  label={item.type === 'note' ? 'NOTA' : 'DATA'}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    bgcolor: item.type === 'note' ? 'info.light' : 'warning.light',
                    color: item.type === 'note' ? 'info.dark' : 'warning.dark'
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      ))}

      {/* LEYENDA */}
      <Paper elevation={0} sx={{ mt: 4, p: 2, bgcolor: 'grey.50', border: 1, borderColor: 'grey.200' }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
          💡 Tipos de pestañas
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label="NOTA" size="small" sx={{ height: 20, fontSize: '0.625rem', fontWeight: 600, bgcolor: 'info.light', color: 'info.dark' }} />
            <Typography variant="caption" color="text.secondary">Tomar apuntes de entrevista</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label="DATA" size="small" sx={{ height: 20, fontSize: '0.625rem', fontWeight: 600, bgcolor: 'warning.light', color: 'warning.dark' }} />
            <Typography variant="caption" color="text.secondary">Ver información del alumno</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}