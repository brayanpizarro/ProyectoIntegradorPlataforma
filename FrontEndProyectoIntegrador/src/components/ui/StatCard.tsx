import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

interface StatCardProps {
  /** Icono o emoji a mostrar */
  icon: string;
  /** Título descriptivo de la estadística */
  label: string;
  /** Valor numérico o string de la estadística */
  value: string | number;
  /** Color de acento opcional */
  accentColor?: string;
}

/**
 * Tarjeta reutilizable para mostrar estadísticas
 * Migrado a MUI - Usada en Dashboard y otras vistas de resumen
 */
export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  accentColor,
}) => {
  return (
    <Card 
      elevation={2}
      sx={{ 
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        }
      }}
      role="region"
      aria-label={`${label}: ${value}`}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography 
            variant="h2" 
            component="div" 
            sx={{ fontSize: '2.5rem' }}
            aria-hidden="true"
          >
            {icon}
          </Typography>
          <Box flex={1}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              gutterBottom
            >
              {label}
            </Typography>
            <Typography 
              variant="h4" 
              component="p" 
              fontWeight="bold"
              sx={{ 
                color: accentColor || 'text.primary',
              }}
            >
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
