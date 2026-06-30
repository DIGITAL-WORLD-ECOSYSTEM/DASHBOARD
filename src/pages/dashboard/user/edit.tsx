import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetCitizens } from 'src/actions/identity';

import { LoadingScreen } from 'src/components/loading-screen';

import { UserEditView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `User edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { citizens, citizensLoading } = useGetCitizens();

  const currentUser = citizens?.find((user) => user.id === id);

  if (citizensLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <title>{metadata.title}</title>

      <UserEditView user={currentUser} />
    </>
  );
}
