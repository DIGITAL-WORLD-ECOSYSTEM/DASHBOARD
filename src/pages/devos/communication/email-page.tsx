import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';

import { MailView } from 'src/sections/mail/view';

// ----------------------------------------------------------------------

const metadata = { title: `DevOS Cockpit - E-mail & Disparos - ${CONFIG.appName}` };

export default function DevOSEmailPage() {
  const router = useRouter();

  return (
    <>
      <title>{metadata.title}</title>

      <Stack spacing={2.5}>
        <Box>
          <Button
            size="small"
            startIcon={<Iconify icon={'solar:arrow-left-outline' as any} />}
            onClick={() => router.push(paths.devos.notifications.root)}
            sx={{
              color: '#94A3B8',
              '&:hover': { color: '#00A76F' },
              mb: 1,
            }}
          >
            Voltar para Central de Notificações
          </Button>
        </Box>

        <MailView />
      </Stack>
    </>
  );
}
