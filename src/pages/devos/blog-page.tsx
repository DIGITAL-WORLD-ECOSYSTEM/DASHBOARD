import { CONFIG } from 'src/global-config';

import { BlogHubView } from 'src/sections/devos/blog';

// ----------------------------------------------------------------------

export default function BlogPage() {
  return (
    <>
      <title>{`Blog Institucional & Comunicação - ${CONFIG.appName}`}</title>
      <BlogHubView />
    </>
  );
}
