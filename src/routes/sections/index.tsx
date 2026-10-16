import type { RouteObject } from 'react-router';

import { desktopRoutes } from './desktop';

// ----------------------------------------------------------------------

/**
 * Registro de rotas exclusivo para o App Desktop Nativo (Tauri v2 + DevOS).
 *
 * A raiz `/` redireciona diretamente para o Cockpit do DevOS (`/dev`),
 * operando sob o pipeline leve e seguro de DevOSApp.
 */
export const routesSection: RouteObject[] = desktopRoutes;

export default routesSection;
