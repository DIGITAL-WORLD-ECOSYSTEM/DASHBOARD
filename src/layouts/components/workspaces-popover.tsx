import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import { useState, useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Button, { buttonClasses } from '@mui/material/Button';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomPopover } from 'src/components/custom-popover';

import { IdentityAvatar } from 'src/auth/components';

// ----------------------------------------------------------------------

export type WorkspacesPopoverProps = ButtonBaseProps & {
  data?: {
    id: string;
    name: string;
    logo: string;
    plan: string;
  }[];
};

export function WorkspacesPopover({ data = [], sx, ...other }: WorkspacesPopoverProps) {
  const mediaQuery = 'sm';

  const { open, anchorEl, onClose, onOpen } = usePopover();

  const [workspace, setWorkspace] = useState(data[0]);

  const handleChangeWorkspace = useCallback(
    (newValue: (typeof data)[0]) => {
      setWorkspace(newValue);
      onClose();
    },
    [onClose]
  );

  const renderButton = () => (
    <ButtonBase
      disableRipple
      onClick={onOpen}
      sx={[
        (theme) => ({
          py: 0.65,
          px: 1.35,
          borderRadius: 1.5,
          gap: { xs: 0.75, [mediaQuery]: 1 },
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.75) 100%)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: [
            '0 3px 8px -1px rgba(15, 23, 42, 0.08)',
            'inset 0 1.5px 0 #ffffff',
            'inset 0 -1px 0 rgba(0, 0, 0, 0.05)',
          ].join(', '),
          transition: theme.transitions.create(
            ['background', 'border-color', 'box-shadow', 'transform'],
            { duration: theme.transitions.duration.shorter }
          ),
          '&:hover': {
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)',
            borderColor: 'rgba(0, 167, 111, 0.45)',
            boxShadow: [
              '0 6px 16px -2px rgba(0, 167, 111, 0.22)',
              'inset 0 1.5px 0 #ffffff',
            ].join(', '),
            transform: 'translateY(-1.5px)',
          },
          '&:active': {
            transform: 'translateY(1px)',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
          },
          ...theme.applyStyles('dark', {
            background:
              'linear-gradient(180deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow:
              '0 3px 8px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            '&:hover': {
              borderColor: 'rgba(0, 255, 127, 0.5)',
              boxShadow:
                '0 0 14px rgba(0, 255, 127, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            },
            '&:active': {
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)',
            },
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        component="img"
        alt={workspace?.name}
        src={workspace?.logo}
        sx={{
          width: 22,
          height: 22,
          borderRadius: 0.75,
          boxShadow: '0 2px 5px rgba(0,0,0,0.12)',
        }}
      />

      <Box
        component="span"
        sx={{
          typography: 'subtitle2',
          fontWeight: 700,
          letterSpacing: 0.3,
          display: { xs: 'none', [mediaQuery]: 'inline-flex' },
        }}
      >
        {workspace?.name}
      </Box>

      <Label
        color={workspace?.plan === 'Free' ? 'default' : 'info'}
        sx={(theme) => ({
          height: 20,
          px: 0.8,
          cursor: 'inherit',
          fontSize: 10,
          fontWeight: 800,
          fontFamily: 'var(--font-orbitron), "Orbitron", sans-serif',
          letterSpacing: 0.5,
          borderRadius: 0.75,
          background: 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)',
          border: '1px solid rgba(145, 158, 171, 0.25)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.06), inset 0 1px 0 #ffffff',
          color: 'text.primary',
          display: { xs: 'none', [mediaQuery]: 'inline-flex' },
          ...theme.applyStyles('dark', {
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }),
        })}
      >
        {workspace?.plan}
      </Label>

      <Iconify width={15} icon="carbon:chevron-sort" sx={{ color: 'text.secondary', ml: -0.25 }} />
    </ButtonBase>
  );

  const renderMenuList = () => (
    <CustomPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{
        arrow: { placement: 'top-left' },
        paper: { sx: { mt: 0.5, ml: -1.55, width: 240 } },
      }}
    >
      <Scrollbar sx={{ maxHeight: 240 }}>
        <MenuList>
          {data.map((option) => (
            <MenuItem
              key={option.id}
              selected={option.id === workspace?.id}
              onClick={() => handleChangeWorkspace(option)}
              sx={{ height: 48 }}
            >
              <IdentityAvatar alt={option.name} src={option.logo} sx={{ width: 24, height: 24 }} />

              <Typography
                noWrap
                component="span"
                variant="body2"
                sx={{ flexGrow: 1, fontWeight: 'fontWeightMedium' }}
              >
                {option.name}
              </Typography>

              <Label color={option.plan === 'Free' ? 'default' : 'info'}>{option.plan}</Label>
            </MenuItem>
          ))}
        </MenuList>
      </Scrollbar>

      <Divider sx={{ my: 0.5, borderStyle: 'dashed' }} />

      <Button
        fullWidth
        startIcon={<Iconify width={18} icon="mingcute:add-line" />}
        onClick={() => {
          onClose();
        }}
        sx={{
          gap: 2,
          justifyContent: 'flex-start',
          fontWeight: 'fontWeightMedium',
          [`& .${buttonClasses.startIcon}`]: {
            m: 0,
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        Create workspace
      </Button>
    </CustomPopover>
  );

  return (
    <>
      {renderButton()}
      {renderMenuList()}
    </>
  );
}
