import { CONFIG } from 'src/global-config';

import { EcommerceHubView } from 'src/sections/devos/ecommerce';

// ----------------------------------------------------------------------

export default function EcommercePage() {
  return (
    <>
      <title>{`E-commerce & Vendas - ${CONFIG.appName}`}</title>
      <EcommerceHubView />
    </>
  );
}
