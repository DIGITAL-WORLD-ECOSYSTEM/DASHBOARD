import { CONFIG } from 'src/global-config';

import { ObservabilityView } from 'src/sections/devos/observability/view';

// ----------------------------------------------------------------------

const metadata = { title: `DevOS Cockpit - Observabilidade - ${CONFIG.appName}` };

export default function DevOSDashboardPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <ObservabilityView />
    </>
  );
}
