import type { ButtonBaseProps } from '@mui/material/ButtonBase';
import type { ListItemButtonProps } from '@mui/material/ListItemButton';

import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import ListItemButton from '@mui/material/ListItemButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const CollapseButton = styled(
  ({ selected, children, disabled, ...other }: ListItemButtonProps) => (
    <ListItemButton disabled={disabled} {...other}>
      {children}
      <Iconify
        width={16}
        icon={
          ((!selected || disabled) && 'eva:arrow-ios-forward-fill') || 'eva:arrow-ios-downward-fill'
        }
      />
    </ListItemButton>
  )
)(({ theme }) => ({
  ...theme.typography.overline,
  height: 40,
  paddingLeft: theme.spacing(2.5),
  justifyContent: 'space-between',
  paddingRight: theme.spacing(1.5),
  color: theme.vars.palette.text.secondary,
  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.20) 100%)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderBottom: `solid 1px ${theme.vars.palette.divider}`,
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
  transition: theme.transitions.create(['all']),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  ...theme.applyStyles('dark', {
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.10)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  }),
}));

// ----------------------------------------------------------------------

export const ToggleButton = styled(ButtonBase)<ButtonBaseProps>(({ theme }) => ({
  top: 84,
  left: 0,
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  borderRadius: `0 12px 12px 0`,
  boxShadow: '0 4px 14px -2px rgba(0, 167, 111, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
  color: theme.vars.palette.primary.contrastText,
  background: 'linear-gradient(135deg, #00A76F 0%, #007850 100%)',
  transition: theme.transitions.create(['all'], { duration: theme.transitions.duration.shorter }),
  '&:hover': { 
    background: 'linear-gradient(135deg, #00B578 0%, #00895C 100%)',
    transform: 'scale(1.05)',
  },
}));
