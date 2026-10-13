import type { NewIntegrationData } from './create-integration-modal';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { IdentityAvatar } from 'src/auth/components';

import { ApiConfigDrawer } from './api-config-drawer';
import { CreateIntegrationModal } from './create-integration-modal';

// ----------------------------------------------------------------------

const MOCK_INTEGRATIONS = [
  {
    id: 'stripe',
    name: 'Stripe Production',
    provider: 'Stripe',
    category: 'Finance',
    env: 'Production',
    risk: 'NUCLEAR',
    criticality: 'MISSION CRITICAL',
    status: 'Online',
    drift: 'Sincronizado',
    owner: 'Finance Team',
    expiresIn: 130, // dias
    healthPct: 99.98,
    logoUrl: '/assets/icons/brands/ic-stripe.svg', // Assumindo icone local ou fallback
  },
  {
    id: 'openai',
    name: 'OpenAI API',
    provider: 'OpenAI',
    category: 'AI',
    env: 'Production',
    risk: 'HIGH',
    criticality: 'IMPORTANT',
    status: 'Online',
    drift: 'Sincronizado',
    owner: 'AI Lab',
    expiresIn: 45, // dias (Amarelo)
    healthPct: 99.5,
    logoUrl: '/assets/icons/brands/ic-openai.svg',
  },
  {
    id: 'binance',
    name: 'Binance Master Account',
    provider: 'Binance',
    category: 'Web3',
    env: 'Production',
    risk: 'CRITICAL',
    criticality: 'MISSION CRITICAL',
    status: 'Failing',
    drift: 'Divergente',
    owner: 'Core Team',
    expiresIn: 3, // dias (Vermelho/Alerta)
    healthPct: 82.0,
    logoUrl: '/assets/icons/brands/ic-binance.svg',
  },
];

export function ApisView() {
  const [currentTab, setCurrentTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [integrations, setIntegrations] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('devos_vault_integrations_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.warn('Falha ao carregar integrações do LocalStorage:', err);
    }
    return MOCK_INTEGRATIONS;
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);

  const handleAddIntegration = (newIntegration: NewIntegrationData) => {
    setIntegrations((prev) => {
      const updated = [newIntegration, ...prev];
      try {
        localStorage.setItem('devos_vault_integrations_v1', JSON.stringify(updated));
      } catch (err) {
        console.warn('Falha ao salvar integração no LocalStorage:', err);
      }
      return updated;
    });
    // Automaticamente seleciona a aba da nova integracao (ex: Web3) para exibir no grid
    setCurrentTab(newIntegration.category);
  };

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesTab = currentTab === 'All' || integration.category === currentTab;
    const searchLower = searchQuery.toLowerCase();

    // Suporte para busca simples ou pseudo-sintaxe (e.g., "risk:critical")
    const matchesSearch =
      integration.name.toLowerCase().includes(searchLower) ||
      integration.provider.toLowerCase().includes(searchLower) ||
      integration.owner.toLowerCase().includes(searchLower) ||
      (searchLower.includes('risk:') &&
        integration.risk.toLowerCase().includes(searchLower.replace('risk:', '').trim()));

    return matchesTab && matchesSearch;
  });

  const handleOpenDrawer = (integration: any) => {
    setSelectedIntegration(integration);
    setDrawerOpen(true);
  };

  const renderHero = (
    <Card
      sx={{
        p: 3,
        mb: 3,
        background:
          'linear-gradient(135deg, rgba(34, 193, 195, 0.1) 0%, rgba(253, 187, 45, 0.1) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={{ xs: 2.5, lg: 3 }}
        sx={{ alignItems: { xs: 'stretch', lg: 'center' }, justifyContent: 'space-between' }}
      >
        {/* Security Score */}
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexShrink: 0 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <IdentityAvatar
              sx={{
                width: { xs: 64, md: 76 },
                height: { xs: 64, md: 76 },
                bgcolor: 'success.main',
                color: 'common.white',
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
            >
              96
            </IdentityAvatar>
          </Box>
          <Stack spacing={0.5}>
            <Typography variant="h6">Security Risk Score</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Cofre Criptográfico V8 Operacional
            </Typography>
          </Stack>
        </Stack>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderStyle: 'dashed', display: { xs: 'none', lg: 'block' } }}
        />

        {/* Secrets Lifecycle Center */}
        <Stack spacing={1} sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            SECRETS LIFECYCLE CENTER
          </Typography>
          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  mb: 0.5,
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                  17 Saudáveis
                </Typography>
                <Typography variant="body2" color="warning.main">
                  8 Rotação Prox.
                </Typography>
                <Typography variant="body2" color="error.main">
                  2 Expiradas
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={70}
                color="success"
                sx={{ height: 8, borderRadius: 1 }}
              />
            </Box>
          </Stack>
        </Stack>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderStyle: 'dashed', display: { xs: 'none', lg: 'block' } }}
        />

        {/* Últimas Alterações */}
        <Stack spacing={1} sx={{ minWidth: { xs: 'auto', lg: 200 }, flexShrink: 0 }}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            ÚLTIMAS ALTERAÇÕES
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box
              sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'info.main', flexShrink: 0 }}
            />
            <Typography variant="caption" noWrap>
              Hoje: OpenAI rotacionada
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: 'text.disabled',
                flexShrink: 0,
              }}
            />
            <Typography variant="caption" noWrap sx={{ color: 'text.secondary' }}>
              Ontem: Stripe Sandbox
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );

  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', lg: 'row' }}
      sx={{
        alignItems: { xs: 'stretch', lg: 'center' },
        justifyContent: 'space-between',
        mb: 3,
        minWidth: 0,
      }}
    >
      <Tabs
        value={currentTab}
        onChange={(e, val) => setCurrentTab(val)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          bgcolor: 'background.paper',
          px: 1,
          borderRadius: 1.5,
          boxShadow: (theme) => theme.customShadows.z1,
          maxWidth: '100%',
          '& .MuiTabs-flexContainer': {
            gap: 0.5,
          },
        }}
      >
        {['All', 'Finance', 'Web3', 'AI', 'Communications', 'OAuth', 'Infra'].map((tab) => (
          <Tab key={tab} value={tab} label={tab} disableRipple />
        ))}
      </Tabs>

      <TextField
        placeholder="Search (e.g. risk:critical env:production)..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ width: { xs: '100%', lg: 320 } }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill' as any} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          },
        }}
      />
    </Stack>
  );

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'NUCLEAR':
        return 'error';
      case 'CRITICAL':
        return 'error';
      case 'HIGH':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getExpirationColor = (days: number) => {
    if (days > 120) return 'success.main';
    if (days > 60) return 'info.main';
    if (days > 15) return 'warning.main';
    return 'error.main';
  };

  const renderGrid = (
    <Box
      sx={{
        gap: 3,
        display: 'grid',
        minWidth: 0,
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
          xl: 'repeat(3, 1fr)',
        },
      }}
    >
      {filteredIntegrations.map((integration) => (
        <Card
          key={integration.id}
          sx={{ p: 3, display: 'flex', flexDirection: 'column', position: 'relative' }}
        >
          {/* Status Pulse */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 'bold',
                color: integration.status === 'Online' ? 'success.main' : 'error.main',
              }}
            >
              {integration.status}
            </Typography>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: integration.status === 'Online' ? 'success.main' : 'error.main',
                animation: integration.status === 'Online' ? 'pulse 2s infinite' : 'none',
              }}
            />
          </Box>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
            <IdentityAvatar variant="rounded" sx={{ width: 48, height: 48, bgcolor: 'background.neutral' }}>
              <Iconify
                icon={'eva:cube-outline' as any}
                width={24}
                sx={{ color: 'text.secondary' }}
              />
            </IdentityAvatar>
            <Stack>
              <Typography variant="subtitle1">{integration.name}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Owner: {integration.owner}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 2 }}>
            <Chip
              size="small"
              label={integration.risk}
              color={getRiskColor(integration.risk) as any}
              variant="soft"
            />
            <Chip size="small" label={integration.criticality} variant="outlined" />
            {integration.drift !== 'Sincronizado' && (
              <Chip
                size="small"
                label={integration.drift}
                color="warning"
                icon={<Iconify icon={'eva:alert-triangle-fill' as any} />}
              />
            )}
          </Stack>

          <Divider sx={{ borderStyle: 'dashed', my: 2 }} />

          <Stack spacing={1.5} sx={{ mb: 3 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Expira em:
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 'bold', color: getExpirationColor(integration.expiresIn) }}
              >
                {integration.expiresIn} dias
              </Typography>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Disponibilidade (30d):
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {integration.healthPct}%
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              sx={{ flexGrow: 1 }}
              startIcon={<Iconify icon={'eva:activity-outline' as any} />}
            >
              Ping
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              sx={{ flexGrow: 2 }}
              onClick={() => handleOpenDrawer(integration)}
            >
              Gerenciar
            </Button>
          </Stack>
        </Card>
      ))}
    </Box>
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', minWidth: 0, p: { xs: 0.5, sm: 1, md: 1.5 } }}>
      <CustomBreadcrumbs
        heading="API & Secrets Vault"
        links={[{ name: 'DevOS', href: paths.devos.root }, { name: 'APIs Vault' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon={'mingcute:add-line' as any} />}
            onClick={() => setCreateModalOpen(true)}
          >
            Nova Integração
          </Button>
        }
      />

      {renderHero}
      {renderFilters}
      {renderGrid}

      <CreateIntegrationModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={handleAddIntegration}
      />

      <ApiConfigDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        integration={selectedIntegration}
      />
    </Box>
  );
}
