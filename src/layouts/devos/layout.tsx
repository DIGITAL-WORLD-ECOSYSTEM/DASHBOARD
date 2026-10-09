import type { Breakpoint } from '@mui/material/styles';
import type { NavSectionProps } from 'src/components/nav-section';

import { useEffect } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { NavSectionVertical } from 'src/components/nav-section';

import { MenuButton } from '../components/menu-button';
import { NavVertical } from '../dashboard/nav-vertical';
import { dashboardLayoutVars, dashboardNavColorVars } from '../dashboard/css-vars';
import { MainSection, layoutClasses, HeaderSection, LayoutSection } from '../core';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

const DEVOS_NAV_DATA: NavSectionProps['data'] = [
  {
    subheader: 'CONTROL PLANE',
    items: [
      {
        title: 'Observability',
        path: paths.devos.root,
        icon: <Iconify icon={'solar:graph-up-bold' as any} />,
      },
      {
        title: 'Database',
        path: paths.devos.database,
        icon: <Iconify icon={'solar:database-bold' as any} />,
      },
      {
        title: 'Treasury',
        path: paths.devos.dao,
        icon: <Iconify icon={'solar:shield-star-bold' as any} />,
      },
    ],
  },
  {
    subheader: 'SECURITY',
    items: [
      {
        title: 'Security',
        path: paths.devos.security,
        icon: <Iconify icon={'solar:shield-keyhole-bold' as any} />,
      },
      {
        title: 'Audit',
        path: paths.devos.audit,
        icon: <Iconify icon={'solar:document-text-bold' as any} />,
      },
    ],
  },
  {
    subheader: 'INFRASTRUCTURE',
    items: [
      {
        title: 'APIs',
        path: paths.devos.apis,
        icon: <Iconify icon={'solar:key-square-bold' as any} />,
      },
      {
        title: 'Infrastructure',
        path: paths.devos.infrastructure,
        icon: <Iconify icon={'solar:server-square-bold' as any} />,
      },
    ],
  },
];

function getSectionTitle(pathname: string): string {
  if (pathname === paths.devos.root || pathname === `${paths.devos.root}/`) {
    return 'Observability';
  }
  if (pathname.startsWith(paths.devos.database)) {
    return 'Database';
  }
  if (pathname.startsWith(paths.devos.dao)) {
    return 'Treasury';
  }
  if (pathname.startsWith(paths.devos.security)) {
    return 'Security';
  }
  if (pathname.startsWith(paths.devos.audit)) {
    return 'Audit';
  }
  if (pathname.startsWith(paths.devos.apis)) {
    return 'APIs';
  }
  if (pathname.startsWith(paths.devos.infrastructure)) {
    return 'Infrastructure';
  }
  return 'DevOS Cockpit';
}

// ----------------------------------------------------------------------

export function DevOSLayout({ children }: Props) {
  const theme = useTheme();
  const pathname = usePathname();
  const settings = useSettingsContext();

  const isNavMini = useBoolean(false);
  const mobileNav = useBoolean(false);

  const layoutQuery: Breakpoint = 'md';

  const navVars = dashboardNavColorVars(
    theme,
    settings.state.navColor,
    isNavMini.value ? 'mini' : 'vertical'
  );

  useEffect(() => {
    document.title = 'DevOS — v2.2.3';
  }, []);

  useEffect(() => {
    if (mobileNav.value) {
      mobileNav.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const currentSection = getSectionTitle(pathname);

  // --------------------------------------------------------------------
  // 1. CABEÇALHO SUPERIOR (GLASSMORPHIC FLOATING CARD)
  // --------------------------------------------------------------------
  const renderHeader = () => (
    <HeaderSection
      layoutQuery={layoutQuery}
      disableOffset
      disableElevation
      slots={{
        leftArea: (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <MenuButton
              onClick={mobileNav.onTrue}
              sx={{ mr: 1, ml: -1, [theme.breakpoints.up(layoutQuery)]: { display: 'none' } }}
            />

            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                letterSpacing: -0.2,
                color: 'text.primary',
              }}
            >
              {currentSection}
            </Typography>
          </Stack>
        ),
        rightArea: null,
      }}
      slotProps={{
        container: {
          maxWidth: false,
          sx: {
            px: { xs: 1.5, [layoutQuery]: 2.5 },
          },
        },
      }}
      sx={[
        {
          position: 'sticky',
          top: { xs: 8, [layoutQuery]: 16 },
          mt: 0,
          mb: { xs: 1.5, [layoutQuery]: 2.5 },
          left: 0,
          right: 0,
          mx: 'auto',
          width: { xs: 'calc(100% - 24px)', [layoutQuery]: 'calc(100% - 32px)' },
          borderRadius: { xs: 2, [layoutQuery]: '20px' },
          overflow: 'hidden',
          isolation: 'isolate',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: 'transform',

          // 💎 VIDROMORFISMO 3D (PADRÃO DASHBOARD WEB)
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0%, rgba(248, 250, 252, 0.68) 50%, rgba(241, 245, 249, 0.78) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.75)',
          boxShadow: [
            '0 20px 48px -10px rgba(15, 23, 42, 0.12)',
            '0 8px 20px -4px rgba(15, 23, 42, 0.06)',
            'inset 0 1.5px 0 rgba(255, 255, 255, 0.95)',
            'inset 1.5px 0 0 rgba(255, 255, 255, 0.75)',
            'inset 0 -1.5px 0 rgba(0, 0, 0, 0.04)',
            'inset -1.5px 0 0 rgba(0, 0, 0, 0.03)',
          ].join(', '),
          zIndex: 'var(--layout-header-zIndex)',

          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            borderRadius: 'inherit',
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.08) 25%, transparent 55%)',
            pointerEvents: 'none',
            zIndex: 1,
          },

          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background:
              'linear-gradient(90deg, rgba(0, 167, 111, 0.6) 0%, rgba(145, 158, 171, 0.25) 35%, rgba(0, 210, 255, 0.5) 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          },

          ...theme.applyStyles('dark', {
            background:
              'linear-gradient(135deg, rgba(15, 23, 42, 0.78) 0%, rgba(2, 8, 23, 0.70) 50%, rgba(15, 23, 42, 0.82) 100%)',
            backdropFilter: 'blur(24px) saturate(190%)',
            WebkitBackdropFilter: 'blur(24px) saturate(190%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: [
              '0 24px 60px -12px rgba(0, 0, 0, 0.75)',
              '0 10px 24px -4px rgba(0, 0, 0, 0.55)',
              'inset 0 1.5px 0 rgba(255, 255, 255, 0.22)',
              'inset 1px 0 0 rgba(255, 255, 255, 0.08)',
              'inset 0 -1.5px 0 rgba(0, 0, 0, 0.5)',
            ].join(', '),
            '&::before': {
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 30%, transparent 60%)',
            },
            '&::after': {
              background:
                'linear-gradient(90deg, rgba(0, 255, 127, 0.6) 0%, rgba(255, 255, 255, 0.12) 35%, rgba(0, 210, 255, 0.5) 100%)',
            },
          }),
        },
      ]}
    />
  );

  // --------------------------------------------------------------------
  // 2. BARRA LATERAL VERTICAL (DESKTOP)
  // --------------------------------------------------------------------
  const renderSidebar = () => (
    <NavVertical
      data={DEVOS_NAV_DATA}
      isNavMini={isNavMini.value}
      layoutQuery={layoutQuery}
      cssVars={navVars.section}
      onToggleNav={isNavMini.onToggle}
      slots={{
        topArea: (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              pl: isNavMini.value ? 0 : 3.5,
              justifyContent: isNavMini.value ? 'center' : 'flex-start',
              pt: 2.5,
              pb: 1.5,
              flexShrink: 0,
            }}
          >
            <Logo href={paths.devos.root} />
            {!isNavMini.value && (
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  ASPPIBRA - DAO
                </Typography>
              </Box>
            )}
          </Box>
        ),
        bottomArea: !isNavMini.value ? (
          <Box sx={{ px: 2, pb: 2, pt: 1 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    boxShadow: `0 0 6px ${theme.vars.palette.success.main}`,
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  mock-node-alpha
                </Typography>
              </Stack>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block', fontSize: '0.68rem' }}
              >
                Control Plane Sandbox • Mocks Ativos
              </Typography>
            </Box>
          </Box>
        ) : null,
      }}
    />
  );

  // --------------------------------------------------------------------
  // 3. BARRA LATERAL MOBILE (DRAWER RESPONSIVO)
  // --------------------------------------------------------------------
  const renderMobileNav = () => (
    <Drawer
      open={mobileNav.value}
      onClose={mobileNav.onFalse}
      slotProps={{
        paper: {
          className: mergeClasses([layoutClasses.nav.root, layoutClasses.nav.vertical]),
          sx: {
            overflow: 'unset',
            bgcolor: 'var(--layout-nav-bg)',
            width: 'var(--layout-nav-vertical-width)',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      <Box sx={{ pl: 1.5, pt: 1, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Logo href={paths.devos.root} />
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            ASPPIBRA DevOS
          </Typography>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700 }}>
            Control Plane
          </Typography>
        </Box>
      </Box>

      <Scrollbar fillContent sx={{ flex: '1 1 auto', my: 1 }}>
        <NavSectionVertical
          data={DEVOS_NAV_DATA}
          cssVars={navVars.section}
          sx={{ px: 1, flex: '1 1 auto' }}
        />
      </Scrollbar>

      <Box sx={{ pt: 1 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1.5,
            bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'success.main',
              }}
            />
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
              mock-node-alpha
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', display: 'block', fontSize: '0.68rem' }}
          >
            Control Plane Sandbox • Mocks Ativos
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );

  // --------------------------------------------------------------------
  // 4. ÁREA PRINCIPAL
  // --------------------------------------------------------------------
  const renderMain = () => (
    <MainSection
      sx={{
        minWidth: 0,
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 1680,
          px: { xs: 1.5, sm: 2, md: 3 },
          py: { xs: 2, md: 3 },
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        {children}
      </Container>
    </MainSection>
  );

  // --------------------------------------------------------------------
  // 5. RODAPÉ DE STATUS
  // --------------------------------------------------------------------
  const renderFooter = () => (
    <Box
      sx={{
        px: 3,
        py: 2,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
        color: 'text.secondary',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
          ASPPIBRA DAO • Architecture Baseline v2.2.2 • Control Plane Sandbox (v2.2.3)
        </Typography>
        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
          Safety Status: INV-001 through INV-017 Enforced • In-Memory Mocks Active
        </Typography>
      </Stack>
    </Box>
  );

  return (
    <LayoutSection
      headerSection={renderHeader()}
      sidebarSection={renderSidebar()}
      footerSection={renderFooter()}
      cssVars={{
        ...dashboardLayoutVars(theme),
        ...navVars.layout,
        '--layout-nav-vertical-width': '260px',
      }}
      sx={[
        {
          minHeight: '100vh',
          background: [
            'radial-gradient(at 0% 0%, rgba(0, 167, 111, 0.05) 0px, transparent 45%)',
            'radial-gradient(at 100% 0%, rgba(0, 210, 255, 0.05) 0px, transparent 45%)',
            'radial-gradient(at 50% 50%, rgba(145, 158, 171, 0.04) 0px, transparent 60%)',
            theme.vars.palette.background.neutral,
          ].join(', '),
          backgroundAttachment: 'fixed',
          ...theme.applyStyles('dark', {
            background: [
              'radial-gradient(at 0% 0%, rgba(0, 255, 127, 0.06) 0px, transparent 50%)',
              'radial-gradient(at 100% 0%, rgba(0, 210, 255, 0.05) 0px, transparent 50%)',
              '#020817',
            ].join(', '),
            backgroundAttachment: 'fixed',
          }),
          [`& .${layoutClasses.sidebarContainer}`]: {
            minHeight: '100vh',
            minWidth: 0,
            width: '100%',
            maxWidth: '100%',
            [theme.breakpoints.up(layoutQuery)]: {
              pl: isNavMini.value
                ? 'calc(var(--layout-nav-mini-width) + 24px)'
                : 'calc(var(--layout-nav-vertical-width) + 24px)',
              transition: theme.transitions.create(['padding-left'], {
                easing: 'var(--layout-transition-easing)',
                duration: 'var(--layout-transition-duration)',
              }),
            },
          },
        },
      ]}
    >
      {renderMobileNav()}
      {renderMain()}
    </LayoutSection>
  );
}
