import React from 'react';
import { Box, Typography } from '@mui/material';

interface SectionDividerProps {
  titulo: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ titulo }) => {
  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        textAlign: 'center',
        py: 2,
        mb: 3,
        borderRadius: 1,
      }}
    >
      <Typography variant="h6" component="h2" fontWeight="bold">
        {titulo}
      </Typography>
    </Box>
  );
};
