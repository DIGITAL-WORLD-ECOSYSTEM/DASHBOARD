import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';

import { ErrorBoundary } from './routes/components';
import { desktopRoutes } from './routes/sections/desktop';

// ----------------------------------------------------------------------

/**
 * Ponto de entrada exclusivo do DevOS Desktop (Control Plane).
 *
 * Utiliza exclusivamente as rotas administrativas e de governança (desktopRoutes).
 * Não possui referências ou imports de páginas, layouts ou fluxos de e-commerce e chat Web.
 */
const router = createBrowserRouter([
  {
    element: <Outlet />,
    errorElement: <ErrorBoundary />,
    children: desktopRoutes,
  },
]);

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
