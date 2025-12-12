/**
 * Panel de filtros y búsqueda para el Dashboard
 * Permite buscar, filtrar y ordenar generaciones
 */
import { Paper, Box, Typography, TextField, MenuItem, Button, Alert } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

interface FilterPanelProps {
  busqueda: string;
  filtroEstado: 'todas' | 'activas' | 'finalizadas';
  ordenarPor: 'año' | 'estudiantes';
  resultadosCount: number;
  onBusquedaChange: (value: string) => void;
  onFiltroEstadoChange: (value: 'todas' | 'activas' | 'finalizadas') => void;
  onOrdenarPorChange: (value: 'año' | 'estudiantes') => void;
  onLimpiarFiltros: () => void;
}

export function FilterPanel({
  busqueda,
  filtroEstado,
  ordenarPor,
  resultadosCount,
  onBusquedaChange,
  onFiltroEstadoChange,
  onOrdenarPorChange,
  onLimpiarFiltros,
}: FilterPanelProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 4,
        border: '1px solid',
        borderColor: 'grey.200'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <SearchIcon sx={{ color: '#4db6ac' }} />
        <Typography variant="h6" fontWeight="bold">
          Filtros y Búsqueda
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 2,
          alignItems: 'end'
        }}
      >
        {/* Búsqueda por año */}
        <TextField
          fullWidth
          label="Buscar por año"
          placeholder="Ej: 2024, 2023..."
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          size="small"
          variant="outlined"
        />

        {/* Filtro por estado */}
        <TextField
          fullWidth
          select
          label="Estado"
          value={filtroEstado}
          onChange={(e) => onFiltroEstadoChange(e.target.value as any)}
          size="small"
          variant="outlined"
        >
          <MenuItem value="todas">Todas las generaciones</MenuItem>
          <MenuItem value="activas">Solo activas</MenuItem>
          <MenuItem value="finalizadas">Solo finalizadas</MenuItem>
        </TextField>

        {/* Ordenar por */}
        <TextField
          fullWidth
          select
          label="Ordenar por"
          value={ordenarPor}
          onChange={(e) => onOrdenarPorChange(e.target.value as any)}
          size="small"
          variant="outlined"
        >
          <MenuItem value="año">Año (más reciente)</MenuItem>
          <MenuItem value="estudiantes">Cantidad de estudiantes</MenuItem>
        </TextField>

        {/* Botón limpiar filtros */}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={onLimpiarFiltros}
          sx={{
            textTransform: 'none',
            borderColor: 'grey.300',
            color: 'text.secondary',
            '&:hover': {
              borderColor: 'grey.400',
              backgroundColor: 'grey.50'
            }
          }}
        >
          Limpiar filtros
        </Button>
      </Box>

      {/* Resultados de búsqueda */}
      <Alert
        severity="info"
        icon={false}
        sx={{ mt: 2, backgroundColor: 'grey.100', color: 'text.secondary' }}
      >
        <strong>{resultadosCount}</strong> generación(es) encontrada(s)
        {busqueda && (
          <span> • Búsqueda: "{busqueda}"</span>
        )}
        {filtroEstado !== 'todas' && (
          <span> • Estado: {filtroEstado}</span>
        )}
      </Alert>
    </Paper>
  );
}
