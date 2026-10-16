import type { RouteObject } from 'react-router';

import { lazy } from 'react';
import { Outlet, Navigate } from 'react-router';

import { DevOSApp } from 'src/app-devos';

import { devosRoutes } from './devos';

// ----------------------------------------------------------------------

const Page404 = lazy(() => import('src/pages/error/404'));
const DesignSystemPage = lazy(() => import('src/pages/dashboard/design-system'));

function DevOSAppLayout() {
  return (
    <DevOSApp>
      <Outlet />
    </DevOSApp>
  );
}

/**
 * Rotas exclusivas do DevOS Desktop (Control Plane).
 *
 * Inclui:
 * - Redirecionamento da raiz desktop para /dev
 * - Cockpit e módulos administrativos do DevOS (devosRoutes)
 * - Catálogo do Design System (/design-system)
 * - Fallback 404
 *
 * Envolvidas exclusivamente pela composição DevOSApp,
 * SEM instanciar CheckoutProvider ou ChatRealtimeProvider.
 */
export const desktopRoutes: RouteObject[] = [
  {
    element: <DevOSAppLayout />,
    children: [
      { path: '/', element: <Navigate to="/dev" replace /> },
      ...devosRoutes,
      { path: 'design-system', element: <DesignSystemPage /> },
      { path: '*', element: <Page404 /> },
    ],
  },
];

export default desktopRoutes;
