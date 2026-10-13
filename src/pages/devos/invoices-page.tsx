import { CONFIG } from 'src/global-config';

import { InvoicesView } from 'src/sections/devos/invoices/view';

// ----------------------------------------------------------------------

export default function InvoicesPage() {
  return (
    <>
      <title>{`Faturas & Cobranças - ${CONFIG.appName}`}</title>
      <InvoicesView />
    </>
  );
}
