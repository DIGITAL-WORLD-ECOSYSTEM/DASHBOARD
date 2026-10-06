import type { Theme, Components } from '@mui/material/styles';

// ----------------------------------------------------------------------

const MuiCard: Components<Theme>['MuiCard'] = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      position: 'relative',
      borderRadius: '20px',
      zIndex: 0, // Fix Safari overflow: hidden with border radius
      transition: theme.transitions.create(['box-shadow', 'border-color', 'background-color', 'transform']),
      
      // 🏛️ SUPERFÍCIE TÁTIL ESCULPIDA 3D (LIGHT MODE)
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFCFD 60%, #F4F7F9 100%)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid var(--card-border, rgba(145, 158, 171, 0.22))',
      boxShadow: [
        '0 14px 32px -8px rgba(15, 23, 42, 0.08)',
        '0 4px 10px -2px rgba(15, 23, 42, 0.04)',
        'inset 0 1.5px 0 #ffffff',
        'inset 1px 0 0 rgba(255, 255, 255, 0.8)',
        'inset 0 -1.5px 0 rgba(0, 0, 0, 0.04)',
      ].join(', '),

      // 🌑 MODO DARK CYBER / OBSIDIAN GLASS
      ...theme.applyStyles('dark', {
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(2, 8, 23, 0.92) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        boxShadow: [
          '0 16px 36px -8px rgba(0, 0, 0, 0.75)',
          'inset 0 1.5px 0 rgba(255, 255, 255, 0.15)',
          'inset 0 -1px 0 rgba(0, 0, 0, 0.5)',
        ].join(', '),
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
