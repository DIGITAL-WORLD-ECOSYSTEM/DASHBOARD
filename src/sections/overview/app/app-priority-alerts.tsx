import { useState } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type PriorityAlert = {
  id: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  actionRoute?: string;
};

const _mockAlerts: PriorityAlert[] = [
  {
    id: 'alt-1',
    severity: 'error',
    title: 'Manutenção Programada',
    message: 'O sistema de saques Pix ficará indisponível no sábado das 02h às 04h.',
  },
  {
    id: 'alt-2',
    severity: 'warning',
    title: 'Assembleia Extraordinária',
    message: 'Faltam apenas 2 dias para o fechamento de pautas da próxima assembleia.',
  },
];

export function AppPriorityAlerts() {
  const [alerts, setAlerts] = useState<PriorityAlert[]>(_mockAlerts);

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  if (!alerts.length) return null;

  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      {alerts.map((alert) => (
        <Collapse key={alert.id} in>
          <Alert
            severity={alert.severity}
            action={
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  size="small"
                  onClick={() => handleDismiss(alert.id)}
                  sx={(theme) => {
                    const colorChan = theme.vars.palette[alert.severity].mainChannel;
                    return {
                      fontWeight: 700,
                      fontSize: 12,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      color: `${alert.severity}.darker`,
                      bgcolor: varAlpha(colorChan, 0.14),
                      border: `1px solid ${varAlpha(colorChan, 0.28)}`,
                      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                      transition: theme.transitions.create(['transform', 'background-color']),
                      '&:hover': {
                        bgcolor: varAlpha(colorChan, 0.22),
                        transform: 'translateY(-1px)',
                      },
                      ...theme.applyStyles('dark', {
                        color: `${alert.severity}.lighter`,
                        bgcolor: varAlpha(colorChan, 0.22),
                      }),
                    };
                  }}
                >
                  Marcar Lida
                </Button>
              </Box>
            }
            sx={(theme) => {
              const colorMain = theme.vars.palette[alert.severity].mainChannel;
              return {
                display: 'flex',
                alignItems: 'center',
                borderRadius: '16px',
                p: 2,
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${varAlpha(colorMain, 0.12)} 0%, ${varAlpha(colorMain, 0.05)} 100%)`,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${varAlpha(colorMain, 0.3)}`,
                borderLeft: `5px solid ${theme.vars.palette[alert.severity].main}`,
                boxShadow: [
                  `0 8px 24px -4px ${varAlpha(colorMain, 0.15)}`,
                  'inset 0 1.5px 0 rgba(255, 255, 255, 0.8)',
                  'inset 0 -1px 0 rgba(0, 0, 0, 0.03)',
                ].join(', '),
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '100%',
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.04) 30%, transparent 60%)',
                  pointerEvents: 'none',
                  zIndex: 1,
                },
                ...theme.applyStyles('dark', {
                  background: `linear-gradient(135deg, ${varAlpha(colorMain, 0.18)} 0%, rgba(15, 23, 42, 0.9) 100%)`,
                  border: `1px solid ${varAlpha(colorMain, 0.35)}`,
                  borderLeft: `5px solid ${theme.vars.palette[alert.severity].main}`,
                  boxShadow: `0 8px 28px -4px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
                }),
                '& .MuiAlert-message': {
                  flexGrow: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative',
                  zIndex: 2,
                },
                '& .MuiAlert-icon': {
                  position: 'relative',
                  zIndex: 2,
                  fontSize: 24,
                },
              };
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 700 }}>
                {alert.title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>{alert.message}</Typography>
            </Box>
          </Alert>
        </Collapse>
      ))}
    </Stack>
  );
}
