import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const metadata = { title: `DevOS Cockpit - SMS & OTP - ${CONFIG.appName}` };

export default function DevOSSmsPage() {
  const router = useRouter();

  return (
    <>
      <title>{metadata.title}</title>

      <Stack spacing={3}>
        <Box>
          <Button
            size="small"
            startIcon={<Iconify icon={'solar:arrow-left-outline' as any} />}
            onClick={() => router.push(paths.devos.notifications.root)}
            sx={{ color: '#94A3B8', '&:hover': { color: '#00A76F' }, mb: 1 }}
          >
            Voltar para Central de Notificações
          </Button>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#F8FAFC' }}>
              SMS (OTP e Alertas Críticos)
            </Typography>
            <Chip
              label="STANDBY"
              size="small"
              sx={{
                bgcolor: 'rgba(245, 158, 11, 0.15)',
                color: '#F59E0B',
                fontWeight: 700,
                fontSize: '0.68rem',
              }}
            />
          </Stack>
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            Gateway de mensagens SMS para contingência e autenticação de dois fatores da infraestrutura.
          </Typography>
        </Box>

        <Card
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(30, 41, 59, 0.55) 100%)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 2,
          }}
        >
          <Alert severity="info" sx={{ bgcolor: 'rgba(2, 136, 209, 0.12)', color: '#38BDF8' }}>
            <strong>Arquitetura ASoT:</strong> Gateway estrutural de SMS e mensagens curtas para contingência de operações críticas da DAO.
          </Alert>
        </Card>
      </Stack>
    </>
  );
}
