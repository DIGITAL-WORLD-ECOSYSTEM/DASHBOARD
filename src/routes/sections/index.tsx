import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';

import { DevOSApp } from 'src/app-devos';

import { webRoutes } from './web';
import { devosRoutes } from './devos';

// ----------------------------------------------------------------------

function DevOSDevLayout() {
  return (
    <DevOSApp>
      <Outlet />
    </DevOSApp>
  );
}

/**
 * Registro de rotas unificado para ambiente de desenvolvimento local (Vite dev server).
 *
 * Permite que desenvolvedores acessem:
 * - A rota raiz `/` e todas as rotas do Dashboard Web através do pipeline completo (webRoutes).
 * - A rota `/dev` e módulos administrativos do DevOS isolados sob sua própria composição (DevOSApp).
 *
 * O redirecionamento `{ path: '/', element: <Navigate to="/dev" /> }` permanece exclusivo
 * do build e ponto de entrada Desktop (src/routes/sections/desktop.tsx), não interferindo
 * na raiz da aplicação Web em desenvolvimento.
 */
export const routesSection: RouteObject[] = [
  {
    element: <DevOSDevLayout />,
    children: devosRoutes,
  },
  ...webRoutes,
];
