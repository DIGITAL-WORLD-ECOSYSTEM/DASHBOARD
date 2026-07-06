import type { BoxProps } from '@mui/material/Box';

import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function NavUpgrade({ sx, ...other }: BoxProps) {
  const { user } = useAuthContext();
  
  let displayName = user?.firstName 
    ? `${user.firstName} ${user.lastName || ''}`.trim() 
    : user?.username || 'Usuário';

  // RECONSTRUCTION: The backend splits the wallet address for some reason.
  // firstName = "Web3 0xDfcE" (first 6 chars)
  // email = "227bf1ffbbbec6410c2c2e22873293e6b56f@web3..." (remaining 36 chars)
  if (displayName.toLowerCase().startsWith('web3 0x') && user?.email?.includes('@web3')) {
    const firstPart = displayName.replace(/web3 /i, '').trim(); // e.g. "0xDfcE"
    const secondPart = user.email.split('@')[0]; // e.g. "227bf..."
    
    const fullAddress = firstPart + secondPart;
    
    if (fullAddress.length === 42) {
      // Format as 0x12345...67890 (7 chars start, 5 chars end)
      displayName = `${fullAddress.slice(0, 7)}...${fullAddress.slice(-5)}`;
    } else {
      // Fallback if lengths are weird
      displayName = `${firstPart}...${secondPart.slice(-5)}`;
    }
  } else if (user?.did) {
    const match = user.did.match(/0x[a-fA-F0-9]{40}/i);
    if (match && (!user?.firstName || displayName.toLowerCase().startsWith('web3 '))) {
      const addr = match[0];
      displayName = `${addr.slice(0, 7)}...${addr.slice(-5)}`;
    }
  }

  // Format Subtext (Email/DID): Hide ugly generated web3 emails
  let displayEmail = user?.email || 'Sem email';
  if (displayEmail.includes('@web3') || displayEmail.includes('@eth')) {
     displayEmail = user?.did ? `Conta Web3` : 'Conta Descentralizada';
  }

  return (
    <Box
      sx={[{ px: 2, py: 5, textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar src={user?.photoURL} alt={displayName} sx={{ width: 48, height: 48 }}>
            {displayName.charAt(0).toUpperCase()}
          </Avatar>

          <Label
            color="success"
            variant="filled"
            sx={{
              top: -6,
              px: 0.5,
              left: 40,
              height: 20,
              position: 'absolute',
              borderBottomLeftRadius: 2,
            }}
          >
            {user?.role?.toUpperCase() || 'USER'}
          </Label>
        </Box>

        <Box sx={{ mb: 2, mt: 1.5, width: 1 }}>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ mb: 1, color: 'var(--layout-nav-text-primary-color)' }}
          >
            {displayName}
          </Typography>

          <Typography
            variant="body2"
            noWrap
            sx={{ color: 'var(--layout-nav-text-disabled-color)' }}
          >
            {displayEmail}
          </Typography>
        </Box>

        <Button
          variant="contained"
          href={paths.minimalStore}
          target="_blank"
          rel="noopener noreferrer"
        >
          Upgrade to Pro
        </Button>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function UpgradeBlock({ sx, ...other }: BoxProps) {
  return (
    <Box
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [
              `linear-gradient(135deg, ${varAlpha(theme.vars.palette.error.lightChannel, 0.92)}, ${varAlpha(theme.vars.palette.secondary.darkChannel, 0.92)})`,
              `url(${CONFIG.assetsDir}/assets/background/background-7.webp)`,
            ],
          }),
          px: 3,
          py: 4,
          borderRadius: 2,
          position: 'relative',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={(theme) => ({
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          borderRadius: 2,
          position: 'absolute',
          border: `solid 3px ${varAlpha(theme.vars.palette.common.whiteChannel, 0.16)}`,
        })}
      />

      <Box
        component={m.img}
        animate={{ y: [12, -12, 12] }}
        transition={{
          duration: 8,
          ease: 'linear',
          repeat: Infinity,
          repeatDelay: 0,
        }}
        alt="Small Rocket"
        src={`${CONFIG.assetsDir}/assets/illustrations/illustration-rocket-small.webp`}
        sx={{
          right: 0,
          width: 112,
          height: 112,
          position: 'absolute',
        }}
      />

      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Box component="span" sx={{ typography: 'h5', color: 'common.white' }}>
          35% OFF
        </Box>

        <Box
          component="span"
          sx={{
            mb: 2,
            mt: 0.5,
            color: 'common.white',
            typography: 'subtitle2',
          }}
        >
          Power up Productivity!
        </Box>

        <Button variant="contained" size="small" color="warning">
          Upgrade to Pro
        </Button>
      </Box>
    </Box>
  );
}
