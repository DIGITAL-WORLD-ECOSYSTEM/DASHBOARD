import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _userCards } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserCardList } from 'src/sections/user/user-card-list';

// ----------------------------------------------------------------------

export function AnalyticsUserMembersView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Membros"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Análise', href: paths.dashboard.general.analytics.root },
          { name: 'User Hub' },
          { name: 'Membros' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.user.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Novo Membro
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserCardList users={_userCards} />
    </DashboardContent>
  );
}
