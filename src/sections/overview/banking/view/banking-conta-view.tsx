
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { BankingAccountActions } from '../banking-account-actions';
import { BankingAccountSelector } from '../banking-account-selector';
import { BankingAccountIdentity } from '../banking-account-identity';
import { BankingAccountSubledger } from '../banking-account-subledger';

// ----------------------------------------------------------------------

export type BaseCurrency = 'BRL' | 'USD' | 'EUR';
export type AccountStatus = 'Ativa' | 'Verificada' | 'Limitada' | 'Em Revisão' | 'Bloqueada';
export type AccountType = 'brl' | 'global' | 'web3';

export type Balance = {
  id: string;
  asset: string; // USD, BRL, BTC, USDT
  name: string; // Dólar Americano, Bitcoin
  icon: string;
  available: number;
  blocked: number;
  inLiquidation: number;
  fiatValue: number; // in BaseCurrency (BRL)
};

export type AccountData = {
  id: string;
  type: AccountType;
  label: string;
  status: AccountStatus;
  balances: Balance[];
  // BRL specific
  bankName?: string;
  agency?: string;
  accountNumber?: string;
  pixKeys?: { id: string; type: string; value: string }[];
  // Global specific
  iban?: string;
  swift?: string;
  aba?: string;
  // Web3 specific
  web3Addresses?: { id: string; network: string; address: string; icon: string; isFavorite?: boolean }[];
};

const MOCK_ACCOUNTS: AccountData[] = [
  {
    id: 'acc-brl-1',
    type: 'brl',
    label: 'Conta Corrente Local',
    status: 'Verificada',
    bankName: 'Banco ASPPIBRA S.A.',
    agency: '0001',
    accountNumber: '998877-6',
    pixKeys: [
      { id: 'p1', type: 'CPF', value: '123.456.789-00' },
      { id: 'p2', type: 'E-mail', value: 'treasury@asppibra.com' },
    ],
    balances: [
      { id: 'b1', asset: 'BRL', name: 'Real Brasileiro', icon: 'twemoji:flag-brazil', available: 45000, blocked: 0, inLiquidation: 1250, fiatValue: 46250 },
    ],
  },
  {
    id: 'acc-global-1',
    type: 'global',
    label: 'Conta Global (Internacional)',
    status: 'Ativa',
    iban: 'US99 1234 5678 9012 3456 78',
    swift: 'BOFUS33',
    aba: '021000021',
    balances: [
      { id: 'b2', asset: 'USD', name: 'Dólar Americano', icon: 'twemoji:flag-united-states', available: 12000, blocked: 0, inLiquidation: 0, fiatValue: 65640 },
      { id: 'b3', asset: 'EUR', name: 'Euro', icon: 'twemoji:flag-european-union', available: 5400, blocked: 1000, inLiquidation: 0, fiatValue: 38400 },
    ],
  },
  {
    id: 'acc-web3-1',
    type: 'web3',
    label: 'Custódia Digital Web3',
    status: 'Limitada',
    web3Addresses: [
      { id: 'w1', network: 'Ethereum Mainnet', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', icon: 'logos:ethereum', isFavorite: true },
      { id: 'w2', network: 'Polygon', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', icon: 'logos:polygon', isFavorite: false },
      { id: 'w3', network: 'Solana', address: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH', icon: 'logos:solana', isFavorite: false },
    ],
    balances: [
      { id: 'b4', asset: 'USDT', name: 'Tether USD', icon: 'cryptocurrency-color:usdt', available: 8500, blocked: 0, inLiquidation: 0, fiatValue: 46495 },
      { id: 'b5', asset: 'BTC', name: 'Bitcoin', icon: 'cryptocurrency-color:btc', available: 0.15, blocked: 0.05, inLiquidation: 0, fiatValue: 71200 },
    ],
  },
];

// ----------------------------------------------------------------------

export function BankingContaView() {
  const [selectedAccountId, setSelectedAccountId] = useState(MOCK_ACCOUNTS[0].id);
  const [hideBalances, setHideBalances] = useState(false);

  const selectedAccount = MOCK_ACCOUNTS.find((acc) => acc.id === selectedAccountId) || MOCK_ACCOUNTS[0];

  // Calculate Consolidated Patrimonio in BRL
  const totalPatrimonio = MOCK_ACCOUNTS.reduce((acc, account) => acc + account.balances.reduce((sum, bal) => sum + bal.fiatValue, 0), 0);

  const handleExportData = () => {
    // Mock export action
    console.log('Exporting banking data as PDF...');
    alert('Os dados de recebimento foram exportados para PDF.');
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: { xs: 3, md: 5 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4">Saldos & Custódia</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={hideBalances ? "Mostrar Saldos" : "Ocultar Saldos"}>
            <IconButton onClick={() => setHideBalances(!hideBalances)} color="default">
              <Iconify icon={hideBalances ? "solar:eye-closed-bold" : "solar:eye-bold"} />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon={"solar:document-bold" as any} />}
            onClick={handleExportData}
          >
            Exportar Dados
          </Button>
        </Box>
      </Box>

      {/* KPI Global Consolidation */}
      <Card sx={{ mb: 4, p: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Patrimônio Consolidado Global (BRL)
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h3">
              {hideBalances ? 'R$ •••••' : fCurrency(totalPatrimonio)}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Iconify icon={"solar:clock-circle-linear" as any} width={16} />
            Atualizado em: {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        
        {/* Left Column: Selector & Identity */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, gridColumn: { md: 'span 1' } }}>
          <BankingAccountSelector 
            accounts={MOCK_ACCOUNTS} 
            selectedId={selectedAccountId} 
            onChange={(id) => setSelectedAccountId(id)} 
          />
          <BankingAccountIdentity 
            account={selectedAccount} 
            hideSensitive={hideBalances} 
          />
          <BankingAccountActions account={selectedAccount} />
        </Box>

        {/* Right Column: Sub-Ledger */}
        <Box sx={{ gridColumn: { md: 'span 2' } }}>
          <BankingAccountSubledger 
            account={selectedAccount} 
            hideBalances={hideBalances} 
          />
        </Box>

      </Box>
    </DashboardContent>
  );
}
