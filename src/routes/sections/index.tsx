import type { RouteObject } from 'react-router';

import { lazy } from 'react';
import { Navigate } from 'react-router';

import { authRoutes } from './auth';
import { shareRoutes } from './share';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';

// ----------------------------------------------------------------------

const Page404 = lazy(() => import('src/pages/error/404'));

export const routesSection: RouteObject[] = [
  // Share
  ...shareRoutes,

  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  // Auth
  ...authRoutes,

  // Dashboard
  ...dashboardRoutes,

  /**
   * Main routes (Disabled for single-page-public login)
   * ...mainRoutes,
   */

  // Components
  ...componentsRoutes,

  // No match
  { path: '*', element: <Page404 /> },
];
