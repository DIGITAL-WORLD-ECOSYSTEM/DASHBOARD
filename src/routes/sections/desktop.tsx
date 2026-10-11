import type { RouteObject } from 'react-router';

import { lazy } from 'react';
import { Outlet, Navigate } from 'react-router';

import { DevOSApp } from 'src/app-devos';

import { devosRoutes } from './devos';

// ----------------------------------------------------------------------

const Page404 = lazy(() => import('src/pages/error/404'));

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
 * - Fallback 404
 *
 * Envolvidas exclusivamente pela composição DevOSApp,
 * SEM instanciar CheckoutProvider ou ChatRealtimeProvider.
 *
 * ISOLAMENTO: Não importa App, authRoutes, shareRoutes ou dashboardRoutes.
 */
export const desktopRoutes: RouteObject[] = [
  {
    element: <DevOSAppLayout />,
    children: [
      { path: '/', element: <Navigate to="/dev" replace /> },
      ...devosRoutes,
      { path: '*', element: <Page404 /> },
    ],
  },
];

export default desktopRoutes;
