import { CONFIG } from 'src/global-config';

import { AuditView } from 'src/sections/devos/audit/view';

// ----------------------------------------------------------------------

const metadata = { title: `DevOS Cockpit - Audit Trail - ${CONFIG.appName}` };

export default function AuditPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <AuditView />
    </>
  );
}
