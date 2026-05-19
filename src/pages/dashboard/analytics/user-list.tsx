import { CONFIG } from 'src/global-config';

import { AnalyticsUserListView } from 'src/sections/overview/analytics/view';

const metadata = { title: `User Hub: Usuários | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <AnalyticsUserListView />
    </>
  );
}
