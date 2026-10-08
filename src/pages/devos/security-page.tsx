import { CONFIG } from 'src/global-config';

import { SecurityView } from 'src/sections/devos/security/view';

// ----------------------------------------------------------------------

const metadata = { title: `DevOS Cockpit - Security & Devices - ${CONFIG.appName}` };

export default function SecurityPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <SecurityView />
    </>
  );
}
