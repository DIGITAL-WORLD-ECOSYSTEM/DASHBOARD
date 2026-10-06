import type { IconButtonProps } from '@mui/material/IconButton';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { varTap, varHover, transitionTap } from 'src/components/animate';

import { IdentityAvatar } from 'src/auth/components';

// ----------------------------------------------------------------------

export type AccountButtonProps = IconButtonProps;

export function AccountButton({ sx, ...other }: AccountButtonProps) {
  return (
    <IconButton
      component={m.button}
      whileTap={varTap(0.96)}
      whileHover={varHover(1.04)}
      transition={transitionTap()}
      aria-label="Account button"
      className="account-button"
      sx={[
        {
          p: 0,
          position: 'relative',
          transition: 'transform 0.2s ease',
          '&:hover': {
            '& .account-avatar-ring': {
              boxShadow: '0 0 12px rgba(0, 167, 111, 0.45)',
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        className="account-avatar-ring"
        sx={{
          p: '2.5px',
          borderRadius: '50%',
          width: 40,
          height: 40,
          background:
            'linear-gradient(135deg, #00A76F 0%, rgba(145, 158, 171, 0.25) 50%, #00D2FF 100%)',
          boxShadow: '0 4px 12px -2px rgba(0, 167, 111, 0.35), inset 0 1px 1px #ffffff',
          transition: 'box-shadow 0.25s ease',
        }}
      >
        <IdentityAvatar sx={{ width: 1, height: 1 }} />
      </Box>

      {/* 🟢 Online Status Indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 1,
          right: 1,
          width: 10,
          height: 10,
          bgcolor: '#22c55e',
          border: '2px solid #ffffff',
          borderRadius: '50%',
          boxShadow: '0 0 6px rgba(34, 197, 94, 0.7)',
        }}
      />
    </IconButton>
  );
}
