
import type { DrawerProps } from '@mui/material/Drawer';

import { useState } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const SOCIAL_APIS = [
  { id: 'ig', name: 'Instagram Graph API', provider: 'Meta', status: 'connected', account: '@asppibra_oficial', version: 'v19.0', lastSync: '2 min ago', quota: 45, color: '#E1306C', automations: 3 },
  { id: 'fb', name: 'Facebook Marketing', provider: 'Meta', status: 'syncing', account: 'ASPPIBRA Global', version: 'v19.0', lastSync: 'Syncing...', quota: 82, color: '#1877F2', automations: 5 },
  { id: 'yt', name: 'YouTube Data API', provider: 'Google', status: 'error', account: 'UCxY_89...', version: 'v3', lastSync: 'Failed 1h ago', quota: 98, color: '#FF0000', automations: 0 },
  { id: 'li', name: 'LinkedIn Marketing', provider: 'Microsoft', status: 'connected', account: 'ASPPIBRA SA', version: '202401', lastSync: '5 min ago', quota: 33, color: '#0A66C2', automations: 2 },
  { id: 'tk', name: 'TikTok Developer API', provider: 'ByteDance', status: 'connected', account: '@asppibra_br', version: 'v2.1', lastSync: '15 min ago', quota: 12, color: '#010101', automations: 1 },
  { id: 'tw', name: 'X (Twitter) API', provider: 'X Corp', status: 'expired', account: '@asppibra', version: 'v2', lastSync: '3 days ago', quota: 0, color: '#000000', automations: 0 },
];

const LOGS = [
  { id: 1, time: '13:37:42', event: 'Webhook Deliver', endpoint: 'POST /ig/comments', status: 200, latency: '124ms', source: 'Instagram' },
  { id: 2, time: '13:36:15', event: 'Token Refresh', endpoint: 'POST /oauth/token', status: 200, latency: '89ms', source: 'Meta' },
  { id: 3, time: '13:30:00', event: 'Quota Exceeded', endpoint: 'GET /yt/analytics', status: 429, latency: '45ms', source: 'YouTube' },
  { id: 4, time: '13:25:11', event: 'Data Sync', endpoint: 'GET /li/organization', status: 200, latency: '312ms', source: 'LinkedIn' },
  { id: 5, time: '13:10:05', event: 'Auth Error', endpoint: 'GET /tw/users/me', status: 401, latency: '67ms', source: 'X' },
];

const ACTIVITY = [
  { type: 'success', text: 'Instagram webhook received: new_comment', time: 'Agora' },
  { type: 'warning', text: 'YouTube API quota reaching 98%', time: '10 min atrás' },
  { type: 'error', text: 'X (Twitter) token expired. Reauth required.', time: '1h atrás' },
  { type: 'info', text: 'Daily automation "Sync FB Metrics" completed', time: '3h atrás' },
  { type: 'success', text: 'LinkedIn Marketing API reconnected successfully', time: '5h atrás' },
];

const STATUS_CONFIG: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'default' | 'info' }> = {
  connected: { label: 'Conectado', color: 'success' },
  syncing:   { label: 'Sincronizando', color: 'info' },
  error:     { label: 'Erro', color: 'error' },
  expired:   { label: 'Expirado', color: 'warning' },
};

const ACTIVITY_COLORS: Record<string, string> = {
  success: '#00a76f',
  warning: '#ffab00',
  error:   '#ff5630',
  info:    '#00b8d9',
};

// ----------------------------------------------------------------------
// Drawer: API Detail

type ApiType = (typeof SOCIAL_APIS)[number];

function ApiDetailDrawer({ open, onClose, api }: { open: DrawerProps['open']; onClose: NonNullable<DrawerProps['onClose']>; api: ApiType | null }) {
  const [tab, setTab] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const theme = useTheme();

  if (!api) return null;

  const tabs = ['Geral', 'Credenciais', 'Permissões', 'Logs'];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: { xs: '100%', sm: 520 }, bgcolor: 'background.paper' } } }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: alpha(api.color, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${alpha(api.color, 0.3)}` }}>
          <Iconify icon={"solar:global-bold-duotone" as any} width={24} sx={{ color: api.color }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>{api.name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Chip size="small" label={STATUS_CONFIG[api.status]?.label} color={STATUS_CONFIG[api.status]?.color} />
            <Typography variant="caption" color="text.secondary">{api.account}</Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        {tabs.map((t) => <Tab key={t} label={t} />)}
      </Tabs>

      {/* Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>

        {/* Tab: Geral */}
        {tab === 0 && (
          <Stack spacing={2}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {[
                { label: 'Provider', value: api.provider },
                { label: 'Versão', value: api.version },
                { label: 'Ambiente', value: 'Produção' },
                { label: 'Último Sync', value: api.lastSync },
              ].map((item) => (
                <Box key={item.label} sx={{ p: 2, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.04) }}>
                  <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                  <Typography variant="body2" fontWeight={600} mt={0.5}>{item.value}</Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ p: 2, borderRadius: 1.5, border: '1px solid', borderColor: 'warning.main', bgcolor: alpha('#ffab00', 0.08) }}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Iconify icon={"solar:danger-triangle-bold-duotone" as any} sx={{ color: 'warning.main', mt: 0.3, flexShrink: 0 }} />
                <Box>
                  <Typography variant="caption" fontWeight={700} color="warning.main">Aviso de Cota</Typography>
                  <Typography variant="caption" display="block" color="warning.main" sx={{ opacity: 0.8, mt: 0.3 }}>
                    Você está se aproximando da cota diária para {api.name}. Considere otimizar suas requisições.
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>Uso de Cota: {api.quota}%</Typography>
              <LinearProgress variant="determinate" value={api.quota} color={api.quota > 90 ? 'error' : api.quota > 70 ? 'warning' : 'success'} sx={{ height: 8, borderRadius: 1 }} />
            </Box>
          </Stack>
        )}

        {/* Tab: Credenciais */}
        {tab === 1 && (
          <Stack spacing={2.5}>
            <Box sx={{ p: 2, borderRadius: 1.5, border: '1px solid', borderColor: 'success.main', bgcolor: alpha('#00a76f', 0.08), display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Iconify icon={"solar:shield-check-bold-duotone" as any} sx={{ color: 'success.main' }} />
              <Box>
                <Typography variant="caption" fontWeight={700} color="success.main">Criptografado AES-256</Typography>
                <Typography variant="caption" display="block" color="text.secondary">Credenciais nunca ficam expostas em texto simples.</Typography>
              </Box>
            </Box>

            {[
              { label: 'Client ID / App ID', value: 'app_94817263501928', secret: false },
              { label: 'Client Secret', value: 'sk_live_...a8f9', secret: true },
              { label: 'Access Token', value: 'EAAGm0PX4ZC...9XAZDZD', secret: true },
              { label: 'Callback URL (OAuth)', value: 'https://api.asppibra.com/oauth/callback', secret: false },
            ].map((field) => (
              <Box key={field.label}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>{field.label}</Typography>
                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Box component="input"
                    readOnly
                    type={field.secret && !showSecret ? 'password' : 'text'}
                    value={field.value}
                    sx={{ width: '100%', pr: 8, pl: 1.5, py: 1.2, fontFamily: 'monospace', fontSize: 13, bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08), border: '1px solid', borderColor: 'divider', borderRadius: 1, color: 'text.primary', outline: 'none', '&:focus': { borderColor: 'primary.main' } }}
                  />
                  <Box sx={{ position: 'absolute', right: 4, display: 'flex', gap: 0.5 }}>
                    {field.secret && (
                      <IconButton size="small" onClick={() => setShowSecret(!showSecret)}>
                        <Iconify icon={showSecret ? 'solar:eye-closed-bold' : 'solar:eye-bold'} width={16} />
                      </IconButton>
                    )}
                    <IconButton size="small">
                      <Iconify icon="solar:copy-bold" width={16} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}

            <Button variant="outlined" size="small" startIcon={<Iconify icon={"solar:refresh-bold" as any} />} sx={{ alignSelf: 'flex-end' }}>
              Regenerar Tokens
            </Button>
          </Stack>
        )}

        {/* Tab: Permissões */}
        {tab === 2 && (
          <Stack spacing={1.5}>
            {['read_insights', 'manage_comments', 'publish_content', 'webhooks'].map((p) => (
              <Box key={p} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" fontFamily="monospace">{p}</Typography>
                <Iconify icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
              </Box>
            ))}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', opacity: 0.5 }}>
              <Typography variant="body2" fontFamily="monospace">ads_management</Typography>
              <Iconify icon="solar:close-circle-bold" sx={{ color: 'error.main' }} />
            </Box>
          </Stack>
        )}

        {/* Tab: Logs */}
        {tab === 3 && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Hora</TableCell>
                <TableCell>Endpoint</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {LOGS.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{log.time}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{log.endpoint}</TableCell>
                  <TableCell>
                    <Chip size="small" label={log.status} color={log.status === 200 ? 'success' : 'error'} variant="soft" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button color="error" size="small">Desconectar API</Button>
        <Button variant="contained" color="primary" size="small">Salvar Alterações</Button>
      </Box>
    </Drawer>
  );
}

// ----------------------------------------------------------------------
// Main View

export function AnalyticsSocialApiView() {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedApi, setSelectedApi] = useState<ApiType | null>(null);

  const openDrawer = (api: ApiType) => {
    setSelectedApi(api);
    setDrawerOpen(true);
  };

  const STATS = [
    { label: 'APIs Conectadas', value: '12', icon: 'solar:link-bold-duotone', color: theme.palette.primary.main },
    { label: 'Webhooks Ativos', value: '48', icon: 'solar:bolt-bold-duotone', color: theme.palette.success.main },
    { label: 'Automações', value: '156', icon: 'solar:refresh-bold-duotone', color: theme.palette.info.main },
    { label: 'Erros (24h)', value: '3', icon: 'solar:danger-bold-duotone', color: theme.palette.error.main },
    { label: 'Cota Global Usada', value: '64%', icon: 'solar:pie-chart-bold-duotone', color: theme.palette.warning.main },
    { label: 'Último Sync', value: '2m', icon: 'solar:clock-circle-bold-duotone', color: theme.palette.text.secondary },
  ];

  return (
    <DashboardContent maxWidth="xl">

      {/* Page Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08) }}>
            <Iconify icon={"solar:global-bold-duotone" as any} width={28} sx={{ color: 'primary.main' }} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h5" fontWeight={700}>Social Hub — API</Typography>
              <Chip label="Enterprise" size="small" variant="soft" color="default" sx={{ fontSize: 10, fontWeight: 700, letterSpacing: 1 }} />
            </Box>
            <Typography variant="body2" color="text.secondary" mt={0.3}>
              Gerencie conexões, webhooks e configurações técnicas das APIs sociais.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Chip
            icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />}
            label="Sistema Operacional"
            size="small"
            variant="soft"
            color="success"
          />
          <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />} sx={{ borderRadius: 1.5 }}>
            Conectar API
          </Button>
        </Box>
      </Box>

      {/* Global Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2, mb: 4 }}>
        {STATS.map((stat) => (
          <Card key={stat.label} sx={{ p: 2.5, borderRadius: 2, '&:hover': { boxShadow: (t) => t.customShadows?.z8 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>{stat.label}</Typography>
              <Iconify icon={stat.icon as any} width={20} sx={{ color: stat.color, opacity: 0.8 }} />
            </Box>
            <Typography variant="h4" fontWeight={700}>{stat.value}</Typography>
          </Card>
        ))}
      </Box>

      {/* API Cards Grid */}
      <Typography variant="overline" color="text.secondary" sx={{ mb: 2, display: 'block' }}>Conexões Ativas</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2.5, mb: 4 }}>
        {SOCIAL_APIS.map((api) => (
          <Card key={api.id} sx={{ p: 2.5, borderRadius: 2, position: 'relative', overflow: 'hidden', '&:hover': { boxShadow: (t) => t.customShadows?.z16 } }}>
            {/* Brand glow */}
            <Box sx={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', bgcolor: alpha(api.color, 0.06), filter: 'blur(30px)', pointerEvents: 'none' }} />

            {/* Card Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: alpha(api.color, 0.1), border: `1px solid ${alpha(api.color, 0.25)}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Iconify icon={"solar:global-bold-duotone" as any} width={20} sx={{ color: api.color }} />
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={700} lineHeight={1.2}>{api.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{api.provider}</Typography>
                </Box>
              </Box>
              <Chip size="small" label={STATUS_CONFIG[api.status]?.label} color={STATUS_CONFIG[api.status]?.color} variant="soft" />
            </Box>

            {/* Info block */}
            <Box sx={{ p: 1.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.04), mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">Conta</Typography>
                <Typography variant="caption" fontWeight={600}>{api.account}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="caption" color="text.secondary">API Version</Typography>
                <Chip label={api.version} size="small" variant="outlined" sx={{ height: 18, fontSize: 10, fontFamily: 'monospace' }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">Cota</Typography>
                  <Typography variant="caption" fontWeight={600}>{api.quota}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={api.quota} color={api.quota > 90 ? 'error' : api.quota > 70 ? 'warning' : 'success'} sx={{ height: 5, borderRadius: 1 }} />
              </Box>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button fullWidth variant="soft" color="inherit" size="small" onClick={() => openDrawer(api)} sx={{ borderRadius: 1 }}>
                Gerenciar
              </Button>
              <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }} title="Testar Conexão">
                <Iconify icon={"solar:bolt-bold-duotone" as any} width={16} />
              </IconButton>
              <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }} title="Configurações">
                <Iconify icon={"solar:settings-bold-duotone" as any} width={16} />
              </IconButton>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Bottom: Logs + Activity */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>

        {/* Live Logs */}
        <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Iconify icon={"solar:terminal-bold-duotone" as any} width={20} sx={{ color: 'text.secondary' }} />
              <Typography variant="subtitle2" fontWeight={700}>Live API Logs</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label="Todos" size="small" variant="soft" color="default" clickable />
              <Chip label="Erros" size="small" variant="outlined" clickable />
            </Box>
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Evento</TableCell>
                <TableCell>Endpoint</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Latência</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {LOGS.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' }}>{log.time}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{log.event}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 11, color: 'text.secondary', maxWidth: 200 }}>{log.endpoint}</TableCell>
                  <TableCell>
                    <Chip label={log.status} size="small" color={log.status === 200 ? 'success' : 'error'} variant="soft" />
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>{log.latency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ px: 3, py: 1.5, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
            <Button size="small" color="inherit" endIcon={<Iconify icon="eva:arrow-forward-fill" />}>Ver todos os logs</Button>
          </Box>
        </Card>

        {/* Activity Timeline */}
        <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Iconify icon={"solar:pulse-2-bold-duotone" as any} width={20} sx={{ color: 'text.secondary' }} />
            <Typography variant="subtitle2" fontWeight={700}>Atividade do Sistema</Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            {ACTIVITY.map((item, i) => (
              <Box key={i} sx={{ position: 'relative', pl: 3.5, pb: i < ACTIVITY.length - 1 ? 3 : 0 }}>
                {i < ACTIVITY.length - 1 && (
                  <Box sx={{ position: 'absolute', left: 8, top: 18, bottom: -12, width: 1, bgcolor: 'divider' }} />
                )}
                <Box sx={{ position: 'absolute', left: 0, top: 4, width: 18, height: 18, borderRadius: '50%', bgcolor: ACTIVITY_COLORS[item.type], boxShadow: `0 0 0 3px ${alpha(ACTIVITY_COLORS[item.type], 0.2)}` }} />
                <Typography variant="body2" lineHeight={1.4}>{item.text}</Typography>
                <Typography variant="caption" color="text.secondary" mt={0.5} display="block">{item.time}</Typography>
              </Box>
            ))}
          </Box>
        </Card>
      </Box>

      {/* Detail Drawer */}
      <ApiDetailDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} api={selectedApi} />
    </DashboardContent>
  );
}
