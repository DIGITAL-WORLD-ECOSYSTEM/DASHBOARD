import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';

import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));

// ----------------------------------------------------------------------

/**
 * Layout minimalista para compartilhamento público
 * Esconde sidebar e header para focar nos dados
 */
const shareLayout = () => (
  <DashboardLayout
    slotProps={{
      header: { sx: { display: 'none' } },
    }}
    sx={{
      [`& .MuiDrawer-root`]: { display: 'none' },
      [`& .MuiAppBar-root`]: { display: 'none' },
      [`& #main-content`]: { p: 0, pt: 0, pl: 0, transition: 'none' },
      [`& .layout-sidebar-container`]: { pl: 0, transition: 'none' },
    }}
  >
    <Suspense fallback={<LoadingScreen />}>
      <OverviewAnalyticsPage />
    </Suspense>
  </DashboardLayout>
);

export const shareRoutes: RouteObject[] = [
  {
    path: 'share',
    children: [
      { path: 'analytics', element: shareLayout() },
    ],
  },
];
