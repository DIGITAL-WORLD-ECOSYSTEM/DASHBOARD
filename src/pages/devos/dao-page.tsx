import { CONFIG } from 'src/global-config';

import { TreasuryView } from 'src/sections/devos/treasury/view';

// ----------------------------------------------------------------------

const metadata = { title: `DevOS Cockpit - Treasury Safe - ${CONFIG.appName}` };

export default function DaoPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <TreasuryView />
    </>
  );
}
