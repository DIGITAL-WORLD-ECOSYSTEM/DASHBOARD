import { CONFIG } from 'src/global-config';

import { DesignSystemView } from 'src/sections/design-system';

// ----------------------------------------------------------------------

export default function DesignSystemPage() {
  return (
    <>
      <title>{`Catálogo de Componentes & Design System - ${CONFIG.appName}`}</title>
      <DesignSystemView />
    </>
  );
}
