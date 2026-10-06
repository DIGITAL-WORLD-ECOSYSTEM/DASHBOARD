import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function AppNetworkGrowth({ ...other }) {
  return (
    <Card
      sx={[
        (theme) => ({
          p: 3,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(0, 120, 103, 0.92) 0%, rgba(0, 75, 80, 0.96) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          boxShadow: [
            '0 20px 48px -10px rgba(0, 75, 80, 0.35)',
            'inset 0 1.5px 0 rgba(255, 255, 255, 0.35)',
            'inset 0 -1.5px 0 rgba(0, 0, 0, 0.25)',
          ].join(', '),
          color: 'primary.lighter',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            borderRadius: 'inherit',
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.05) 30%, transparent 60%)',
            pointerEvents: 'none',
            zIndex: 1,
          },
          ...theme.applyStyles('dark', {
            background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.85) 0%, rgba(2, 44, 34, 0.92) 100%)',
            border: '1px solid rgba(0, 255, 127, 0.25)',
            boxShadow: [
              '0 20px 48px -10px rgba(0, 0, 0, 0.7)',
              'inset 0 1.5px 0 rgba(255, 255, 255, 0.2)',
              'inset 0 0 20px rgba(0, 255, 127, 0.1)',
            ].join(', '),
          }),
        }),
      ]}
      {...other}
    >
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2, position: 'relative', zIndex: 2 }}>
        <Typography variant="h6">Crescimento da Comunidade</Typography>
        <Iconify icon={'solar:chart-square-bold' as any} width={24} sx={{ opacity: 0.65 }} />
      </Stack>

      <Stack spacing={2} sx={{ position: 'relative', zIndex: 2 }}>
        <GrowthItem icon="solar:users-group-rounded-bold" label="Novos Membros" value="+23" />
        <GrowthItem icon="solar:link-circle-bold" label="Indicações" value="+4" />
        <GrowthItem icon="solar:hand-shake-bold" label="Parceiros" value="+2" />
      </Stack>
    </Card>
  );
}

function GrowthItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Iconify icon={icon as any} width={20} sx={{ opacity: 0.72 }} />
        <Typography variant="body2">{label}</Typography>
      </Stack>
      <Typography variant="subtitle2" sx={{ color: 'success.light' }}>
        {value}
      </Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function AppEcosystemNumbers({ ...other }) {
  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)', ...other }}>
      <NumberCard title="Membros" value="1.240" icon="solar:user-id-bold" color="info" />
      <NumberCard title="Projetos" value="18" icon="solar:rocket-bold" color="warning" />
      <NumberCard title="Parceiros" value="7" icon="solar:buildings-bold" color="primary" />
      <NumberCard title="Propostas" value="3" icon="solar:archive-bold" color="success" />
    </Box>
  );
}

function NumberCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <Card
      sx={[
        (theme) => {
          const colorMain = theme.vars.palette[color as 'primary' | 'info' | 'warning' | 'success'].mainChannel;

          return {
            p: 2.5,
            pt: 2.75,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',

            // 💎 VIDROMORFISMO 3D COM AURA COLORIDA + APPLE RETINA BLUR
            background: [
              `radial-gradient(circle at 85% 15%, ${varAlpha(colorMain, 0.18)} 0%, transparent 65%)`,
              'linear-gradient(180deg, #FFFFFF 0%, #FAFCFD 60%, #F4F7F9 100%)',
            ].join(', '),
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(145, 158, 171, 0.24)',
            boxShadow: [
              '0 14px 32px -8px rgba(15, 23, 42, 0.09)',
              '0 4px 10px -2px rgba(15, 23, 42, 0.04)',
              'inset 0 2px 0 #ffffff',
              'inset 1px 0 0 rgba(255, 255, 255, 0.8)',
              'inset 0 -1.5px 0 rgba(0, 0, 0, 0.04)',
            ].join(', '),

            // 👑 COROA DE LUZ COLORIDA NO TOPO (ACCENT BAR 3.5px)
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3.5px',
              background: `linear-gradient(90deg, ${varAlpha(colorMain, 0.35)} 0%, ${theme.vars.palette[color as 'primary' | 'info' | 'warning' | 'success'].main} 50%, ${varAlpha(colorMain, 0.35)} 100%)`,
              boxShadow: `0 0 12px ${varAlpha(colorMain, 0.65)}`,
              zIndex: 3,
            },

            // ✨ REFLEXO GLOSSY DIAGONAL 3D (WET GLASS SHEEN)
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              borderRadius: 'inherit',
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 30%, transparent 60%)',
              pointerEvents: 'none',
              zIndex: 1,
            },

            // 🌑 MODO DARK CYBER / OBSIDIAN GLASS
            ...theme.applyStyles('dark', {
              background: [
                `radial-gradient(circle at 85% 15%, ${varAlpha(colorMain, 0.22)} 0%, transparent 65%)`,
                'linear-gradient(180deg, rgba(15, 23, 42, 0.88) 0%, rgba(2, 8, 23, 0.95) 100%)',
              ].join(', '),
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: [
                '0 18px 40px -8px rgba(0, 0, 0, 0.8)',
                'inset 0 1.5px 0 rgba(255, 255, 255, 0.18)',
                'inset 0 -1px 0 rgba(0, 0, 0, 0.5)',
              ].join(', '),
              '&::before': {
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 30%, transparent 60%)',
              },
            }),

            // 🚀 FÍSICA DE HOVER TÁTIL 3D
            cursor: 'pointer',
            transition: theme.transitions.create(
              ['transform', 'box-shadow', 'border-color'],
              { duration: theme.transitions.duration.shorter }
            ),
            '&:hover': {
              transform: 'translateY(-6px) scale(1.025)',
              borderColor: `${color}.main`,
              boxShadow: [
                `0 22px 44px -8px ${varAlpha(colorMain, 0.32)}`,
                '0 8px 16px -2px rgba(15, 23, 42, 0.08)',
                'inset 0 2px 0 rgba(255, 255, 255, 1)',
              ].join(', '),
              ...theme.applyStyles('dark', {
                boxShadow: [
                  `0 22px 48px -8px ${varAlpha(colorMain, 0.5)}`,
                  'inset 0 1.5px 0 rgba(255, 255, 255, 0.3)',
                  `inset 0 0 20px ${varAlpha(colorMain, 0.2)}`,
                ].join(', '),
              }),
            },
          };
        },
      ]}
    >
      {/* Cápsula de Ícone em Relevo 3D */}
      <Box
        sx={(theme) => {
          const colorMain = theme.vars.palette[color as 'primary' | 'info' | 'warning' | 'success'].mainChannel;
          return {
            mb: 1.5,
            width: 48,
            height: 48,
            display: 'flex',
            borderRadius: '16px',
            alignItems: 'center',
            justifyContent: 'center',
            color: `${color}.main`,
            background: `linear-gradient(135deg, ${varAlpha(colorMain, 0.24)} 0%, ${varAlpha(colorMain, 0.1)} 100%)`,
            border: `1.5px solid ${varAlpha(colorMain, 0.35)}`,
            boxShadow: `0 6px 16px ${varAlpha(colorMain, 0.25)}, inset 0 1.5px 0 #ffffff`,
            position: 'relative',
            zIndex: 2,
            ...theme.applyStyles('dark', {
              background: `linear-gradient(135deg, ${varAlpha(colorMain, 0.35)} 0%, ${varAlpha(colorMain, 0.15)} 100%)`,
              border: `1.5px solid ${varAlpha(colorMain, 0.5)}`,
              boxShadow: `0 0 20px ${varAlpha(colorMain, 0.4)}, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
            }),
          };
        }}
      >
        <Iconify icon={icon as any} width={26} />
      </Box>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          position: 'relative',
          zIndex: 2,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontWeight: 700,
          position: 'relative',
          zIndex: 2,
          mt: 0.5,
          textTransform: 'uppercase',
          fontSize: 11,
          letterSpacing: 0.75,
        }}
      >
        {title}
      </Typography>
    </Card>
  );
}
