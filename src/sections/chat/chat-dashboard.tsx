import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useUserProfile } from 'src/auth/facades';

// ----------------------------------------------------------------------



const RECENT_FILES = [
  {
    name: 'Relatório_Financeiro_Q3.pdf',
    type: 'pdf',
    source: 'Maria (Financeiro)',
    date: 'Hoje, 09:30',
    icon: 'solar:document-bold',
    color: 'error',
  },
  {
    name: 'Comprovante_PIX_Ref_892.png',
    type: 'img',
    source: 'Ticket #8921',
    date: 'Ontem, 16:45',
    icon: 'solar:gallery-bold',
    color: 'info',
  },
  {
    name: 'Contrato_Prestacao_Servicos.docx',
    type: 'doc',
    source: 'Nexus AI',
    date: 'Segunda, 10:15',
    icon: 'solar:document-text-bold',
    color: 'primary',
  },
];

export function ChatDashboard() {
  const user = useUserProfile();
  const theme = useTheme();
  const router = useRouter();

  const handleOpenConversation = (id: string) => {
    router.push(`${paths.dashboard.chat}?id=${id}`);
  };

  return (
    <Scrollbar sx={{ flex: '1 1 0', minHeight: 0, height: 1 }}>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'transparent',
          p: { xs: 2.5, md: 4, lg: 5 },
        }}
      >
        {/* Welcome Header */}
        <Box sx={{ mb: 3.5 }}>
          <Typography variant="h3" sx={{ mb: 1, color: 'text.primary', fontWeight: 800, letterSpacing: -0.5 }}>
            Portal de Comunicação ASPPIBRA
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Bem-vindo, {user?.displayName?.split(' ')[0] || 'Usuário'}. Aqui está o resumo das suas operações hoje.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 4,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              md: 'repeat(2, minmax(0, 1fr))',
            },
          }}
        >
          {/* Quick Actions */}
          <Stack spacing={2.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Iconify icon="solar:play-circle-bold" width={22} sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Ações Rápidas</Typography>
            </Box>

            <Stack spacing={2}>
              {[
                {
                  title: 'Criar Novo Grupo',
                  subtitle: 'Reunir equipe em um canal',
                  icon: 'solar:users-group-rounded-bold',
                  color: 'primary',
                  conversationId: 'c-dao-governanca',
                },
                {
                  title: 'Falar com IA (Nexus)',
                  subtitle: 'Assistente corporativo',
                  icon: 'solar:magic-stick-3-bold',
                  color: 'secondary',
                  conversationId: 'c-nexus-ai',
                },
                {
                  title: 'Abrir Ticket',
                  subtitle: 'Suporte interno ou externo',
                  icon: 'solar:ticket-bold',
                  color: 'warning',
                  conversationId: 'c-suporte-ticket',
                },
              ].map((action) => (
                <Card
                  key={action.title}
                  onClick={() => handleOpenConversation(action.conversationId)}
                  sx={{
                    p: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer',
                    borderRadius: 2.2,
                    background: (theme) => alpha(theme.palette.background.paper, 0.70),
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.6)}`,
                    boxShadow: (theme) => [
                      `inset 0 1.5px 0 ${alpha(theme.palette.common.white, 0.85)}`,
                      '0 6px 18px -4px rgba(15, 23, 42, 0.06)',
                    ].join(', '),
                    transition: (theme) => theme.transitions.create(['border-color', 'background-color', 'transform', 'box-shadow']),
                    '&:hover': {
                      borderColor: `${action.color}.main`,
                      transform: 'translateY(-2px)',
                      boxShadow: (theme) => [
                        `inset 0 1.5px 0 rgba(255, 255, 255, 0.9)`,
                        `0 10px 24px -4px ${alpha(theme.palette[action.color as 'primary' | 'secondary' | 'warning'].main, 0.3)}`,
                      ].join(', '),
                    },
                    ...((theme) => theme.applyStyles('dark', {
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 6px 18px -4px rgba(0, 0, 0, 0.5)',
                    })),
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      color: `${action.color}.main`,
                      bgcolor: alpha(theme.palette[action.color as 'primary' | 'secondary' | 'warning'].main, 0.14),
                      border: `1px solid ${alpha(theme.palette[action.color as 'primary' | 'secondary' | 'warning'].main, 0.25)}`,
                      boxShadow: `0 0 12px ${alpha(theme.palette[action.color as 'primary' | 'secondary' | 'warning'].main, 0.2)}`,
                    }}
                  >
                    <Iconify icon={action.icon as any} width={24} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 700 }}>
                      {action.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {action.subtitle}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Stack>
          </Stack>

          {/* Recent Files */}
          <Stack spacing={2.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Iconify icon={"solar:folder-with-files-bold" as any} width={22} sx={{ color: 'info.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Últimos Anexos na Rede</Typography>
            </Box>

            <Stack spacing={2}>
              {RECENT_FILES.map((file, idx) => (
                <Card
                  key={file.name}
                  onClick={() => handleOpenConversation(idx === 0 ? 'c-nexus-ai' : idx === 1 ? 'c-p2p-carlos' : 'c-dao-governanca')}
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer',
                    borderRadius: 2.2,
                    background: (theme) => alpha(theme.palette.background.paper, 0.70),
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.6)}`,
                    boxShadow: (theme) => [
                      `inset 0 1.5px 0 ${alpha(theme.palette.common.white, 0.85)}`,
                      '0 6px 18px -4px rgba(15, 23, 42, 0.06)',
                    ].join(', '),
                    transition: (theme) => theme.transitions.create(['border-color', 'background-color', 'transform', 'box-shadow']),
                    '&:hover': {
                      borderColor: `${file.color}.main`,
                      transform: 'translateY(-2px)',
                      boxShadow: (theme) => [
                        `inset 0 1.5px 0 rgba(255, 255, 255, 0.9)`,
                        `0 10px 24px -4px ${alpha(theme.palette[file.color as 'error' | 'info' | 'primary'].main, 0.25)}`,
                      ].join(', '),
                    },
                    ...((theme) => theme.applyStyles('dark', {
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 6px 18px -4px rgba(0, 0, 0, 0.5)',
                    })),
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      color: `${file.color}.main`,
                      bgcolor: alpha(theme.palette[file.color as 'error' | 'info' | 'primary'].main, 0.14),
                      border: `1px solid ${alpha(theme.palette[file.color as 'error' | 'info' | 'primary'].main, 0.25)}`,
                    }}
                  >
                    <Iconify icon={file.icon as any} width={24} />
                  </Box>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap sx={{ mb: 0.5, fontWeight: 700 }}>
                      {file.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {file.source}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0, fontWeight: 600 }}>
                    {file.date}
                  </Typography>
                </Card>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Scrollbar>
  );
}
