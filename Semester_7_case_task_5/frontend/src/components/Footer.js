import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        p: 2,
        textAlign: 'center',
        backgroundColor: '#f0f0f0',
      }}
    >
      <Typography variant="body2">©2025 MoneyFlow</Typography>
    </Box>
  );
}

export default Footer;
