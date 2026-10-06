import type { Theme, SxProps } from '@mui/material/styles';

import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

type ChatLayoutProps = React.ComponentProps<'div'> & {
  sx?: SxProps<Theme>;
  slots: {
    kpiBar?: React.ReactNode;
    nav: React.ReactNode;
    main: React.ReactNode;
    header: React.ReactNode;
    details: React.ReactNode;
  };
};

export function ChatLayout({ slots, sx, ...other }: ChatLayoutProps) {
  return (
    <LayoutRoot sx={sx} {...other}>
      {slots.kpiBar && <LayoutKpiBar>{slots.kpiBar}</LayoutKpiBar>}
      
      <LayoutMiddle>
        <LayoutNav>{slots.nav}</LayoutNav>

        <LayoutContainer>
          {slots.header ? <LayoutHeader>{slots.header}</LayoutHeader> : null}

          <LayoutContent>
            <LayoutMain>{slots.main}</LayoutMain>
            {slots.details ? <LayoutDetails>{slots.details}</LayoutDetails> : null}
          </LayoutContent>
        </LayoutContainer>
      </LayoutMiddle>
    </LayoutRoot>
  );
}

// ----------------------------------------------------------------------

const LayoutRoot = styled('div')(({ theme }) => ({
  minHeight: 0,
  height: '100%',
  flex: '1 1 0',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  borderRadius: 20,
  overflow: 'hidden',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.50) 100%)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.45)',
  boxShadow: [
    '0 24px 48px -12px rgba(15, 23, 42, 0.12)',
    '0 8px 16px -4px rgba(15, 23, 42, 0.04)',
    'inset 0 1.5px 0 #ffffff',
    'inset 1px 0 0 rgba(255, 255, 255, 0.8)',
    'inset 0 -1.5px 0 rgba(0, 0, 0, 0.04)',
  ].join(', '),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 100%)',
    pointerEvents: 'none',
    zIndex: 1,
  },
  ...theme.applyStyles('dark', {
    background: 'linear-gradient(135deg, rgba(20, 26, 33, 0.82) 0%, rgba(15, 20, 26, 0.65) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: [
      '0 24px 48px -12px rgba(0, 0, 0, 0.75)',
      'inset 0 1.5px 0 rgba(255, 255, 255, 0.12)',
      'inset 0 -1px 0 rgba(0, 0, 0, 0.5)',
    ].join(', '),
    '&::before': {
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 100%)',
    },
  }),
}));

const LayoutKpiBar = styled('div')(() => ({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  zIndex: 2,
}));

const LayoutMiddle = styled('div')(() => ({
  display: 'flex',
  flex: '1 1 0',
  minHeight: 0,
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  zIndex: 2,
}));

const LayoutHeader = styled('div')(({ theme }) => ({
  height: 72,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 1, 1, 2.5),
  borderBottom: `solid 1px ${theme.vars.palette.divider}`,
  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.25) 100%)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  ...theme.applyStyles('dark', {
    background: 'linear-gradient(180deg, rgba(22, 28, 36, 0.60) 0%, rgba(18, 23, 30, 0.35) 100%)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  }),
}));

const LayoutNav = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  minHeight: 0,
  height: '100%',
  overflow: 'hidden',
  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.20) 100%)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  ...theme.applyStyles('dark', {
    background: 'linear-gradient(180deg, rgba(18, 23, 30, 0.50) 0%, rgba(14, 18, 24, 0.30) 100%)',
  }),
}));

const LayoutContainer = styled('div')(() => ({
  minWidth: 0,
  minHeight: 0,
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flex: '1 1 0',
  flexDirection: 'column',
}));

const LayoutContent = styled('div')(() => ({
  minHeight: 0,
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flex: '1 1 0',
}));

const LayoutMain = styled('div')(() => ({
  minWidth: 0,
  minHeight: 0,
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flex: '1 1 0',
  flexDirection: 'column',
}));

const LayoutDetails = styled('div')(({ theme }) => ({
  minHeight: 0,
  height: '100%',
  overflow: 'hidden',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.15) 100%)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  ...theme.applyStyles('dark', {
    background: 'linear-gradient(180deg, rgba(18, 23, 30, 0.45) 0%, rgba(14, 18, 24, 0.25) 100%)',
  }),
}));
