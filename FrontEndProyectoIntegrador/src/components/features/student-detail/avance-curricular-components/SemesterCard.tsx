import React from 'react';
import { Box, Paper, Typography, IconButton, Tooltip, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Droppable } from '@hello-pangea/dnd';

interface SemesterCardProps {
  semestre: number;
  periodo?: string;
  fechaInicio?: string;
  fechaFin?: string;
  ramoCount: number;
  onAddSubject: () => void;
  onEditSemester: () => void;
  children: React.ReactNode;
}

export const SemesterCard: React.FC<SemesterCardProps> = ({
  semestre,
  periodo,
  fechaInicio,
  fechaFin,
  ramoCount,
  onAddSubject,
  onEditSemester,
  children,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 2,
          borderColor: 'primary.main',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Semestre {semestre}
          </Typography>
          {periodo && (
            <Chip 
              label={periodo} 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
              }} 
            />
          )}
          <Chip 
            label={`${ramoCount} ramos`} 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
            }} 
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Agregar ramo">
            <IconButton 
              size="small" 
              onClick={onAddSubject}
              sx={{ 
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar semestre">
            <IconButton 
              size="small" 
              onClick={onEditSemester}
              sx={{ 
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Información adicional */}
      {(fechaInicio || fechaFin) && (
        <Box
          sx={{
            bgcolor: 'grey.50',
            px: 2,
            py: 1,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            gap: 2,
          }}
        >
          {fechaInicio && (
            <Typography variant="caption" color="text.secondary">
              Inicio: {new Date(fechaInicio).toLocaleDateString()}
            </Typography>
          )}
          {fechaFin && (
            <Typography variant="caption" color="text.secondary">
              Fin: {new Date(fechaFin).toLocaleDateString()}
            </Typography>
          )}
        </Box>
      )}

      {/* Contenido - Lista de ramos */}
      <Droppable droppableId={`semestre-${semestre}`}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              p: 2,
              minHeight: 120,
              bgcolor: snapshot.isDraggingOver ? 'action.hover' : 'transparent',
              transition: 'background-color 0.2s',
            }}
          >
            {children}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Paper>
  );
};
