import { CONFIG } from 'src/global-config';

import { ObservabilityView } from 'src/sections/devos/observability/view';

// ----------------------------------------------------------------------

const metadata = { title: `DevOS Cockpit - Observability - ${CONFIG.appName}` };

export default function DevOSDashboardPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <ObservabilityView />
    </>
  );
}
