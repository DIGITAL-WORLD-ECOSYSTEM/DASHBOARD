import { CONFIG } from 'src/global-config';

import { AnalyticsSocialApiView } from 'src/sections/overview/analytics/view';

const metadata = { title: `Social Hub: API | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <AnalyticsSocialApiView />
    </>
  );
}
