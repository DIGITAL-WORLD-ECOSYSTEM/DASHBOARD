import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export interface TokenHolderItem {
  id: string;
  label: string;
  address: string;
  balanceTokens: number;
  sharePercent: number;
  category: 'SAFE' | 'STAKING' | 'LIQUIDITY' | 'WHALE' | 'TREASURY';
  categoryLabel: string;
  categoryColor: 'success' | 'info' | 'secondary' | 'warning' | 'primary';
  verified: boolean;
}

export const MOCK_TOKEN_HOLDERS: TokenHolderItem[] = [
  {
    id: 'HOLDER-01',
    label: 'Cofre Safe DAO (Reserva)',
    address: '0x8a12F4...41a0',
    balanceTokens: 1000000,
    sharePercent: 10.0,
    category: 'SAFE',
    categoryLabel: 'CUSTÓDIA SAFE',
    categoryColor: 'success',
    verified: true,
  },
  {
    id: 'HOLDER-02',
    label: 'Contrato de Staking & Governança',
    address: '0x9b54A1...12f8',
    balanceTokens: 3450000,
    sharePercent: 34.5,
    category: 'STAKING',
    categoryLabel: 'STAKING LOCK',
    categoryColor: 'info',
    verified: true,
  },
  {
    id: 'HOLDER-03',
    label: 'Pool de Liquidez Uniswap v3 (USDT)',
    address: '0x7a25C0...19f0',
    balanceTokens: 1450000,
    sharePercent: 14.5,
    category: 'LIQUIDITY',
    categoryLabel: 'LIQUIDEZ DEX',
    categoryColor: 'secondary',
    verified: true,
  },
  {
    id: 'HOLDER-04',
    label: 'Investidor Estratégico (Whale 01)',
    address: '0x11cc90...88d2',
    balanceTokens: 850000,
    sharePercent: 8.5,
    category: 'WHALE',
    categoryLabel: 'CIRCULANTE',
    categoryColor: 'warning',
    verified: false,
  },
  {
    id: 'HOLDER-05',
    label: 'Tesouraria Operacional da DAO',
    address: '0x44ee19...99c4',
    balanceTokens: 500000,
    sharePercent: 5.0,
    category: 'TREASURY',
    categoryLabel: 'OPERACIONAL',
    categoryColor: 'success',
    verified: true,
  },
];

export interface TokenHoldersCardProps extends CardProps {
  holders?: TokenHolderItem[];
}

export function TokenHoldersCard({
  holders = MOCK_TOKEN_HOLDERS,
  sx,
  ...other
}: TokenHoldersCardProps) {
  const topHoldersTotalShare = holders.reduce((acc, curr) => acc + curr.sharePercent, 0);

  return (
    <Card
      sx={{
        p: 2.5,
        bgcolor: 'background.paper',
        border: (t) => `1px solid ${t.palette.divider}`,
        borderRadius: 2,
        height: '100%',
        ...sx,
      }}
      {...other}
    >
      {/* Cabeçalho do Card */}
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Top Holders ASPPBR ({holders.length})
          </Typography>
          <Chip
            label="1.420 Wallets"
            size="small"
            variant="soft"
            color="info"
            sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20 }}
          />
        </Stack>

        <Chip
          label="Arbitrum One"
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, fontSize: '0.68rem', height: 20 }}
        />
      </Stack>

      {/* Lista de Carteiras Monitoradas */}
      <Stack spacing={1.25}>
        {holders.map((holder) => (
          <Box
            key={holder.id}
            sx={{
              p: 1.5,
              bgcolor: (t) => alpha(t.palette.grey[500], 0.04),
              border: (t) => `1px solid ${t.palette.divider}`,
              borderRadius: 1.5,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: (t) => alpha(t.palette.primary.main, 0.35),
                bgcolor: (t) => alpha(t.palette.grey[500], 0.06),
              },
            }}
          >
            {/* Linha Superior: Nome, Badges e Categoria */}
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75 }}>
              <Box sx={{ minWidth: 0, pr: 1 }}>
                <Stack direction="row" spacing={0.6} sx={{ alignItems: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 800,
                      color: 'text.primary',
                      letterSpacing: '-0.2px',
                    }}
                  >
                    {holder.label}
                  </Typography>
                  {holder.verified && (
                    <Tooltip title="Contrato auditado e verificado na Arbitrum" arrow>
                      <Box
                        component="span"
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          color: 'info.main',
                        }}
                      >
                        <Iconify icon={'solar:verified-check-bold' as any} width={14} />
                      </Box>
                    </Tooltip>
                  )}
                </Stack>

                <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace', display: 'block', mt: 0.25 }}>
                  {holder.address}
                </Typography>
              </Box>

              <Chip
                label={holder.categoryLabel}
                size="small"
                variant="soft"
                color={holder.categoryColor}
                sx={{
                  height: 20,
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              />
            </Stack>

            {/* Linha Inferior: Quantidade de Tokens e Porcentagem */}
            <Stack spacing={0.5} sx={{ mt: 1 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 800, fontFamily: 'monospace' }}>
                  {holder.balanceTokens.toLocaleString('en-US')} ASPPBR
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                  {holder.sharePercent.toFixed(1)}% do supply
                </Typography>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={holder.sharePercent * 2} // Escala visual proporcional
                sx={{
                  height: 4,
                  borderRadius: 1,
                  bgcolor: (t) => alpha(t.palette.grey[500], 0.16),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 1,
                    bgcolor: holder.categoryColor === 'success'
                      ? '#00A76F'
                      : holder.categoryColor === 'info'
                        ? '#0284C7'
                        : holder.categoryColor === 'warning'
                          ? '#FFAB00'
                          : '#8E33FF',
                  },
                }}
              />
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* Nota de Auditoria no Rodapé */}
      <Box sx={{ mt: 2, p: 1.25, bgcolor: (t) => alpha(t.palette.grey[500], 0.04), borderRadius: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.68rem', lineHeight: 1.4 }}>
          Top 5 carteiras custodiam <strong>{topHoldersTotalShare.toFixed(1)}%</strong> do supply total (10.000.000 ASPPBR). 100% monitorado em tempo real na Arbitrum One.
        </Typography>
      </Box>
    </Card>
  );
}
