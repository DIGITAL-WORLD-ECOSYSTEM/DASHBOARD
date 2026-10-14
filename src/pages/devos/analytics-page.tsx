import { CONFIG } from 'src/global-config';

import { AnalyticsHubView } from 'src/sections/devos/analytics';

// ----------------------------------------------------------------------

export default function AnalyticsPage() {
  return (
    <>
      <title>{`Hub Analítico & Métricas - ${CONFIG.appName}`}</title>
      <AnalyticsHubView />
    </>
  );
}
