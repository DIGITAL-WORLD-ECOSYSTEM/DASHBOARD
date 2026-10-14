import type { CardProps } from '@mui/material/Card';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import { alpha, useTheme } from '@mui/material/styles';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export interface LiquidityPoolItem {
  id: string;
  pair: string;
  dexName: string;
  network: string;
  feeTier: string;
  contractAddress: string;
  tvlUsd: number;
  volume24hUsd: number;
  tokenRatio: number;
  priceUsd: number;
  aprPercent: number;
  status: 'ACTIVE' | 'HIGH_VOLUME' | 'STABLE';
}

export const MOCK_LIQUIDITY_POOLS: LiquidityPoolItem[] = [
  {
    id: 'POOL-001',
    pair: 'ASPPBR / USDT',
    dexName: 'Uniswap v3',
    network: 'Arbitrum One',
    feeTier: '0.30%',
    contractAddress: '0x7a25C0...19f0',
    tvlUsd: 1850000,
    volume24hUsd: 148250,
    tokenRatio: 50,
    priceUsd: 0.6355,
    aprPercent: 28.4,
    status: 'ACTIVE',
  },
  {
    id: 'POOL-002',
    pair: 'ASPPBR / WETH',
    dexName: 'Camelot DEX',
    network: 'Arbitrum One',
    feeTier: '0.25%',
    contractAddress: '0xc391A4...44a8',
    tvlUsd: 920000,
    volume24hUsd: 94100,
    tokenRatio: 48,
    priceUsd: 0.6355,
    aprPercent: 34.2,
    status: 'HIGH_VOLUME',
  },
  {
    id: 'POOL-003',
    pair: 'ASPPBR / BRL',
    dexName: 'Gateway P2P / Safe Vault',
    network: 'Arbitrum One',
    feeTier: '0.05%',
    contractAddress: '0x33e891...fa22',
    tvlUsd: 445454,
    volume24hUsd: 62500,
    tokenRatio: 52,
    priceUsd: 0.6355,
    aprPercent: 18.5,
    status: 'STABLE',
  },
];

export interface LiquidityPoolsCardProps extends CardProps {
  pools?: LiquidityPoolItem[];
  onTrade?: (pool: LiquidityPoolItem, side: 'BUY' | 'SELL') => void;
}

export function LiquidityPoolsCard({
  pools = MOCK_LIQUIDITY_POOLS,
  onTrade,
  sx,
  ...other
}: LiquidityPoolsCardProps) {
  const theme = useTheme();
  const [selectedPool, setSelectedPool] = useState<LiquidityPoolItem | null>(null);
  const [tradeSide, setTradeSide] = useState<'BUY' | 'SELL'>('BUY');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tradeFeedback, setTradeFeedback] = useState<string | null>(null);

  const handleOpenTrade = (pool: LiquidityPoolItem, side: 'BUY' | 'SELL') => {
    setSelectedPool(pool);
    setTradeSide(side);
    setTradeFeedback(null);
    setIsModalOpen(true);
    if (onTrade) {
      onTrade(pool, side);
    }
  };

  const handleExecuteTrade = () => {
    if (!selectedPool) return;
    const actionLabel = tradeSide === 'BUY' ? 'Compra' : 'Venda';
    setTradeFeedback(
      `Ordem simulada de ${actionLabel} para o par ${selectedPool.pair} processada com sucesso no sandbox local (sem impacto on-chain).`
    );
  };

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
            Pools de Liquidez ASPPBR ({pools.length})
          </Typography>
          <Chip
            label="Arbitrum One"
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.65rem', height: 20 }}
          />
        </Stack>

        <Chip
          label="DEX Ativa"
          size="small"
          color="success"
          variant="soft"
          sx={{ fontWeight: 700, fontSize: '0.68rem', height: 20 }}
        />
      </Stack>

      {/* Lista de Pools com Layout Clean */}
      <Stack spacing={1.5}>
        {pools.map((p) => (
            <Box
              key={p.id}
              sx={{
                p: 1.75,
                bgcolor: (t) => alpha(t.palette.grey[500], 0.04),
                border: (t) => `1px solid ${t.palette.divider}`,
                borderRadius: 1.5,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: (t) => alpha(t.palette.primary.main, 0.4),
                  bgcolor: (t) => alpha(t.palette.grey[500], 0.06),
                },
              }}
            >
              {/* Top Row: Identificador, Par e Botões Buy/Sell */}
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 1,
                  gap: 1.5,
                }}
              >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                    <Chip
                      label={p.id}
                      size="small"
                      variant="soft"
                      color="info"
                      sx={{
                        height: 20,
                        fontSize: '0.68rem',
                        fontWeight: 800,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 800,
                        color: 'text.primary',
                        letterSpacing: '-0.2px',
                      }}
                    >
                      {p.pair}
                    </Typography>
                    <Chip
                      label={p.dexName}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 18,
                        fontSize: '0.62rem',
                        fontWeight: 600,
                        color: 'text.secondary',
                      }}
                    />
                  </Stack>

                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                    Taxa: {p.feeTier} • Contrato: <code>{p.contractAddress}</code> • APR: <Box component="span" sx={{ color: 'success.main', fontWeight: 700 }}>{p.aprPercent}%</Box>
                  </Typography>
                </Box>

                {/* Botões Oficiais: Buy e Sell */}
                <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', flexShrink: 0 }}>
                  <Tooltip title={`Comprar token ASPPBR na pool ${p.pair}`} arrow>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => handleOpenTrade(p, 'BUY')}
                      startIcon={<Iconify icon={'solar:card-recive-bold' as any} width={13} />}
                      sx={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'none',
                        py: 0.35,
                        px: 1.25,
                        whiteSpace: 'nowrap',
                        minWidth: 68,
                        boxShadow: (t) => `0 2px 6px ${alpha(t.palette.success.main, 0.25)}`,
                      }}
                    >
                      Buy
                    </Button>
                  </Tooltip>

                  <Tooltip title={`Vender token ASPPBR na pool ${p.pair}`} arrow>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleOpenTrade(p, 'SELL')}
                      startIcon={<Iconify icon={'solar:card-send-bold' as any} width={13} />}
                      sx={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'none',
                        py: 0.35,
                        px: 1.25,
                        whiteSpace: 'nowrap',
                        minWidth: 68,
                        borderColor: (t) => alpha(t.palette.error.main, 0.45),
                        '&:hover': {
                          borderColor: 'error.main',
                          bgcolor: (t) => alpha(t.palette.error.main, 0.08),
                        },
                      }}
                    >
                      Sell
                    </Button>
                  </Tooltip>
                </Stack>
              </Stack>

              {/* Bottom Row: TVL, Volume e Barra de Profundidade */}
              <Stack spacing={0.5} sx={{ mt: 1.25 }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    TVL: ${p.tvlUsd.toLocaleString('en-US')} USD • Vol 24h: ${p.volume24hUsd.toLocaleString('en-US')} USD
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: '#00A76F', fontWeight: 800, fontFamily: 'monospace' }}
                  >
                    1 ASPPBR = ${p.priceUsd.toFixed(4)} USD
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={p.tokenRatio}
                  sx={{
                    height: 5,
                    borderRadius: 1,
                    bgcolor: (t) => alpha(t.palette.grey[500], 0.16),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 1,
                      bgcolor: '#00A76F',
                    },
                  }}
                />
              </Stack>
            </Box>
          ))}
      </Stack>

      {/* Modal de Simulação de Ordem (Buy / Sell) */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: (t) => `1px solid ${t.palette.divider}`, pb: 1.75 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: tradeSide === 'BUY' ? alpha(theme.palette.success.main, 0.14) : alpha(theme.palette.error.main, 0.14),
                color: tradeSide === 'BUY' ? 'success.main' : 'error.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify
                icon={(tradeSide === 'BUY' ? 'solar:card-recive-bold' : 'solar:card-send-bold') as any}
                width={16}
              />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Ordem de {tradeSide === 'BUY' ? 'Compra (Buy)' : 'Venda (Sell)'}
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}>
            Simulador de Liquidez DEX • Sandbox In-Memory
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ py: 2.5 }}>
          {selectedPool && (
            <Stack spacing={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1.25,
                  bgcolor: (t) => alpha(t.palette.grey[500], 0.05),
                  border: (t) => `1px solid ${t.palette.divider}`,
                }}
              >
                <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Pool Selecionada:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>{selectedPool.pair} ({selectedPool.dexName})</Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Cotação de Referência:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'success.main', fontFamily: 'monospace' }}>
                    ${selectedPool.priceUsd.toFixed(4)} USD
                  </Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Impacto Estimado (Slippage):</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'info.main' }}>&lt; 0.01%</Typography>
                </Stack>
              </Box>

              {tradeFeedback && (
                <Alert severity="success" sx={{ fontSize: '0.78rem' }}>
                  {tradeFeedback}
                </Alert>
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: (t) => `1px solid ${t.palette.divider}` }}>
          <Button
            onClick={() => setIsModalOpen(false)}
            sx={{ color: 'text.secondary', textTransform: 'none' }}
          >
            Fechar
          </Button>
          <Button
            variant="contained"
            color={tradeSide === 'BUY' ? 'success' : 'error'}
            onClick={handleExecuteTrade}
            sx={{ fontWeight: 800, textTransform: 'none' }}
          >
            Simular {tradeSide === 'BUY' ? 'Compra' : 'Venda'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
