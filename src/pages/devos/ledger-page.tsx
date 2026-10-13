import { CONFIG } from 'src/global-config';

import { LedgerView } from 'src/sections/devos/ledger/view';

// ----------------------------------------------------------------------

export default function LedgerPage() {
  return (
    <>
      <title>{`Livro-Razão Contábil - ${CONFIG.appName}`}</title>
      <LedgerView />
    </>
  );
}
