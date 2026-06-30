import { CONFIG } from 'src/global-config';

import { AnalyticsUserListView } from 'src/sections/overview/analytics/view';

const metadata = { title: `Central de Cidadãos | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <AnalyticsUserListView />
    </>
  );
}
