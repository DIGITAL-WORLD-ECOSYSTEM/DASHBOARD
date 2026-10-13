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

// ----------------------------------------------------------------------

export type TimeframePeriod = '24H' | '7D' | '30D' | '1A';

export type ChartMetricMode = 'price' | 'volume';

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
    prices: [0.965, 0.972, 0.968, 0.985, 0.991, 0.988, 1.005, 1.012, 1.000],
    volumes: [12400, 15800, 9200, 24100, 18900, 14200, 26800, 19500, 7350],
    changePercent: 3.62,
    highPrice: 1.012,
    lowPrice: 0.965,
    periodVolumeUsd: 148250,
  },
  '7D': {
    categories: ['07 Out', '08 Out', '09 Out', '10 Out', '11 Out', '12 Out', '13 Out'],
    prices: [0.92, 0.935, 0.948, 0.94, 0.975, 0.99, 1.0],
    volumes: [85000, 112000, 98000, 145000, 162000, 148000, 142100],
    changePercent: 8.69,
    highPrice: 1.0,
    lowPrice: 0.92,
    periodVolumeUsd: 892100,
  },
  '30D': {
    categories: ['14 Set', '19 Set', '24 Set', '29 Set', '04 Out', '09 Out', '13 Out'],
    prices: [0.85, 0.88, 0.865, 0.91, 0.945, 0.98, 1.0],
    volumes: [380000, 420000, 510000, 490000, 580000, 520000, 520000],
    changePercent: 17.65,
    highPrice: 1.0,
    lowPrice: 0.85,
    periodVolumeUsd: 3420000,
  },
  '1A': {
    categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'],
    prices: [0.5, 0.54, 0.61, 0.68, 0.72, 0.79, 0.84, 0.89, 0.95, 1.0],
    volumes: [1200000, 1450000, 2100000, 2800000, 3100000, 3600000, 4100000, 4300000, 4850000, 5000000],
    changePercent: 100.0,
    highPrice: 1.0,
    lowPrice: 0.5,
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

  const currentData = TOKEN_TIMEFRAME_DATA[period];
  const latestPrice = currentData.prices[currentData.prices.length - 1];
  const latestPriceBrl = latestPrice * USD_TO_BRL_RATE;
  const isPositive = currentData.changePercent >= 0;

  const marketCapUsd = TOTAL_TOKEN_SUPPLY * latestPrice;
  const vaultReserveUsd = VAULT_RESERVE_SUPPLY * latestPrice;

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
        p: 2.5,
        bgcolor: 'background.paper',
        border: (t) => `1px solid ${t.palette.divider}`,
        borderRadius: 2,
        ...sx,
      }}
      {...other}
    >
      {/* 1. CABEÇALHO DO TOKEN COM IDENTIDADE E SELETORES */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          mb: 2.5,
        }}
      >
        {/* Identidade do Token Nativo */}
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 44,
              height: 44,
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
            <Iconify icon={'solar:shield-star-bold' as any} width={26} />
          </Box>

          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.2px' }}>
                ASPPIBRA
              </Typography>
              <Chip
                label="ASPPBR"
                size="small"
                sx={{
                  bgcolor: (t) => alpha('#00A76F', 0.14),
                  color: '#00A76F',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  height: 22,
                }}
              />
              <Chip
                label="Token Nativo de Governança"
                size="small"
                color="success"
                variant="soft"
                sx={{ fontWeight: 700, fontSize: '0.68rem', height: 22 }}
              />
              <Chip
                label="Arbitrum One L2"
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: '0.68rem', height: 22 }}
              />
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}>
              Monitoramento em tempo real de cotação, liquidez e reservas do ecossistema ASPPIBRA
            </Typography>
          </Box>
        </Stack>

        {/* Controles: Seletor de Métrica e Períodos */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            alignSelf: { xs: 'stretch', sm: 'auto' },
            justifyContent: { xs: 'space-between', sm: 'flex-end' },
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {/* Alternador de Métrica (Preço / Volume) */}
          <Box
            sx={{
              display: 'inline-flex',
              p: 0.5,
              borderRadius: 1,
              bgcolor: (t) => alpha(t.palette.grey[500], 0.08),
            }}
          >
            <Button
              size="small"
              onClick={() => setMetricMode('price')}
              variant={metricMode === 'price' ? 'contained' : 'text'}
              color={metricMode === 'price' ? 'primary' : 'inherit'}
              sx={{
                py: 0.4,
                px: 1.25,
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: metricMode === 'price' ? 1 : 0,
              }}
              startIcon={<Iconify icon={'solar:chart-2-bold' as any} width={14} />}
            >
              Cotação
            </Button>
            <Button
              size="small"
              onClick={() => setMetricMode('volume')}
              variant={metricMode === 'volume' ? 'contained' : 'text'}
              color={metricMode === 'volume' ? 'info' : 'inherit'}
              sx={{
                py: 0.4,
                px: 1.25,
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: metricMode === 'volume' ? 1 : 0,
              }}
              startIcon={<Iconify icon={'solar:graph-up-bold' as any} width={14} />}
            >
              Volume
            </Button>
          </Box>

          {/* Botões de Período */}
          <Box
            sx={{
              display: 'inline-flex',
              p: 0.5,
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
                  minWidth: 38,
                  py: 0.4,
                  px: 1,
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'none',
                  bgcolor: period === t ? 'background.paper' : 'transparent',
                  color: period === t ? 'text.primary' : 'text.secondary',
                  boxShadow: period === t ? 1 : 0,
                  '&:hover': {
                    bgcolor: period === t ? 'background.paper' : (themeMode) => alpha(themeMode.palette.grey[500], 0.12),
                  },
                }}
              >
                {t}
              </Button>
            ))}
          </Box>
        </Stack>
      </Stack>

      {/* 2. LINHA DE COTAÇÃO ATUAL E VARIAÇÃO */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'flex-end' },
          mb: 2.5,
          p: 2,
          borderRadius: 1.5,
          bgcolor: (t) => alpha(t.palette.grey[500], 0.04),
          border: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            {metricMode === 'price' ? 'Preço de Referência do Token' : 'Volume Negociado no Período'}
          </Typography>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'baseline', mt: 0.5, flexWrap: 'wrap' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontFamily: 'monospace',
                letterSpacing: '-0.8px',
                color: metricMode === 'price' ? '#00A76F' : 'info.main',
              }}
            >
              ${metricMode === 'price' ? latestPrice.toFixed(4) : currentData.periodVolumeUsd.toLocaleString('en-US')}{' '}
              <Typography component="span" variant="body1" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                USD
              </Typography>
            </Typography>

            {metricMode === 'price' && (
              <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 700, fontFamily: 'monospace' }}>
                ≈ R$ {latestPriceBrl.toFixed(2)}{' '}
                <Typography component="span" variant="caption" sx={{ color: 'text.disabled' }}>
                  BRL
                </Typography>
              </Typography>
            )}

            <Chip
              label={`${isPositive ? '+' : ''}${currentData.changePercent.toFixed(2)}% (${period})`}
              size="small"
              color={isPositive ? 'success' : 'error'}
              variant="soft"
              icon={
                <Iconify
                  icon={(isPositive ? 'solar:trending-up-bold' : 'solar:trending-down-bold') as any}
                  width={14}
                />
              }
              sx={{ fontWeight: 800, fontSize: '0.72rem', height: 24 }}
            />
          </Stack>
        </Box>

        {/* Indicadores de Faixa de Preço no Período */}
        <Stack direction="row" spacing={2.5} sx={{ alignItems: 'center' }}>
          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', fontWeight: 700 }}>
              Mínima ({period})
            </Typography>
            <Typography variant="subtitle2" sx={{ fontFamily: 'monospace', fontWeight: 800, color: 'text.secondary' }}>
              ${currentData.lowPrice.toFixed(3)}
            </Typography>
          </Box>

          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', fontWeight: 700 }}>
              Máxima ({period})
            </Typography>
            <Typography variant="subtitle2" sx={{ fontFamily: 'monospace', fontWeight: 800, color: 'text.primary' }}>
              ${currentData.highPrice.toFixed(3)}
            </Typography>
          </Box>
        </Stack>
      </Stack>

      {/* 3. GRÁFICO DINÂMICO APEXCHARTS */}
      <Box sx={{ mt: 1, mb: 2 }}>
        <Chart
          type="area"
          series={chartSeries}
          options={chartOptions}
          sx={{ height: 260 }}
          slotProps={{ loading: { p: 2.5 } }}
        />
      </Box>

      {/* 4. KPIS DE ECOSSISTEMA E CUSTÓDIA DO TOKEN NATIVO */}
      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        {/* KPI 1: Market Cap (FDV) */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box
            sx={{
              p: 1.75,
              borderRadius: 1.5,
              bgcolor: (t) => alpha(t.palette.grey[500], 0.04),
              border: (t) => `1px solid ${t.palette.divider}`,
              height: '100%',
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
              <Iconify icon={'solar:dollar-minimalistic-bold' as any} width={16} sx={{ color: 'success.main' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                Valor Total (FDV)
              </Typography>
            </Stack>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'text.primary' }}>
              ${marketCapUsd.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} USD
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', fontSize: '0.68rem', mt: 0.25 }}>
              Supply Total: {TOTAL_TOKEN_SUPPLY.toLocaleString('en-US')} ASPPBR
            </Typography>
          </Box>
        </Grid>

        {/* KPI 2: Reserva no Cofre Safe */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box
            sx={{
              p: 1.75,
              borderRadius: 1.5,
              bgcolor: (t) => alpha(t.palette.grey[500], 0.04),
              border: (t) => `1px solid ${t.palette.divider}`,
              height: '100%',
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
              <Iconify icon={'solar:shield-check-bold' as any} width={16} sx={{ color: '#00A76F' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                Custódia no Cofre Safe
              </Typography>
            </Stack>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#00A76F' }}>
              {VAULT_RESERVE_SUPPLY.toLocaleString('en-US')} ASPPBR
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', fontSize: '0.68rem', mt: 0.25 }}>
              ≈ ${vaultReserveUsd.toLocaleString('en-US')} USD (10.0% da Reserva)
            </Typography>
          </Box>
        </Grid>

        {/* KPI 3: Volume 24 Horas */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box
            sx={{
              p: 1.75,
              borderRadius: 1.5,
              bgcolor: (t) => alpha(t.palette.grey[500], 0.04),
              border: (t) => `1px solid ${t.palette.divider}`,
              height: '100%',
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
              <Iconify icon={'solar:refresh-circle-bold' as any} width={16} sx={{ color: 'info.main' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                Volume 24 Horas
              </Typography>
            </Stack>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'text.primary' }}>
              ${TOKEN_TIMEFRAME_DATA['24H'].periodVolumeUsd.toLocaleString('en-US')} USD
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', fontSize: '0.68rem', mt: 0.25 }}>
              ≈ R$ {(TOKEN_TIMEFRAME_DATA['24H'].periodVolumeUsd * USD_TO_BRL_RATE).toLocaleString('pt-BR')} BRL
            </Typography>
          </Box>
        </Grid>

        {/* KPI 4: Staking & Bloqueado */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box
            sx={{
              p: 1.75,
              borderRadius: 1.5,
              bgcolor: (t) => alpha(t.palette.grey[500], 0.04),
              border: (t) => `1px solid ${t.palette.divider}`,
              height: '100%',
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
              <Iconify icon={'solar:lock-keyhole-bold' as any} width={16} sx={{ color: 'warning.main' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                Staking & Governança
              </Typography>
            </Stack>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'text.primary' }}>
              {STAKED_SUPPLY.toLocaleString('en-US')} ASPPBR
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', fontSize: '0.68rem', mt: 0.25 }}>
              34.5% da oferta circulante ativa
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}
