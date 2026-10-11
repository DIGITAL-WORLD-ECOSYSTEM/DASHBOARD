import type { RouteObject } from 'react-router';

import { lazy } from 'react';
import { Outlet } from 'react-router';

import App from 'src/app';

import { authRoutes } from './auth';
import { shareRoutes } from './share';
import { dashboardRoutes } from './dashboard';

// ----------------------------------------------------------------------

const Page404 = lazy(() => import('src/pages/error/404'));

function WebAppLayout() {
  return (
    <App>
      <Outlet />
    </App>
  );
}

/**
 * Rotas exclusivas do Dashboard Web (Data Plane).
 *
 * Inclui:
 * - Rotas de autenticação (authRoutes)
 * - Rotas de compartilhamento público (shareRoutes)
 * - Rotas do Dashboard dos associados (dashboardRoutes)
 * - Fallback 404
 *
 * Envolvidas integralmente pelo pipeline de provedores Web (App),
 * incluindo CheckoutProvider e ChatRealtimeProvider.
 *
 * ISOLAMENTO: Não importa DevOSApp, devosRoutes ou qualquer módulo do DevOS.
 */
export const webRoutes: RouteObject[] = [
  {
    element: <WebAppLayout />,
    children: [
      ...shareRoutes,
      ...authRoutes,
      ...dashboardRoutes,
      { path: '*', element: <Page404 /> },
    ],
  },
];

export default webRoutes;
