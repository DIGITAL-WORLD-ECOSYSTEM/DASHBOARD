import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { OrderListView } from 'src/sections/order/view';
import { ProductListView } from 'src/sections/product/view';
import { OverviewEcommerceView } from 'src/sections/overview/e-commerce/view';

// ----------------------------------------------------------------------

export function EcommerceHubView() {
  const [currentTab, setCurrentTab] = useState<'overview' | 'products' | 'orders'>('overview');

  return (
    <Stack spacing={2.5}>
      {/* 1. CABEÇALHO */}
      <Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Central de E-commerce & Vendas
          </Typography>
          <Chip
            label="OPERAÇÕES & PEDIDOS"
            size="small"
            color="primary"
            variant="soft"
            sx={{ fontWeight: 800, fontSize: '0.68rem' }}
          />
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Gestão integrada de vendas, catálogo de produtos, estoque e ordens de compra da organização.
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
            value="overview"
            icon={<Iconify icon={'solar:chart-square-bold' as any} width={20} />}
            iconPosition="start"
            label="Visão Geral de Vendas"
          />
          <Tab
            value="products"
            icon={<Iconify icon={'solar:box-minimalistic-bold' as any} width={20} />}
            iconPosition="start"
            label="Catálogo de Produtos"
          />
          <Tab
            value="orders"
            icon={<Iconify icon={'solar:bag-check-bold' as any} width={20} />}
            iconPosition="start"
            label="Gestão de Pedidos"
          />
        </Tabs>
      </Box>

      {/* 3. CONTEÚDO DINÂMICO */}
      {currentTab === 'overview' && <OverviewEcommerceView />}
      {currentTab === 'products' && <ProductListView />}
      {currentTab === 'orders' && <OrderListView />}
    </Stack>
  );
}
