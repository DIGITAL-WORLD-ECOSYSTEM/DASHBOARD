import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';

import { webRoutes } from './routes/sections/web';
import { ErrorBoundary } from './routes/components';

// ----------------------------------------------------------------------

/**
 * Ponto de entrada exclusivo do Dashboard Web (Data Plane).
 *
 * Utiliza exclusivamente as rotas públicas, de autenticação e de associados (webRoutes).
 * Não possui referências ou imports de páginas, layouts ou rotas do DevOS.
 */
const router = createBrowserRouter([
  {
    element: <Outlet />,
    errorElement: <ErrorBoundary />,
    children: webRoutes,
  },
]);

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
