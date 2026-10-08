import type { ReactNode } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

const COCKPIT_NAV_ITEMS = [
  { label: 'Observabilidade', path: paths.devos.root, icon: 'solar:graph-up-bold' },
  { label: 'Database D1', path: paths.devos.database, icon: 'solar:database-bold' },
  { label: 'Treasury Safe', path: paths.devos.dao, icon: 'solar:shield-star-bold' },
  { label: 'Security & Devices', path: paths.devos.security, icon: 'solar:shield-keyhole-bold' },
  { label: 'Audit Trail', path: paths.devos.audit, icon: 'solar:document-text-bold' },
  { label: 'APIs Vault', path: paths.devos.apis, icon: 'solar:key-square-bold' },
  { label: 'Infrastructure', path: paths.devos.infrastructure, icon: 'solar:server-square-bold' },
];

export function DevOSLayout({ children }: Props) {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        bgcolor: '#0B0F17',
        color: '#F1F5F9',
        fontFamily: (theme) => theme.typography.fontFamily,
      }}
    >
      {/* 1. MOCK SAFETY RIBBON (PERMANENT BANNER) */}
      <Box
        sx={{
          px: 3,
          py: 0.8,
          bgcolor: 'rgba(234, 88, 12, 0.15)',
          borderBottom: '1px solid rgba(234, 88, 12, 0.4)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip
              label="DEVOS — LOCAL MOCK"
              size="small"
              sx={{
                bgcolor: '#EA580C',
                color: '#FFF',
                fontWeight: 800,
                fontSize: '0.72rem',
                letterSpacing: 0.5,
              }}
            />
            <Chip
              label="READ ONLY"
              size="small"
              sx={{
                bgcolor: 'rgba(16, 185, 129, 0.2)',
                color: '#10B981',
                border: '1px solid #10B981',
                fontWeight: 700,
                fontSize: '0.7rem',
              }}
            />
            <Chip
              label="NO PRODUCTION CONNECTION"
              size="small"
              sx={{
                bgcolor: 'rgba(56, 189, 248, 0.15)',
                color: '#38BDF8',
                border: '1px solid #38BDF8',
                fontWeight: 700,
                fontSize: '0.7rem',
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: '#94A3B8', display: { xs: 'none', lg: 'inline' } }}
            >
              Zero Production Side Effects • D1 Emulated • EVM Offline • Tauri Native Shell deferred to Etapa 1.2
            </Typography>
          </Stack>

          <Button
            component={RouterLink}
            href="/"
            size="small"
            variant="outlined"
            startIcon={<Iconify icon={'solar:arrow-left-outline' as any} width={14} />}
            sx={{
              borderColor: 'rgba(148, 163, 184, 0.3)',
              color: '#94A3B8',
              fontSize: '0.75rem',
              py: 0.2,
              px: 1.5,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#F8FAFC',
                color: '#F8FAFC',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            Dashboard de Membros
          </Button>
        </Stack>
      </Box>

      {/* 2. COCKPIT MISSION CONTROL HEADER */}
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: 2,
          bgcolor: '#0F172A',
          borderBottom: '1px solid #1E293B',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between' }}
        >
          {/* Brand + Node info */}
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                bgcolor: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38BDF8',
              }}
            >
              <Iconify icon={'solar:command-bold' as any} width={24} />
            </Box>
            <Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#F8FAFC', letterSpacing: -0.5 }}>
                  ASPPIBRA DevOS
                </Typography>
                <Chip
                  label="v2.2.2 COCKPIT"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(148, 163, 184, 0.15)',
                    color: '#94A3B8',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    height: 20,
                  }}
                />
              </Stack>
              <Typography variant="caption" sx={{ color: '#64748B', fontFamily: 'monospace' }}>
                Node: mock-node-alpha (Linux x86_64) • AAL: 2 (Simulated)
              </Typography>
            </Box>
          </Stack>

          {/* Quick Telemetry Indicators */}
          <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
            <Tooltip title="Deterministic in-memory latency emulator">
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                  LATENCY
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#10B981', fontWeight: 700, fontFamily: 'monospace' }}
                >
                  16ms (p50)
                </Typography>
              </Box>
            </Tooltip>

            <Tooltip title="Active edge worker nodes (Mock)">
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                  EDGE WORKERS
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#38BDF8', fontWeight: 700, fontFamily: 'monospace' }}
                >
                  12 Nodes Online
                </Typography>
              </Box>
            </Tooltip>

            <Tooltip title="Strict read-only safety guard">
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                  OPERATION POLICY
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#F59E0B', fontWeight: 700, fontFamily: 'monospace' }}
                >
                  READ_ONLY_MOCK
                </Typography>
              </Box>
            </Tooltip>
          </Stack>
        </Stack>

        {/* 3. COCKPIT NAVIGATION TABS */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mt: 2.5,
            pt: 1.5,
            borderTop: '1px solid #1E293B',
            overflowX: 'auto',
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#334155', borderRadius: 2 },
          }}
        >
          {COCKPIT_NAV_ITEMS.map((item) => {
            const isActive =
              item.path === paths.devos.root
                ? pathname === paths.devos.root || pathname === `${paths.devos.root}/`
                : pathname.startsWith(item.path);

            return (
              <Button
                key={item.path}
                component={RouterLink}
                href={item.path}
                size="small"
                startIcon={<Iconify icon={item.icon as any} width={16} />}
                sx={{
                  px: 2,
                  py: 0.8,
                  whiteSpace: 'nowrap',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#38BDF8' : '#94A3B8',
                  bgcolor: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(56, 189, 248, 0.3)' : 'transparent',
                  borderRadius: 1,
                  textTransform: 'none',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    color: '#F8FAFC',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Stack>
      </Box>

      {/* 4. MAIN COCKPIT VIEWPORT */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1680, p: 0 }}>
          {children}
        </Container>
      </Box>

      {/* 5. COCKPIT FOOTER STATUS LINE */}
      <Box
        sx={{
          px: 3,
          py: 1.5,
          bgcolor: '#0B0F17',
          borderTop: '1px solid #1E293B',
          color: '#64748B',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
            ASPPIBRA DAO • Architecture Baseline v2.2.2 • Control Plane Sandbox (Etapa 1.1)
          </Typography>
          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
            Safety Status: INV-001 through INV-017 Enforced • In-Memory Mocks Active
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
