import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

const STATS = [
  { label: 'Não Lidas', value: '24', icon: 'solar:chat-square-bold', color: 'error.main', glow: 'rgba(255, 86, 48, 0.25)' },
  { label: 'Online', value: '156', icon: 'solar:users-group-two-rounded-bold', color: 'success.main', glow: 'rgba(34, 197, 94, 0.25)' },
  { label: 'Tickets', value: '12', icon: 'solar:ticket-bold', color: 'warning.main', glow: 'rgba(255, 171, 0, 0.25)' },
  { label: 'Ações de IA', value: '45', icon: 'solar:magic-stick-3-bold', color: 'info.main', glow: 'rgba(0, 184, 217, 0.25)' },
  { label: 'Chamadas', value: '8', icon: 'solar:phone-bold', color: 'primary.main', glow: 'rgba(0, 167, 111, 0.25)' },
];

export function ChatKpiBar() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: { xs: 2, md: 3 },
        height: { xs: 64, md: 72 },
        borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.50) 0%, rgba(255, 255, 255, 0.25) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        flexShrink: 0,
        ...((theme) => theme.applyStyles('dark', {
          background: 'linear-gradient(180deg, rgba(22, 28, 36, 0.65) 0%, rgba(18, 23, 30, 0.40) 100%)',
        })),
      }}
    >
      <Stack 
        direction="row" 
        spacing={2}
        sx={{ width: 1, overflowX: 'auto', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'space-between' } }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mr: 1, display: { xs: 'none', lg: 'block' }, letterSpacing: -0.2 }}>
          Visão Geral
        </Typography>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', py: 0.5 }}>
          {STATS.map((stat) => (
            <Box
              key={stat.label}
              sx={{
                px: 1.5,
                py: 0.75,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                background: (theme) => alpha(theme.palette.background.paper, 0.65),
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.4)}`,
                boxShadow: (theme) => [
                  `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.8)}`,
                  '0 2px 8px -2px rgba(15, 23, 42, 0.05)',
                ].join(', '),
                transition: (theme) => theme.transitions.create(['transform', 'box-shadow']),
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: (theme) => [
                    `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.9)}`,
                    `0 6px 16px -2px ${stat.glow}`,
                  ].join(', '),
                },
                ...((theme) => theme.applyStyles('dark', {
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.10), 0 2px 8px -2px rgba(0, 0, 0, 0.4)',
                })),
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: (theme) => alpha(theme.palette.text.primary, 0.04),
                  boxShadow: `0 0 10px ${stat.glow}`,
                }}
              >
                <Iconify icon={stat.icon as any} width={18} sx={{ color: stat.color }} />
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', fontWeight: 500 }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
