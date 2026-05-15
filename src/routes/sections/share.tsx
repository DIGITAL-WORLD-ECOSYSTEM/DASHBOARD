import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));

// ----------------------------------------------------------------------

/**
 * Layout ultra-minimalista para compartilhamento público
 * Totalmente isolado para evitar redirecionamentos de autenticação
 */
const shareLayout = () => (
  <Box
    sx={{
      py: 10,
      textAlign: 'center',
      bgcolor: 'background.default',
      minHeight: '100vh',
    }}
  >
    <Typography variant="h2">PÁGINA PÚBLICA DE TESTE</Typography>
    <Typography variant="body1">Se você está vendo isso, a rota pública está funcionando sem login.</Typography>
  </Box>
);

export const shareRoutes: RouteObject[] = [
  {
    path: 'share',
    children: [
      { path: 'analytics', element: shareLayout() },
    ],
  },
];
