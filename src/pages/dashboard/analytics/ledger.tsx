

import { CONFIG } from 'src/global-config';

import { AnalyticsLedgerView } from 'src/sections/overview/analytics/view';

// ----------------------------------------------------------------------

const metadata = { title: `Analytics: Livro-Razão e Auditoria | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      
        <title> {metadata.title}</title>
      
      <AnalyticsLedgerView />
    </>
  );
}
