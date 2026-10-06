import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type ActionItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  actionLabel: string;
};

const _mockActions: ActionItem[] = [
  {
    id: 'act-1',
    title: 'Votação Pendente',
    description: '1 proposta aguardando seu voto.',
    icon: 'solar:hand-stars-bold',
    color: 'info.main',
    actionLabel: 'Votar',
  },
  {
    id: 'act-2',
    title: 'Chat e Suporte',
    description: '2 mensagens não lidas no chat.',
    icon: 'solar:chat-round-dots-bold',
    color: 'primary.main',
    actionLabel: 'Abrir Chat',
  },
  {
    id: 'act-3',
    title: 'Perfil Incompleto',
    description: 'Adicione sua carteira Web3.',
    icon: 'solar:user-id-bold',
    color: 'warning.main',
    actionLabel: 'Completar Perfil',
  },
];

export function AppMyActions({ ...other }) {
  return (
    <Card {...other}>
      <CardHeader title="Minhas Pendências" sx={{ mb: 2 }} />

      <Stack spacing={2} sx={{ p: 3, pt: 0 }}>
        {_mockActions.map((item) => (
          <Box
            key={item.id}
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
              border: '1px solid rgba(145, 158, 171, 0.22)',
              boxShadow: [
                '0 4px 12px -2px rgba(15, 23, 42, 0.05)',
                'inset 0 1.5px 0 #ffffff',
                'inset 0 -1px 0 rgba(0, 0, 0, 0.03)',
              ].join(', '),
              transition: theme.transitions.create(['transform', 'box-shadow', 'border-color']),
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: item.color,
                boxShadow: '0 8px 20px -4px rgba(15, 23, 42, 0.1), inset 0 1.5px 0 #ffffff',
              },
              ...theme.applyStyles('dark', {
                background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.75) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  borderColor: item.color,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                },
              }),
            })}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={(theme) => ({
                  width: 44,
                  height: 44,
                  display: 'flex',
                  borderRadius: '12px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.color,
                  bgcolor: (t) => `rgba(${t.vars.palette.grey['500Channel']} / 0.12)`,
                  border: '1px solid rgba(145, 158, 171, 0.2)',
                  boxShadow: 'inset 0 1px 0 #ffffff',
                  ...theme.applyStyles('dark', {
                    bgcolor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                  }),
                })}
              >
                <Iconify icon={item.icon as any} width={24} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.title}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 13 }}>
                  {item.description}
                </Typography>
              </Box>
            </Box>

            <Button
              size="small"
              variant="contained"
              sx={(theme) => ({
                fontWeight: 700,
                fontSize: 12,
                px: 2,
                py: 0.6,
                borderRadius: 1.25,
                bgcolor: 'text.primary',
                color: 'background.paper',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                transition: theme.transitions.create(['transform', 'box-shadow']),
                '&:hover': {
                  bgcolor: 'text.primary',
                  transform: 'translateY(-1.5px)',
                  boxShadow: '0 6px 16px rgba(15, 23, 42, 0.25)',
                },
                ...theme.applyStyles('dark', {
                  bgcolor: '#ffffff',
                  color: '#000000',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                }),
              })}
            >
              {item.actionLabel}
            </Button>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
