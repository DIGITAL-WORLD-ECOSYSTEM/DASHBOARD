import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';
import { _userFeeds, _appAuthors, _appFeatured, _appInstalled } from 'src/_mock';

import { svgColorClasses } from 'src/components/svg-color';

import { ProfilePostItem } from 'src/sections/user/profile-post-item';

import { useUserProfile } from 'src/auth/hooks/use-user-profile';

import { AppWidget } from '../app-widget';
import { AppWelcome } from '../app-welcome';
import { AppFeatured } from '../app-featured';
import { AppPostInput } from '../app-post-input';
import { AppTopAuthors } from '../app-top-authors';
import { AppTopInstalledCountries } from '../app-top-installed-countries';


// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { displayName } = useUserProfile();

  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <AppWelcome
            title={`Welcome back 👋 \n ${displayName}`}
            description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
            img={<SeoIllustration hideBackground />}
            action={
              <Button variant="contained" color="primary">
                Go now
              </Button>
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AppFeatured list={_appFeatured} />
        </Grid>

        {/* FEED - ESQUERDA */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <AppPostInput />
            {_userFeeds.map((post) => (
              <ProfilePostItem key={post.id} post={post} />
            ))}
          </Box>
        </Grid>

        {/* WIDGETS - DIREITA */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <AppTopInstalledCountries title="Top installed countries" list={_appInstalled} />
            
            <AppTopAuthors title="Top authors" list={_appAuthors} />

            <AppWidget
              title="Conversion"
              total={38566}
              icon="solar:user-rounded-bold"
              chart={{ series: 48 }}
            />

            <AppWidget
              title="Applications"
              total={55566}
              icon="solar:letter-bold"
              chart={{
                series: 75,
                colors: [theme.vars.palette.info.light, theme.vars.palette.info.main],
              }}
              sx={{ bgcolor: 'info.dark', [`& .${svgColorClasses.root}`]: { color: 'info.light' } }}
            />
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
