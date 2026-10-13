import type { BoxProps } from '@mui/material/Box';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  ColorType,
  createChart,
  CrosshairMode,
  type IChartApi,
  HistogramSeries,
  type ISeriesApi,
  CandlestickSeries,
} from 'lightweight-charts';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type TradingViewTimeframe = '15m' | '1h' | '4h' | '1D' | '1W';

export interface CandleDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const MOCK_TRADINGVIEW_DATA: Record<TradingViewTimeframe, CandleDataPoint[]> = {
  '1W': [
    { time: '2025-01-06', open: 1.020, high: 1.045, low: 0.940, close: 0.950, volume: 840000 },
    { time: '2025-01-13', open: 0.950, high: 0.965, low: 0.820, close: 0.835, volume: 1250000 },
    { time: '2025-01-20', open: 0.835, high: 0.890, low: 0.800, close: 0.865, volume: 920000 },
    { time: '2025-01-27', open: 0.865, high: 0.880, low: 0.740, close: 0.755, volume: 1100000 },
    { time: '2025-02-03', open: 0.755, high: 0.780, low: 0.520, close: 0.540, volume: 2450000 },
    { time: '2025-02-10', open: 0.540, high: 0.590, low: 0.510, close: 0.575, volume: 1680000 },
    { time: '2025-02-17', open: 0.575, high: 0.585, low: 0.460, close: 0.480, volume: 980000 },
    { time: '2025-02-24', open: 0.480, high: 0.520, low: 0.440, close: 0.495, volume: 810000 },
    { time: '2025-03-03', open: 0.495, high: 0.540, low: 0.470, close: 0.510, volume: 720000 },
    { time: '2025-03-10', open: 0.510, high: 0.535, low: 0.410, close: 0.430, volume: 1150000 },
    { time: '2025-03-17', open: 0.430, high: 0.475, low: 0.360, close: 0.380, volume: 1540000 },
    { time: '2025-03-24', open: 0.380, high: 0.440, low: 0.370, close: 0.420, volume: 890000 },
    { time: '2025-03-31', open: 0.420, high: 0.540, low: 0.410, close: 0.525, volume: 1980000 },
    { time: '2025-04-07', open: 0.525, high: 0.560, low: 0.480, close: 0.505, volume: 1320000 },
    { time: '2025-04-14', open: 0.505, high: 0.525, low: 0.465, close: 0.490, volume: 870000 },
    { time: '2025-04-21', open: 0.490, high: 0.530, low: 0.480, close: 0.520, volume: 740000 },
    { time: '2025-04-28', open: 0.520, high: 0.545, low: 0.490, close: 0.535, volume: 690000 },
    { time: '2025-05-05', open: 0.535, high: 0.550, low: 0.460, close: 0.475, volume: 920000 },
    { time: '2025-05-12', open: 0.475, high: 0.510, low: 0.450, close: 0.485, volume: 650000 },
    { time: '2025-05-19', open: 0.485, high: 0.500, low: 0.430, close: 0.445, volume: 880000 },
    { time: '2025-05-26', open: 0.445, high: 0.470, low: 0.420, close: 0.460, volume: 710000 },
    { time: '2025-06-02', open: 0.460, high: 0.490, low: 0.435, close: 0.450, volume: 830000 },
    { time: '2025-06-09', open: 0.450, high: 0.465, low: 0.395, close: 0.410, volume: 1040000 },
    { time: '2025-06-16', open: 0.410, high: 0.425, low: 0.370, close: 0.385, volume: 960000 },
    { time: '2025-06-23', open: 0.385, high: 0.415, low: 0.360, close: 0.375, volume: 850000 },
    { time: '2025-06-30', open: 0.375, high: 0.390, low: 0.340, close: 0.355, volume: 1120000 },
    { time: '2025-07-07', open: 0.355, high: 0.380, low: 0.345, close: 0.370, volume: 760000 },
    { time: '2025-07-14', open: 0.370, high: 0.410, low: 0.365, close: 0.395, volume: 910000 },
    { time: '2025-07-21', open: 0.395, high: 0.405, low: 0.330, close: 0.340, volume: 1420000 },
    { time: '2025-07-28', open: 0.340, high: 0.355, low: 0.310, close: 0.320, volume: 1200000 },
    { time: '2025-08-04', open: 0.320, high: 0.345, low: 0.305, close: 0.335, volume: 890000 },
    { time: '2025-08-11', open: 0.335, high: 0.360, low: 0.315, close: 0.350, volume: 740000 },
    { time: '2025-08-18', open: 0.350, high: 0.355, low: 0.285, close: 0.295, volume: 1560000 },
    { time: '2025-08-25', open: 0.295, high: 0.320, low: 0.145, close: 0.160, volume: 3200000 },
    { time: '2025-09-01', open: 0.160, high: 1.050, low: 0.155, close: 0.6355, volume: 4850000 },
  ],
  '1D': [
    { time: '2025-08-20', open: 0.340, high: 0.355, low: 0.330, close: 0.345, volume: 210000 },
    { time: '2025-08-21', open: 0.345, high: 0.350, low: 0.320, close: 0.330, volume: 195000 },
    { time: '2025-08-22', open: 0.330, high: 0.340, low: 0.310, close: 0.315, volume: 240000 },
    { time: '2025-08-23', open: 0.315, high: 0.325, low: 0.295, close: 0.300, volume: 280000 },
    { time: '2025-08-24', open: 0.300, high: 0.310, low: 0.280, close: 0.290, volume: 310000 },
    { time: '2025-08-25', open: 0.290, high: 0.295, low: 0.240, close: 0.250, volume: 480000 },
    { time: '2025-08-26', open: 0.250, high: 0.260, low: 0.190, close: 0.200, volume: 620000 },
    { time: '2025-08-27', open: 0.200, high: 0.215, low: 0.160, close: 0.170, volume: 850000 },
    { time: '2025-08-28', open: 0.170, high: 0.185, low: 0.145, close: 0.155, volume: 1100000 },
    { time: '2025-08-29', open: 0.155, high: 0.380, low: 0.150, close: 0.340, volume: 1950000 },
    { time: '2025-08-30', open: 0.340, high: 0.520, low: 0.320, close: 0.480, volume: 1650000 },
    { time: '2025-08-31', open: 0.480, high: 0.610, low: 0.460, close: 0.590, volume: 1420000 },
    { time: '2025-09-01', open: 0.590, high: 1.050, low: 0.580, close: 0.6355, volume: 2200000 },
  ],
  '4h': [
    { time: '2025-08-31 00:00:00', open: 0.480, high: 0.510, low: 0.470, close: 0.495, volume: 180000 },
    { time: '2025-08-31 04:00:00', open: 0.495, high: 0.530, low: 0.485, close: 0.520, volume: 210000 },
    { time: '2025-08-31 08:00:00', open: 0.520, high: 0.560, low: 0.510, close: 0.550, volume: 290000 },
    { time: '2025-08-31 12:00:00', open: 0.550, high: 0.580, low: 0.540, close: 0.570, volume: 310000 },
    { time: '2025-08-31 16:00:00', open: 0.570, high: 0.610, low: 0.560, close: 0.590, volume: 430000 },
    { time: '2025-08-31 20:00:00', open: 0.590, high: 0.605, low: 0.575, close: 0.585, volume: 220000 },
    { time: '2025-09-01 00:00:00', open: 0.585, high: 0.720, low: 0.580, close: 0.690, volume: 680000 },
    { time: '2025-09-01 04:00:00', open: 0.690, high: 0.880, low: 0.670, close: 0.820, volume: 920000 },
    { time: '2025-09-01 08:00:00', open: 0.820, high: 1.050, low: 0.720, close: 0.740, volume: 1450000 },
    { time: '2025-09-01 12:00:00', open: 0.740, high: 0.760, low: 0.620, close: 0.6355, volume: 890000 },
  ],
  '1h': [
    { time: '2025-09-01 05:00:00', open: 0.680, high: 0.710, low: 0.670, close: 0.705, volume: 95000 },
    { time: '2025-09-01 06:00:00', open: 0.705, high: 0.750, low: 0.695, close: 0.740, volume: 142000 },
    { time: '2025-09-01 07:00:00', open: 0.740, high: 0.810, low: 0.730, close: 0.795, volume: 220000 },
    { time: '2025-09-01 08:00:00', open: 0.795, high: 0.920, low: 0.780, close: 0.890, volume: 380000 },
    { time: '2025-09-01 09:00:00', open: 0.890, high: 1.050, low: 0.870, close: 0.980, volume: 590000 },
    { time: '2025-09-01 10:00:00', open: 0.980, high: 0.995, low: 0.820, close: 0.840, volume: 410000 },
    { time: '2025-09-01 11:00:00', open: 0.840, high: 0.860, low: 0.720, close: 0.740, volume: 310000 },
    { time: '2025-09-01 12:00:00', open: 0.740, high: 0.755, low: 0.650, close: 0.670, volume: 260000 },
    { time: '2025-09-01 13:00:00', open: 0.670, high: 0.685, low: 0.630, close: 0.640, volume: 190000 },
    { time: '2025-09-01 14:00:00', open: 0.640, high: 0.648, low: 0.625, close: 0.6355, volume: 145000 },
  ],
  '15m': [
    { time: '2025-09-01 13:00:00', open: 0.670, high: 0.675, low: 0.660, close: 0.662, volume: 42000 },
    { time: '2025-09-01 13:15:00', open: 0.662, high: 0.668, low: 0.650, close: 0.655, volume: 38000 },
    { time: '2025-09-01 13:30:00', open: 0.655, high: 0.660, low: 0.640, close: 0.645, volume: 49000 },
    { time: '2025-09-01 13:45:00', open: 0.645, high: 0.652, low: 0.635, close: 0.640, volume: 55000 },
    { time: '2025-09-01 14:00:00', open: 0.640, high: 0.644, low: 0.630, close: 0.632, volume: 31000 },
    { time: '2025-09-01 14:15:00', open: 0.632, high: 0.639, low: 0.628, close: 0.637, volume: 28000 },
    { time: '2025-09-01 14:30:00', open: 0.637, high: 0.642, low: 0.633, close: 0.6355, volume: 35000 },
  ],
};

interface Props extends BoxProps {
  onPriceChange?: (price: number) => void;
}

export function TradingViewTokenChart({ onPriceChange, sx, ...other }: Props) {
  const theme = useTheme();
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  const [timeframe, setTimeframe] = useState<TradingViewTimeframe>('1W');
  const [activeCandle, setActiveCandle] = useState<CandleDataPoint | null>(null);

  const isDarkMode = theme.palette.mode === 'dark';

  const currentDataset = MOCK_TRADINGVIEW_DATA[timeframe];
  const latestCandle = currentDataset[currentDataset.length - 1];

  const displayCandle = activeCandle || latestCandle;
  const candleChange = displayCandle.close - displayCandle.open;
  const candlePercent = displayCandle.open > 0 ? (candleChange / displayCandle.open) * 100 : 0;
  const isUp = candleChange >= 0;

  // Inicializa e gerencia a instância do TradingView Lightweight Charts
  useEffect(() => {
    if (!chartContainerRef.current) {
      return undefined;
    }

    // Remove qualquer instância existente antes de criar
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const container = chartContainerRef.current;

    const chart = createChart(container, {
      width: container.clientWidth || 800,
      height: 420,
      layout: {
        background: {
          type: ColorType.Solid,
          color: isDarkMode ? '#131722' : '#FFFFFF',
        },
        textColor: isDarkMode ? '#9DB2CE' : '#4B5563',
      },
      grid: {
        vertLines: {
          color: isDarkMode ? 'rgba(42, 46, 57, 0.45)' : 'rgba(229, 231, 235, 0.7)',
        },
        horzLines: {
          color: isDarkMode ? 'rgba(42, 46, 57, 0.45)' : 'rgba(229, 231, 235, 0.7)',
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          width: 1,
          color: isDarkMode ? 'rgba(224, 227, 235, 0.4)' : 'rgba(107, 114, 128, 0.4)',
          style: 3,
        },
        horzLine: {
          width: 1,
          color: isDarkMode ? 'rgba(224, 227, 235, 0.4)' : 'rgba(107, 114, 128, 0.4)',
          style: 3,
        },
      },
      rightPriceScale: {
        borderColor: isDarkMode ? 'rgba(42, 46, 57, 0.8)' : 'rgba(229, 231, 235, 0.8)',
        scaleMargins: {
          top: 0.1,
          bottom: 0.22,
        },
      },
      timeScale: {
        borderColor: isDarkMode ? 'rgba(42, 46, 57, 0.8)' : 'rgba(229, 231, 235, 0.8)',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // 1. Série de Velas Japonesas (Candlesticks) - Padrão TradingView/Crypto
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      priceFormat: {
        type: 'price',
        precision: 4,
        minMove: 0.0001,
      },
    });

    // 2. Série de Volume em Histograma sobreposta na base
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // Escala separada para overlay inferior
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.75, // Mantém o volume ocupando no máximo os 25% inferiores do gráfico
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    // Alimenta os dados do timeframe atual
    const candleData = currentDataset.map((c) => ({
      time: c.time as any,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    const volumeData = currentDataset.map((c) => ({
      time: c.time as any,
      value: c.volume,
      color: c.close >= c.open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)',
    }));

    candleSeries.setData(candleData);
    volumeSeries.setData(volumeData);
    chart.timeScale().fitContent();

    // Inscrição para Crosshair Tooltip dinâmico
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time || !param.seriesData) {
        setActiveCandle(null);
        return;
      }
      const data = param.seriesData.get(candleSeries) as any;
      if (data && data.open !== undefined) {
        const matching = currentDataset.find((c) => c.time === param.time);
        setActiveCandle({
          time: String(param.time),
          open: data.open,
          high: data.high,
          low: data.low,
          close: data.close,
          volume: matching?.volume || 0,
        });
      }
    });

    // Observador responsivo de redimensionamento de janela
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartRef.current = null;
    };
  }, [timeframe, isDarkMode, currentDataset]);

  // Atualiza preço pai caso solicitado
  useEffect(() => {
    if (onPriceChange) {
      onPriceChange(latestCandle.close);
    }
  }, [latestCandle.close, onPriceChange]);

  const handleResetView = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, []);

  return (
    <Box
      sx={{
        borderRadius: 1.5,
        overflow: 'hidden',
        bgcolor: isDarkMode ? '#131722' : 'background.paper',
        border: (t) => `1px solid ${t.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
      {...other}
    >
      {/* BARRA SUPERIOR PROFISSIONAL TRADINGVIEW */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{
          p: 1.25,
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          bgcolor: isDarkMode ? '#1b1e2e' : alpha(theme.palette.grey[500], 0.04),
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {/* Par e DEX */}
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                bgcolor: '#00A76F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 10,
                fontWeight: 900,
              }}
            >
              A
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.2px' }}>
              ASPPBR / USDT
            </Typography>
          </Stack>

          <Chip
            label="Uniswap v3"
            size="small"
            variant="soft"
            color="info"
            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
          />

          <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace' }}>
            dexscreener.com
          </Typography>
        </Stack>

        {/* Barra de Timeframes Tradicionais TradingView */}
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          {(['15m', '1h', '4h', '1D', '1W'] as TradingViewTimeframe[]).map((tf) => (
            <Button
              key={tf}
              size="small"
              onClick={() => setTimeframe(tf)}
              variant={timeframe === tf ? 'contained' : 'text'}
              color={timeframe === tf ? 'primary' : 'inherit'}
              sx={{
                minWidth: 34,
                px: 1,
                py: 0.25,
                height: 24,
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'none',
                bgcolor: timeframe === tf ? (isDarkMode ? '#2962FF' : 'primary.main') : 'transparent',
                color: timeframe === tf ? '#FFFFFF' : 'text.secondary',
                '&:hover': {
                  bgcolor: timeframe === tf ? '#1E4BD8' : (t) => alpha(t.palette.grey[500], 0.12),
                },
              }}
            >
              {tf}
            </Button>
          ))}

          {/* Botão de Encaixar Conteúdo (Fit Content) */}
          <Tooltip title="Resetar Escala e Ajustar ao Gráfico">
            <Button
              size="small"
              onClick={handleResetView}
              sx={{
                minWidth: 26,
                height: 24,
                px: 0.5,
                color: 'text.secondary',
              }}
            >
              <Iconify icon={'solar:maximize-square-bold' as any} width={14} />
            </Button>
          </Tooltip>
        </Stack>
      </Stack>

      {/* OVERLAY DE MÉTRICAS EM TEMPO REAL OHLCV (IDÊNTICO AO DEXSCREENER / TRADINGVIEW) */}
      <Box
        sx={{
          px: 1.5,
          py: 0.75,
          bgcolor: isDarkMode ? '#131722' : '#FAFAFA',
          borderBottom: (t) => `1px solid ${alpha(t.palette.divider, 0.4)}`,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'baseline',
            flexWrap: 'wrap',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            gap: 1,
          }}
        >
          <Box sx={{ color: isUp ? '#26a69a' : '#ef5350', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: isUp ? '#26a69a' : '#ef5350' }} />
            <span>${displayCandle.close.toFixed(4)}</span>
            <span>
              {isUp ? '+' : ''}
              {candleChange.toFixed(4)} ({isUp ? '+' : ''}
              {candlePercent.toFixed(2)}%)
            </span>
          </Box>

          <Box sx={{ color: 'text.secondary' }}>
            <Typography component="span" variant="caption" sx={{ color: 'text.disabled', mr: 0.4 }}>
              O
            </Typography>
            <span>{displayCandle.open.toFixed(4)}</span>
          </Box>

          <Box sx={{ color: 'text.secondary' }}>
            <Typography component="span" variant="caption" sx={{ color: 'text.disabled', mr: 0.4 }}>
              H
            </Typography>
            <span style={{ color: '#26a69a' }}>{displayCandle.high.toFixed(4)}</span>
          </Box>

          <Box sx={{ color: 'text.secondary' }}>
            <Typography component="span" variant="caption" sx={{ color: 'text.disabled', mr: 0.4 }}>
              L
            </Typography>
            <span style={{ color: '#ef5350' }}>{displayCandle.low.toFixed(4)}</span>
          </Box>

          <Box sx={{ color: 'text.secondary' }}>
            <Typography component="span" variant="caption" sx={{ color: 'text.disabled', mr: 0.4 }}>
              C
            </Typography>
            <span>{displayCandle.close.toFixed(4)}</span>
          </Box>

          <Box sx={{ color: 'text.secondary' }}>
            <Typography component="span" variant="caption" sx={{ color: 'text.disabled', mr: 0.4 }}>
              Vol
            </Typography>
            <span style={{ color: isUp ? '#26a69a' : '#ef5350' }}>
              ${displayCandle.volume.toLocaleString('en-US')}
            </span>
          </Box>
        </Stack>
      </Box>

      {/* CONTAINER DO CANVAS DO TRADINGVIEW */}
      <Box
        ref={chartContainerRef}
        sx={{
          width: '100%',
          height: 420,
          position: 'relative',
        }}
      />

      {/* RODAPÉ DO TRADINGVIEW COM MARCADOR E FUSO HORÁRIO */}
      <Stack
        direction="row"
        sx={{
          px: 1.5,
          py: 0.5,
          borderTop: (t) => `1px solid ${t.palette.divider}`,
          bgcolor: isDarkMode ? '#131722' : '#F9FAFB',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Chip
            label="TradingView Engine"
            size="small"
            variant="outlined"
            sx={{
              height: 18,
              fontSize: '0.62rem',
              fontWeight: 800,
              color: isDarkMode ? '#9DB2CE' : 'text.secondary',
              borderColor: (t) => alpha(t.palette.divider, 0.8),
            }}
          />
          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>
            Candlestick OHLCV • Arbitrum Liquidity Pool
          </Typography>
        </Stack>

        <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace', fontSize: '0.68rem' }}>
          UTC-3 • Tempo Real
        </Typography>
      </Stack>
    </Box>
  );
}
