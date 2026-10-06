import type { Theme, Components } from '@mui/material/styles';

// ----------------------------------------------------------------------

const MuiCard: Components<Theme>['MuiCard'] = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      position: 'relative',
      boxShadow: `var(--card-shadow, ${theme.vars.customShadows.card})`,
      borderRadius: `var(--card-radius, ${Number(theme.shape.borderRadius) * 2}px)`,
      zIndex: 0, // Fix Safari overflow: hidden with border radius
      transition: theme.transitions.create(['box-shadow', 'border-color', 'background-color']),
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid var(--card-border, rgba(145, 158, 171, 0.12))',
      ...theme.applyStyles('dark', {
        backgroundColor: 'rgba(2, 8, 23, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: `inset 0 1px 1px rgba(255, 255, 255, 0.08), inset 0 -1px 1px rgba(0, 0, 0, 0.5), ${theme.vars.customShadows.card}`,
      }),
    }),
  },
};

const MuiCardHeader: Components<Theme>['MuiCardHeader'] = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    slotProps: {
      title: { variant: 'h6' },
      subheader: { variant: 'body2', sx: { marginTop: '4px' } },
    },
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3, 3, 0),
    }),
  },
};

const MuiCardContent: Components<Theme>['MuiCardContent'] = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3),
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const card: Components<Theme> = {
  MuiCard,
  MuiCardHeader,
  MuiCardContent,
};
