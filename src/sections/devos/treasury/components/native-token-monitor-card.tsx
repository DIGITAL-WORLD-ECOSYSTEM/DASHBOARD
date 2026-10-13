import type { CardProps } from '@mui/material/Card';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';

import { TradingViewTokenChart } from './tradingview-token-chart';

// ----------------------------------------------------------------------

export type TimeframePeriod = '24H' | '7D' | '30D' | '1A';

export type ChartMetricMode = 'price' | 'volume';

export type ChartEngineMode = 'tradingview' | 'area';

interface TimeframeData {
  categories: string[];
  prices: number[];
  volumes: number[];
  changePercent: number;
  highPrice: number;
  lowPrice: number;
  periodVolumeUsd: number;
}

export const TOKEN_TIMEFRAME_DATA: Record<TimeframePeriod, TimeframeData> = {
  '24H': {
    categories: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', 'Agora'],
    prices: [0.612, 0.62, 0.615, 0.628, 0.631, 0.629, 0.638, 0.642, 0.6355],
    volumes: [12400, 15800, 9200, 24100, 18900, 14200, 26800, 19500, 7350],
    changePercent: 3.84,
    highPrice: 0.642,
    lowPrice: 0.612,
    periodVolumeUsd: 148250,
  },
  '7D': {
    categories: ['07 Out', '08 Out', '09 Out', '10 Out', '11 Out', '12 Out', '13 Out'],
    prices: [0.585, 0.595, 0.61, 0.605, 0.62, 0.63, 0.6355],
    volumes: [85000, 112000, 98000, 145000, 162000, 148000, 142100],
    changePercent: 8.63,
    highPrice: 0.6355,
    lowPrice: 0.585,
    periodVolumeUsd: 892100,
  },
  '30D': {
    categories: ['14 Set', '19 Set', '24 Set', '29 Set', '04 Out', '09 Out', '13 Out'],
    prices: [0.54, 0.56, 0.55, 0.58, 0.605, 0.625, 0.6355],
    volumes: [380000, 420000, 510000, 490000, 580000, 520000, 520000],
    changePercent: 17.69,
    highPrice: 0.6355,
    lowPrice: 0.54,
    periodVolumeUsd: 3420000,
  },
  '1A': {
    categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'],
    prices: [0.145, 0.28, 0.35, 0.42, 0.49, 0.52, 1.05, 0.59, 0.61, 0.6355],
    volumes: [1200000, 1450000, 2100000, 2800000, 3100000, 3600000, 4100000, 4300000, 4850000, 5000000],
    changePercent: 338.28,
    highPrice: 1.05,
    lowPrice: 0.145,
    periodVolumeUsd: 32500000,
  },
};

const USD_TO_BRL_RATE = 5.5;
const TOTAL_TOKEN_SUPPLY = 10000000;
const VAULT_RESERVE_SUPPLY = 1000000;
const STAKED_SUPPLY = 3450000;

export function NativeTokenMonitorCard({ sx, ...other }: CardProps) {
  const theme = useTheme();
  const [period, setPeriod] = useState<TimeframePeriod>('24H');
  const [metricMode, setMetricMode] = useState<ChartMetricMode>('price');
  const [chartEngine, setChartEngine] = useState<ChartEngineMode>('tradingview');

  const currentData = TOKEN_TIMEFRAME_DATA[period];
  const activePrice = currentData.prices[currentData.prices.length - 1];
  const activePriceBrl = activePrice * USD_TO_BRL_RATE;

  const marketCapUsd = TOTAL_TOKEN_SUPPLY * activePrice;
  const vaultReserveUsd = VAULT_RESERVE_SUPPLY * activePrice;

  const chartSeries = useMemo(() => {
    if (metricMode === 'price') {
      return [
        {
          name: 'Cotação ASPPBR (USD)',
          data: currentData.prices,
        },
      ];
    }
    return [
      {
        name: 'Volume de Negociação (USD)',
        data: currentData.volumes,
      },
    ];
  }, [metricMode, currentData]);

  const chartColor = metricMode === 'price' ? '#00A76F' : '#0284C7';

  const chartOptions = useChart({
    colors: [chartColor],
    chart: {
      sparkline: { enabled: false },
      toolbar: { show: false },
    },
    stroke: {
      width: 2.5,
      curve: 'smooth',
    },
    fill: {
      type: 'gradient',
      gradient: {
        type: 'vertical',
        shadeIntensity: 0,
        opacityFrom: 0.45,
        opacityTo: 0.02,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: currentData.categories,
      labels: {
        style: {
          fontSize: '11px',
          fontWeight: 600,
          colors: theme.palette.text.secondary,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => {
          if (metricMode === 'price') {
            return `$${val.toFixed(val < 1 ? 3 : 2)}`;
          }
          if (val >= 1000000) {
            return `$${(val / 1000000).toFixed(1)}M`;
          }
          if (val >= 1000) {
            return `$${(val / 1000).toFixed(0)}k`;
          }
          return `$${val.toFixed(0)}`;
        },
        style: {
          fontSize: '11px',
          fontWeight: 600,
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => {
          if (metricMode === 'price') {
            return `$${val.toFixed(4)} USD (≈ R$ ${(val * USD_TO_BRL_RATE).toFixed(2)})`;
          }
          return `$${val.toLocaleString('en-US')} USD`;
        },
      },
    },
    grid: {
      strokeDashArray: 3,
      borderColor: theme.palette.divider,
    },
  });

  return (
    <Card
      sx={{
        p: 2,
        bgcolor: 'background.paper',
        border: (t) => `1px solid ${t.palette.divider}`,
        borderRadius: 2,
        ...sx,
      }}
      {...other}
    >
      {/* 1. CABEÇALHO COMPACTO E ELEGANTE DO TOKEN */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          mb: 1.5,
        }}
      >
        {/* Identidade e Cotação Instantânea */}
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: (t) => alpha('#00A76F', 0.12),
              border: '1.5px solid #00A76F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00A76F',
              flexShrink: 0,
            }}
          >
            <Iconify icon={'solar:shield-star-bold' as any} width={20} />
          </Box>

          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.2px' }}>
                ASPPIBRA (ASPPBR)
              </Typography>
              <Chip
                label="Arbitrum One"
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: '0.68rem', height: 20 }}
              />
              <Chip
                label="Governança"
                size="small"
                color="success"
                variant="soft"
                sx={{ fontWeight: 700, fontSize: '0.68rem', height: 20 }}
              />
            </Stack>
          </Box>

          {/* Badge de Preço Atual Rápido */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 0.75,
              ml: { xs: 0, sm: 1 },
              px: 1.25,
              py: 0.35,
              borderRadius: 1,
              bgcolor: (t) => alpha(t.palette.grey[500], 0.06),
              border: (t) => `1px solid ${alpha(t.palette.divider, 0.6)}`,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#00A76F', fontFamily: 'monospace' }}>
              ${activePrice.toFixed(4)} USD
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontFamily: 'monospace' }}>
              ≈ R$ {activePriceBrl.toFixed(2)}
            </Typography>
            <Chip
              label="+3.84%"
              size="small"
              color="success"
              variant="soft"
              sx={{ fontWeight: 800, fontSize: '0.68rem', height: 18 }}
            />
          </Box>
        </Stack>

        {/* Alternador de Motor Gráfico */}
        <Box
          sx={{
            display: 'inline-flex',
            p: 0.35,
            borderRadius: 1,
            bgcolor: (t) => alpha(t.palette.grey[500], 0.08),
            alignSelf: { xs: 'stretch', sm: 'auto' },
            justifyContent: 'center',
          }}
        >
          <Button
            size="small"
            onClick={() => setChartEngine('tradingview')}
            variant={chartEngine === 'tradingview' ? 'contained' : 'text'}
            color={chartEngine === 'tradingview' ? 'primary' : 'inherit'}
            sx={{
              py: 0.25,
              px: 1.25,
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'none',
              boxShadow: chartEngine === 'tradingview' ? 1 : 0,
            }}
            startIcon={<Iconify icon={'solar:chart-square-bold' as any} width={14} />}
          >
            TradingView
          </Button>

          <Button
            size="small"
            onClick={() => setChartEngine('area')}
            variant={chartEngine === 'area' ? 'contained' : 'text'}
            color={chartEngine === 'area' ? 'inherit' : 'inherit'}
            sx={{
              py: 0.25,
              px: 1.25,
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'none',
              bgcolor: chartEngine === 'area' ? 'background.paper' : 'transparent',
              boxShadow: chartEngine === 'area' ? 1 : 0,
            }}
            startIcon={<Iconify icon={'solar:chart-2-bold' as any} width={14} />}
          >
            Visão Área
          </Button>
        </Box>
      </Stack>

      {/* 2. ÁREA CENTRAL DO GRÁFICO (TRADINGVIEW STATION OU ÁREA) */}
      <Box sx={{ mb: 1.5 }}>
        {chartEngine === 'tradingview' ? (
          <TradingViewTokenChart chartHeight={360} />
        ) : (
          <Box>
            <Stack direction="row" spacing={1} sx={{ mb: 1, justifyContent: 'space-between', alignItems: 'center' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 0.35,
                  borderRadius: 1,
                  bgcolor: (t) => alpha(t.palette.grey[500], 0.08),
                }}
              >
                {(['24H', '7D', '30D', '1A'] as TimeframePeriod[]).map((t) => (
                  <Button
                    key={t}
                    size="small"
                    onClick={() => setPeriod(t)}
                    variant={period === t ? 'contained' : 'text'}
                    color={period === t ? 'inherit' : 'inherit'}
                    sx={{
                      minWidth: 34,
                      py: 0.2,
                      px: 0.75,
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      textTransform: 'none',
                      bgcolor: period === t ? 'background.paper' : 'transparent',
                      color: period === t ? 'text.primary' : 'text.secondary',
                      boxShadow: period === t ? 1 : 0,
                    }}
                  >
                    {t}
                  </Button>
                ))}
              </Box>

              <Box
                sx={{
                  display: 'inline-flex',
                  p: 0.35,
                  borderRadius: 1,
                  bgcolor: (t) => alpha(t.palette.grey[500], 0.08),
                }}
              >
                <Button
                  size="small"
                  onClick={() => setMetricMode('price')}
                  variant={metricMode === 'price' ? 'contained' : 'text'}
                  color={metricMode === 'price' ? 'primary' : 'inherit'}
                  sx={{ py: 0.2, px: 0.75, fontSize: '0.68rem', fontWeight: 700 }}
                >
                  Cotação
                </Button>
                <Button
                  size="small"
                  onClick={() => setMetricMode('volume')}
                  variant={metricMode === 'volume' ? 'contained' : 'text'}
                  color={metricMode === 'volume' ? 'info' : 'inherit'}
                  sx={{ py: 0.2, px: 0.75, fontSize: '0.68rem', fontWeight: 700 }}
                >
                  Volume
                </Button>
              </Box>
            </Stack>

            <Chart
              type="area"
              series={chartSeries}
              options={chartOptions}
              sx={{ height: 260 }}
              slotProps={{ loading: { p: 2.5 } }}
            />
          </Box>
        )}
      </Box>

      {/* 3. KPIS DE ECOSSISTEMA E CUSTÓDIA DO TOKEN (SLIM & EQUAL-HEIGHT) */}
      <Grid container spacing={1.25}>
        {/* KPI 1: Market Cap (FDV) */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box
            sx={{
              p: 1.25,
              borderRadius: 1.25,
              bgcolor: (t) => alpha(t.palette.grey[500], 0.04),
              border: (t) => `1px solid ${t.palette.divider}`,
              height: '100%',
            }}
          >
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 0.25 }}>
              <Iconify icon={'solar:dollar-minimalistic-bold' as any} width={15} sx={{ color: 'success.main' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.72rem' }}>
                Valor Total (FDV)
              </Typography>
            </Stack>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'text.primary' }}>
              ${marketCapUsd.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} USD
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', fontSize: '0.65rem' }}>
              Supply Total: {TOTAL_TOKEN_SUPPLY.toLocaleString('en-US')} ASPPBR
            </Typography>
          </Box>
        </Grid>

        {/* KPI 2: Reserva no Cofre Safe */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box
            sx={{
              p: 1.25,
              borderRadius: 1.25,
              bgcolor: (t) => alpha(t.palette.grey[500], 0.04),
              border: (t) => `1px solid ${t.palette.divider}`,
              height: '100%',
            }}
          >
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 0.25 }}>
              <Iconify icon={'solar:shield-check-bold' as any} width={15} sx={{ color: '#00A76F' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.72rem' }}>
                Custódia no Cofre Safe
              </Typography>
            </Stack>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#00A76F' }}>
              {VAULT_RESERVE_SUPPLY.toLocaleString('en-US')} ASPPBR
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', fontSize: '0.65rem' }}>
              ≈ ${vaultReserveUsd.toLocaleString('en-US')} USD (10.0% da Reserva)
            </Typography>
          </Box>
        </Grid>

        {/* KPI 3: Volume 24 Horas */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box
            sx={{
              p: 1.25,
              borderRadius: 1.25,
              bgcolor: (t) => alpha(t.palette.grey[500], 0.04),
              border: (t) => `1px solid ${t.palette.divider}`,
              height: '100%',
            }}
          >
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 0.25 }}>
              <Iconify icon={'solar:refresh-circle-bold' as any} width={15} sx={{ color: 'info.main' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.72rem' }}>
                Volume 24 Horas
              </Typography>
            </Stack>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'text.primary' }}>
              ${TOKEN_TIMEFRAME_DATA['24H'].periodVolumeUsd.toLocaleString('en-US')} USD
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', fontSize: '0.65rem' }}>
              ≈ R$ {(TOKEN_TIMEFRAME_DATA['24H'].periodVolumeUsd * USD_TO_BRL_RATE).toLocaleString('pt-BR')} BRL
            </Typography>
          </Box>
        </Grid>

        {/* KPI 4: Staking & Bloqueado */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box
            sx={{
              p: 1.25,
              borderRadius: 1.25,
              bgcolor: (t) => alpha(t.palette.grey[500], 0.04),
              border: (t) => `1px solid ${t.palette.divider}`,
              height: '100%',
            }}
          >
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 0.25 }}>
              <Iconify icon={'solar:lock-keyhole-bold' as any} width={15} sx={{ color: 'warning.main' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.72rem' }}>
                Staking & Governança
              </Typography>
            </Stack>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'text.primary' }}>
              {STAKED_SUPPLY.toLocaleString('en-US')} ASPPBR
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', fontSize: '0.65rem' }}>
              34.5% da oferta circulante ativa
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}
