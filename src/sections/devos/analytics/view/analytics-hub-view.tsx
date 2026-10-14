import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import {
  AnalyticsGlobalView,
  AnalyticsContractView,
  AnalyticsUserMembersView,
} from 'src/sections/overview/analytics/view';

// ----------------------------------------------------------------------

export function AnalyticsHubView() {
  const [currentTab, setCurrentTab] = useState<'global' | 'members' | 'contracts'>('global');

  return (
    <Stack spacing={2.5}>
      {/* 1. CABEÇALHO */}
      <Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Hub de Inteligência & Métricas
          </Typography>
          <Chip
            label="ANALYTICS & MEMBROS"
            size="small"
            color="primary"
            variant="soft"
            sx={{ fontWeight: 800, fontSize: '0.68rem' }}
          />
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Monitoramento consolidado de métricas institucionais, associados ativos e adimplência de contratos da DAO.
        </Typography>
      </Box>

      {/* 2. NAVEGAÇÃO POR ABAS */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              minHeight: 44,
              fontWeight: 700,
              fontSize: '0.85rem',
            },
          }}
        >
          <Tab
            value="global"
            icon={<Iconify icon={'solar:chart-2-bold' as any} width={20} />}
            iconPosition="start"
            label="Visão Global"
          />
          <Tab
            value="members"
            icon={<Iconify icon={'solar:users-group-rounded-bold' as any} width={20} />}
            iconPosition="start"
            label="Membros da DAO"
          />
          <Tab
            value="contracts"
            icon={<Iconify icon={'solar:document-text-bold' as any} width={20} />}
            iconPosition="start"
            label="Contratos & Quitações"
          />
        </Tabs>
      </Box>

      {/* 3. CONTEÚDO DINÂMICO */}
      {currentTab === 'global' && <AnalyticsGlobalView />}
      {currentTab === 'members' && <AnalyticsUserMembersView />}
      {currentTab === 'contracts' && <AnalyticsContractView />}
    </Stack>
  );
}
