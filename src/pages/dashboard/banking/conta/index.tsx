import { CONFIG } from 'src/global-config';

import { BankingContaView } from 'src/sections/overview/banking/view/banking-conta-view';

const metadata = { title: `Conta | Banco - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <BankingContaView />
    </>
  );
}
