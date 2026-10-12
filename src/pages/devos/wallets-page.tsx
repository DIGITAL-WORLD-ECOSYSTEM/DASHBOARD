import { CONFIG } from 'src/global-config';

import { WalletsView } from 'src/sections/devos/wallets/view';

// ----------------------------------------------------------------------

export default function WalletsPage() {
  return (
    <>
      <title>{`Carteiras & Custódia - ${CONFIG.appName}`}</title>
      <WalletsView />
    </>
  );
}
