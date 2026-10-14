import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const metadata = { title: `DevOS Cockpit - Central de Notificações - ${CONFIG.appName}` };

const CHANNELS = [
  {
    title: 'E-mail Transacional & Marketing',
    desc: 'Disparos transacionais da DAO, confirmações de ordens e comunicados aos cooperados.',
    icon: 'solar:letter-bold',
    status: 'Integrado',
    color: '#0288D1',
    path: paths.devos.notifications.email,
  },
  {
    title: 'Chat Interno & Suporte',
    desc: 'Fila de atendimento interno dos cooperados e moderação de salas de membros da DAO.',
    icon: 'solar:users-group-rounded-bold',
    status: 'Integrado',
    color: '#00ff7f',
    path: paths.devos.notifications.chat,
  },
  {
    title: 'WhatsApp Oficial DAO',
    desc: 'Canal de mensageria direta para alertas operacionais e suporte aos cooperados.',
    icon: 'solar:chat-round-dots-bold',
    status: 'Standby',
    color: '#22C55E',
    path: paths.devos.notifications.whatsapp,
  },
  {
    title: 'SMS & Alertas Críticos',
    desc: 'Gateway de mensagens SMS para contingência e autenticação de dois fatores da infraestrutura.',
    icon: 'solar:phone-calling-bold',
    status: 'Standby',
    color: '#F59E0B',
    path: paths.devos.notifications.sms,
  },
  {
    title: 'Broadcasts & Redes Sociais',
    desc: 'Sincronização de anúncios oficiais para canais do Telegram, Discord e X (Twitter).',
    icon: 'solar:share-circle-bold',
    status: 'Planejado',
    color: '#8B5CF6',
    path: paths.devos.notifications.social,
  },
  {
    title: 'Configurações & LGPD',
    desc: 'Parâmetros globais de opt-in/opt-out de cooperados e políticas de privacidade e proteção de dados.',
    icon: 'solar:settings-minimalistic-bold',
    status: 'Governança',
    color: '#EC4899',
    path: paths.devos.notifications.settings,
  },
];

export default function NotificationsPage() {
  const router = useRouter();

  return (
    <>
      <title>{metadata.title}</title>

      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#F8FAFC' }}>
              Central de Notificações & Mensageria
            </Typography>
            <Chip
              label="CONTROL PLANE"
              size="small"
              sx={{
                bgcolor: 'rgba(0, 167, 111, 0.15)',
                color: '#00A76F',
                fontWeight: 700,
                fontSize: '0.68rem',
              }}
            />
          </Stack>
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            Hub centralizado de despacho, monitoramento multicanal e governança de comunicados da DAO ASPPIBRA.
          </Typography>
        </Box>

        {/* Channels Grid */}
        <Grid container spacing={2.5}>
          {CHANNELS.map((channel) => (
            <Grid key={channel.title} size={{ xs: 12, md: 6, lg: 4 }}>
              <Card
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(30, 41, 59, 0.55) 100%)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                  borderRadius: 2,
                  transition: 'all 0.25s ease-in-out',
                  '&:hover': {
                    border: '1px solid rgba(0, 167, 111, 0.35)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px 0 rgba(0, 167, 111, 0.15)',
                  },
                }}
              >
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: `${channel.color}22`,
                      color: channel.color,
                    }}
                  >
                    <Iconify icon={channel.icon as any} width={24} />
                  </Box>
                  <Chip
                    label={channel.status}
                    size="small"
                    sx={{
                      bgcolor: `${channel.color}1A`,
                      color: channel.color,
                      fontWeight: 700,
                      fontSize: '0.68rem',
                    }}
                  />
                </Stack>

                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 1 }}>
                  {channel.title}
                </Typography>

                <Typography variant="body2" sx={{ color: '#94A3B8', flex: 1, mb: 2 }}>
                  {channel.desc}
                </Typography>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => router.push(channel.path)}
                  sx={{
                    color: '#E2E8F0',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    '&:hover': {
                      borderColor: channel.color,
                      color: channel.color,
                      bgcolor: `${channel.color}11`,
                    },
                  }}
                >
                  Acessar Canal
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </>
  );
}
