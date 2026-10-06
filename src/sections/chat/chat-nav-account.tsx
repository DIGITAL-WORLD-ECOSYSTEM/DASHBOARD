import type { BadgeProps } from '@mui/material/Badge';
import type { SelectChangeEvent } from '@mui/material/Select';

import { useState, useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import { alpha } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import { svgIconClasses } from '@mui/material/SvgIcon';
import Badge, { badgeClasses } from '@mui/material/Badge';
import { inputBaseClasses } from '@mui/material/InputBase';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { useUserProfile } from 'src/auth/facades';
import { IdentityAvatar } from 'src/auth/components';

// ----------------------------------------------------------------------

export function ChatNavAccount() {
  const user = useUserProfile();

  const menuActions = usePopover();

  const [status, setStatus] = useState<BadgeProps['variant']>('online');

  const handleChangeStatus = useCallback((event: SelectChangeEvent) => {
    setStatus(event.target.value as BadgeProps['variant']);
  }, []);

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{
        paper: { sx: { p: 0, ml: 0, mt: 0.5 } },
        arrow: { placement: 'top-left' },
      }}
    >
      <Box
        sx={{
          py: 2,
          pr: 1,
          pl: 2,
          gap: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ListItemText primary={user?.displayName} secondary={user?.displayEmail} />

        <Tooltip title="Log out">
          <IconButton color="error">
            <Iconify icon="ic:round-power-settings-new" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <MenuList sx={{ my: 0.5, px: 0.5 }}>
        <MenuItem>
          <Badge
            variant={status}
            badgeContent=" "
            sx={{
              width: 24,
              height: 24,
              alignItems: 'center',
              justifyContent: 'center',
              [`& .${badgeClasses.badge}`]: {
                width: 12,
                height: 12,
                transform: 'unset',
                position: 'static',
              },
            }}
          />

          <FormControl fullWidth variant="standard">
            <Select
              native
              fullWidth
              disableUnderline
              value={status}
              onChange={handleChangeStatus}
              inputProps={{ id: 'chat-status-select' }}
              sx={{
                [`& .${svgIconClasses.root}`]: { right: 0 },
                [`& .${inputBaseClasses.input}`]: {
                  typography: 'body2',
                  textTransform: 'capitalize',
                },
              }}
            >
              {['online', 'always', 'busy', 'offline'].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </FormControl>
        </MenuItem>

        <MenuItem>
          <Iconify width={24} icon="solar:user-id-bold" />
          Profile
        </MenuItem>

        <MenuItem>
          <Iconify width={24} icon="solar:settings-bold" />
          Settings
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Badge
        variant={status}
        badgeContent=" "
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <IdentityAvatar
          src={user?.photoURL}
          alt={user?.displayName}
          onClick={menuActions.onOpen}
          sx={[
            (theme: any) => ({
              cursor: 'pointer',
              width: 46,
              height: 46,
              boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.12)',
              border: `2px solid ${alpha(theme.palette.common.white, 0.8)}`,
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: `0 6px 16px -2px ${alpha(theme.palette.primary.main, 0.3)}`,
              },
              ...theme.applyStyles('dark', {
                border: '2px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.5)',
              }),
            }),
          ]}
        >
          {user?.displayName?.charAt(0).toUpperCase()}
        </IdentityAvatar>
      </Badge>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'fontWeightBold' }}>
          {user?.displayName}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}>
          {user?.role || 'Administrador'} • ASPPIBRA
        </Typography>
      </Box>

      {renderMenuActions()}
    </Box>
  );
}
