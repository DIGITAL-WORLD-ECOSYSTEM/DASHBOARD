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
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

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
    { time: '2025-01-06', open: 1.02, high: 1.045, low: 0.94, close: 0.95, volume: 840000 },
    { time: '2025-01-13', open: 0.95, high: 0.965, low: 0.82, close: 0.835, volume: 1250000 },
    { time: '2025-01-20', open: 0.835, high: 0.89, low: 0.8, close: 0.865, volume: 920000 },
    { time: '2025-01-27', open: 0.865, high: 0.88, low: 0.74, close: 0.755, volume: 1100000 },
    { time: '2025-02-03', open: 0.755, high: 0.78, low: 0.52, close: 0.54, volume: 2450000 },
    { time: '2025-02-10', open: 0.54, high: 0.59, low: 0.51, close: 0.575, volume: 1680000 },
    { time: '2025-02-17', open: 0.575, high: 0.585, low: 0.46, close: 0.48, volume: 980000 },
    { time: '2025-02-24', open: 0.48, high: 0.52, low: 0.44, close: 0.495, volume: 810000 },
    { time: '2025-03-03', open: 0.495, high: 0.54, low: 0.47, close: 0.51, volume: 720000 },
    { time: '2025-03-10', open: 0.51, high: 0.535, low: 0.41, close: 0.43, volume: 1150000 },
    { time: '2025-03-17', open: 0.43, high: 0.475, low: 0.36, close: 0.38, volume: 1540000 },
    { time: '2025-03-24', open: 0.38, high: 0.44, low: 0.37, close: 0.42, volume: 890000 },
    { time: '2025-03-31', open: 0.42, high: 0.54, low: 0.41, close: 0.525, volume: 1980000 },
    { time: '2025-04-07', open: 0.525, high: 0.56, low: 0.48, close: 0.505, volume: 1320000 },
    { time: '2025-04-14', open: 0.505, high: 0.525, low: 0.465, close: 0.49, volume: 870000 },
    { time: '2025-04-21', open: 0.49, high: 0.53, low: 0.48, close: 0.52, volume: 740000 },
    { time: '2025-04-28', open: 0.52, high: 0.545, low: 0.49, close: 0.535, volume: 690000 },
    { time: '2025-05-05', open: 0.535, high: 0.55, low: 0.46, close: 0.475, volume: 920000 },
    { time: '2025-05-12', open: 0.475, high: 0.51, low: 0.45, close: 0.485, volume: 650000 },
    { time: '2025-05-19', open: 0.485, high: 0.5, low: 0.43, close: 0.445, volume: 880000 },
    { time: '2025-05-26', open: 0.445, high: 0.47, low: 0.42, close: 0.46, volume: 710000 },
    { time: '2025-06-02', open: 0.46, high: 0.49, low: 0.435, close: 0.45, volume: 830000 },
    { time: '2025-06-09', open: 0.45, high: 0.465, low: 0.395, close: 0.41, volume: 1040000 },
    { time: '2025-06-16', open: 0.41, high: 0.425, low: 0.37, close: 0.385, volume: 960000 },
    { time: '2025-06-23', open: 0.385, high: 0.415, low: 0.36, close: 0.375, volume: 850000 },
    { time: '2025-06-30', open: 0.375, high: 0.39, low: 0.34, close: 0.355, volume: 1120000 },
    { time: '2025-07-07', open: 0.355, high: 0.38, low: 0.345, close: 0.37, volume: 760000 },
    { time: '2025-07-14', open: 0.37, high: 0.41, low: 0.365, close: 0.395, volume: 910000 },
    { time: '2025-07-21', open: 0.395, high: 0.405, low: 0.33, close: 0.34, volume: 1420000 },
    { time: '2025-07-28', open: 0.34, high: 0.355, low: 0.31, close: 0.32, volume: 1200000 },
    { time: '2025-08-04', open: 0.32, high: 0.345, low: 0.305, close: 0.335, volume: 890000 },
    { time: '2025-08-11', open: 0.335, high: 0.36, low: 0.315, close: 0.35, volume: 740000 },
    { time: '2025-08-18', open: 0.35, high: 0.355, low: 0.285, close: 0.295, volume: 1560000 },
    { time: '2025-08-25', open: 0.295, high: 0.32, low: 0.145, close: 0.16, volume: 3200000 },
    { time: '2025-09-01', open: 0.16, high: 1.05, low: 0.155, close: 0.6355, volume: 4850000 },
  ],
  '1D': [
    { time: '2025-08-20', open: 0.34, high: 0.355, low: 0.33, close: 0.345, volume: 210000 },
    { time: '2025-08-21', open: 0.345, high: 0.35, low: 0.32, close: 0.33, volume: 195000 },
    { time: '2025-08-22', open: 0.33, high: 0.34, low: 0.31, close: 0.315, volume: 240000 },
    { time: '2025-08-23', open: 0.315, high: 0.325, low: 0.295, close: 0.3, volume: 280000 },
    { time: '2025-08-24', open: 0.3, high: 0.31, low: 0.28, close: 0.29, volume: 310000 },
    { time: '2025-08-25', open: 0.29, high: 0.295, low: 0.24, close: 0.25, volume: 480000 },
    { time: '2025-08-26', open: 0.25, high: 0.26, low: 0.19, close: 0.2, volume: 620000 },
    { time: '2025-08-27', open: 0.2, high: 0.215, low: 0.16, close: 0.17, volume: 850000 },
    { time: '2025-08-28', open: 0.17, high: 0.185, low: 0.145, close: 0.155, volume: 1100000 },
    { time: '2025-08-29', open: 0.155, high: 0.38, low: 0.15, close: 0.34, volume: 1950000 },
    { time: '2025-08-30', open: 0.34, high: 0.52, low: 0.32, close: 0.48, volume: 1650000 },
    { time: '2025-08-31', open: 0.48, high: 0.61, low: 0.46, close: 0.59, volume: 1420000 },
    { time: '2025-09-01', open: 0.59, high: 1.05, low: 0.58, close: 0.6355, volume: 2200000 },
  ],
  '4h': [
    { time: '2025-08-31 00:00:00', open: 0.48, high: 0.51, low: 0.47, close: 0.495, volume: 180000 },
    { time: '2025-08-31 04:00:00', open: 0.495, high: 0.53, low: 0.485, close: 0.52, volume: 210000 },
    { time: '2025-08-31 08:00:00', open: 0.52, high: 0.56, low: 0.51, close: 0.55, volume: 290000 },
    { time: '2025-08-31 12:00:00', open: 0.55, high: 0.58, low: 0.54, close: 0.57, volume: 310000 },
    { time: '2025-08-31 16:00:00', open: 0.57, high: 0.61, low: 0.56, close: 0.59, volume: 430000 },
    { time: '2025-08-31 20:00:00', open: 0.59, high: 0.605, low: 0.575, close: 0.585, volume: 220000 },
    { time: '2025-09-01 00:00:00', open: 0.585, high: 0.72, low: 0.58, close: 0.69, volume: 680000 },
    { time: '2025-09-01 04:00:00', open: 0.69, high: 0.88, low: 0.67, close: 0.82, volume: 920000 },
    { time: '2025-09-01 08:00:00', open: 0.82, high: 1.05, low: 0.72, close: 0.74, volume: 1450000 },
    { time: '2025-09-01 12:00:00', open: 0.74, high: 0.76, low: 0.62, close: 0.6355, volume: 890000 },
  ],
  '1h': [
    { time: '2025-09-01 05:00:00', open: 0.68, high: 0.71, low: 0.67, close: 0.705, volume: 95000 },
    { time: '2025-09-01 06:00:00', open: 0.705, high: 0.75, low: 0.695, close: 0.74, volume: 142000 },
    { time: '2025-09-01 07:00:00', open: 0.74, high: 0.81, low: 0.73, close: 0.795, volume: 220000 },
    { time: '2025-09-01 08:00:00', open: 0.795, high: 0.92, low: 0.78, close: 0.89, volume: 380000 },
    { time: '2025-09-01 09:00:00', open: 0.89, high: 1.05, low: 0.87, close: 0.98, volume: 590000 },
    { time: '2025-09-01 10:00:00', open: 0.98, high: 0.995, low: 0.82, close: 0.84, volume: 410000 },
    { time: '2025-09-01 11:00:00', open: 0.84, high: 0.86, low: 0.72, close: 0.74, volume: 310000 },
    { time: '2025-09-01 12:00:00', open: 0.74, high: 0.755, low: 0.65, close: 0.67, volume: 260000 },
    { time: '2025-09-01 13:00:00', open: 0.67, high: 0.685, low: 0.63, close: 0.64, volume: 190000 },
    { time: '2025-09-01 14:00:00', open: 0.64, high: 0.648, low: 0.625, close: 0.6355, volume: 145000 },
  ],
  '15m': [
    { time: '2025-09-01 13:00:00', open: 0.67, high: 0.675, low: 0.66, close: 0.662, volume: 42000 },
    { time: '2025-09-01 13:15:00', open: 0.662, high: 0.668, low: 0.65, close: 0.655, volume: 38000 },
    { time: '2025-09-01 13:30:00', open: 0.655, high: 0.66, low: 0.64, close: 0.645, volume: 49000 },
    { time: '2025-09-01 13:45:00', open: 0.645, high: 0.652, low: 0.635, close: 0.64, volume: 55000 },
    { time: '2025-09-01 14:00:00', open: 0.64, high: 0.644, low: 0.63, close: 0.632, volume: 31000 },
    { time: '2025-09-01 14:15:00', open: 0.632, high: 0.639, low: 0.628, close: 0.637, volume: 28000 },
    { time: '2025-09-01 14:30:00', open: 0.637, high: 0.642, low: 0.633, close: 0.6355, volume: 35000 },
  ],
};

interface Props extends BoxProps {
  onPriceChange?: (price: number) => void;
}

export function TradingViewTokenChart({ onPriceChange, sx, ...other }: Props) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  const [timeframe, setTimeframe] = useState<TradingViewTimeframe>('1W');
  const [activeCandle, setActiveCandle] = useState<CandleDataPoint | null>(null);
  const [activeTool, setActiveTool] = useState<string>('crosshair');

  const currentDataset = MOCK_TRADINGVIEW_DATA[timeframe];
  const latestCandle = currentDataset[currentDataset.length - 1];

  const displayCandle = activeCandle || latestCandle;
  const candleChange = displayCandle.close - displayCandle.open;
  const candlePercent = displayCandle.open > 0 ? (candleChange / displayCandle.open) * 100 : 0;
  const isUp = candleChange >= 0;

  // Inicializa o motor TradingView Lightweight Charts
  useEffect(() => {
    if (!chartContainerRef.current) {
      return undefined;
    }

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const container = chartContainerRef.current;

    // Padrão TradingView: Fundo Dark Terminal (#131722)
    const chart = createChart(container, {
      width: container.clientWidth || 800,
      height: 330,
      layout: {
        background: {
          type: ColorType.Solid,
          color: '#131722',
        },
        textColor: '#9DB2CE',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.4)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.4)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          width: 1,
          color: 'rgba(224, 227, 235, 0.35)',
          style: 3,
        },
        horzLine: {
          width: 1,
          color: 'rgba(224, 227, 235, 0.35)',
          style: 3,
        },
      },
      rightPriceScale: {
        borderColor: '#2A2E39',
        scaleMargins: {
          top: 0.12,
          bottom: 0.22,
        },
      },
      timeScale: {
        borderColor: '#2A2E39',
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 16,
        rightOffset: 8,
      },
    });

    // 1. Série de Velas Japonesas (Candlesticks) - Padrão TradingView Global
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

    // 2. Série de Volume desacoplada na base com transparência
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'volume',
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.78, // Ocupa no máximo 22% inferiores
        bottom: 0,
      },
      visible: false,
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

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

    // Inscrição para Crosshair Tooltip
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
  }, [timeframe, currentDataset]);

  useEffect(() => {
    if (onPriceChange) {
      onPriceChange(latestCandle.close);
    }
  }, [latestCandle.close, onPriceChange]);

  const handleFitContent = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, []);

  return (
    <Box
      sx={{
        borderRadius: 1.5,
        overflow: 'hidden',
        bgcolor: '#131722',
        border: '1px solid #2A2E39',
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
      {...other}
    >
      {/* 1. BARRA SUPERIOR INTEGRADA DO TRADINGVIEW */}
      <Stack
        direction="row"
        sx={{
          px: 1.5,
          py: 0.75,
          borderBottom: '1px solid #2A2E39',
          bgcolor: '#1E222D',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {/* Par e Cotação em Destaque */}
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 20,
                height: 20,
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
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#D1D4DC', fontSize: '0.85rem' }}>
              ASPPIBRA / USD
            </Typography>
          </Stack>

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#26a69a', fontFamily: 'monospace' }}>
              ${displayCandle.close.toFixed(4)}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: isUp ? '#26a69a' : '#ef5350',
                fontWeight: 700,
                fontFamily: 'monospace',
                fontSize: '0.72rem',
              }}
            >
              {isUp ? '+' : ''}
              {candleChange.toFixed(4)} ({isUp ? '+' : ''}
              {candlePercent.toFixed(2)}%)
            </Typography>
          </Box>
        </Stack>

        {/* Timeframes Oficiais TradingView e Ferramentas */}
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          {(['15m', '1h', '4h', '1D', '1W'] as TradingViewTimeframe[]).map((tf) => (
            <Button
              key={tf}
              size="small"
              onClick={() => setTimeframe(tf)}
              sx={{
                minWidth: 32,
                px: 0.75,
                py: 0.2,
                height: 22,
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'none',
                bgcolor: timeframe === tf ? '#2962FF' : 'transparent',
                color: timeframe === tf ? '#FFFFFF' : '#848E9C',
                '&:hover': {
                  bgcolor: timeframe === tf ? '#1E4BD8' : 'rgba(255,255,255,0.06)',
                  color: '#FFFFFF',
                },
              }}
            >
              {tf}
            </Button>
          ))}

          <Box sx={{ width: '1px', height: 16, bgcolor: '#2A2E39', mx: 0.5 }} />

          {/* Indicadores (fx) */}
          <Button
            size="small"
            sx={{
              height: 22,
              px: 0.75,
              fontSize: '0.72rem',
              color: '#848E9C',
              textTransform: 'none',
              fontWeight: 700,
              '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.06)' },
            }}
            startIcon={<Typography sx={{ fontFamily: 'serif', fontStyle: 'italic', fontWeight: 900, fontSize: 13, color: '#2962FF' }}>fx</Typography>}
          >
            Indicadores
          </Button>

          {/* Fit Content */}
          <Tooltip title="Ajustar Escala">
            <IconButton
              size="small"
              onClick={handleFitContent}
              sx={{ width: 22, height: 22, color: '#848E9C', '&:hover': { color: '#FFFFFF' } }}
            >
              <Iconify icon={'solar:maximize-square-bold' as any} width={13} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* 2. OVERLAY OHLCV INLINE (COMPACTO) */}
      <Box
        sx={{
          px: 1.5,
          py: 0.4,
          bgcolor: '#131722',
          borderBottom: '1px solid rgba(42, 46, 57, 0.4)',
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            color: '#787B86',
            flexWrap: 'wrap',
          }}
        >
          <span>
            O <strong style={{ color: '#D1D4DC' }}>{displayCandle.open.toFixed(4)}</strong>
          </span>
          <span>
            H <strong style={{ color: '#26a69a' }}>{displayCandle.high.toFixed(4)}</strong>
          </span>
          <span>
            L <strong style={{ color: '#ef5350' }}>{displayCandle.low.toFixed(4)}</strong>
          </span>
          <span>
            C <strong style={{ color: '#D1D4DC' }}>{displayCandle.close.toFixed(4)}</strong>
          </span>
          <span>
            Vol <strong style={{ color: isUp ? '#26a69a' : '#ef5350' }}>${displayCandle.volume.toLocaleString('en-US')}</strong>
          </span>
        </Stack>
      </Box>

      {/* 3. ÁREA PRINCIPAL: BARRA LATERAL TRADINGVIEW + CANVAS */}
      <Box sx={{ display: 'flex', width: '100%', height: 330, position: 'relative' }}>
        {/* Barra de Ferramentas de Desenho Lateral Esquerda TradingView */}
        <Box
          sx={{
            width: 38,
            flexShrink: 0,
            borderRight: '1px solid #2A2E39',
            bgcolor: '#1E222D',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 0.75,
            gap: 0.5,
          }}
        >
          {[
            { id: 'crosshair', icon: 'solar:cursor-bold', title: 'Cursor de Mira' },
            { id: 'line', icon: 'solar:pen-new-square-bold', title: 'Linha de Tendência' },
            { id: 'fib', icon: 'solar:tuning-square-2-bold', title: 'Retração de Fibonacci' },
            { id: 'brush', icon: 'solar:brush-bold', title: 'Pincel' },
            { id: 'text', icon: 'solar:text-bold', title: 'Anotação / Texto' },
            { id: 'ruler', icon: 'solar:ruler-bold', title: 'Medição de Intervalo' },
          ].map((tool) => (
            <Tooltip key={tool.id} title={tool.title} placement="right">
              <IconButton
                size="small"
                onClick={() => setActiveTool(tool.id)}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 0.75,
                  bgcolor: activeTool === tool.id ? 'rgba(41, 98, 255, 0.2)' : 'transparent',
                  color: activeTool === tool.id ? '#2962FF' : '#787B86',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    color: '#D1D4DC',
                  },
                }}
              >
                <Iconify icon={tool.icon as any} width={15} />
              </IconButton>
            </Tooltip>
          ))}
        </Box>

        {/* Container do Canvas TradingView */}
        <Box
          ref={chartContainerRef}
          sx={{
            flexGrow: 1,
            height: '100%',
            position: 'relative',
          }}
        />
      </Box>

      {/* 4. RODAPÉ DE ALCANCE RÁPIDO DO TRADINGVIEW */}
      <Stack
        direction="row"
        sx={{
          px: 1.5,
          py: 0.4,
          borderTop: '1px solid #2A2E39',
          bgcolor: '#1E222D',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Alcances Rápidos */}
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          {(['1D', '5D', '1M', '3M', '6M', '1A', 'ALL'] as const).map((r) => (
            <Button
              key={r}
              size="small"
              onClick={handleFitContent}
              sx={{
                minWidth: 26,
                px: 0.5,
                py: 0.1,
                height: 20,
                fontSize: '0.65rem',
                fontWeight: 700,
                color: '#787B86',
                '&:hover': { color: '#D1D4DC', bgcolor: 'rgba(255,255,255,0.06)' },
              }}
            >
              {r}
            </Button>
          ))}
        </Stack>

        {/* Escalas e Fuso Horário */}
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#787B86', fontFamily: 'monospace', fontSize: '0.65rem' }}>
            17:00:00 (UTC-3)
          </Typography>

          <Stack direction="row" spacing={0.5}>
            {['%', 'log', 'auto'].map((scale) => (
              <Typography
                key={scale}
                variant="caption"
                sx={{
                  color: scale === 'auto' ? '#2962FF' : '#787B86',
                  fontFamily: 'monospace',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  '&:hover': { color: '#D1D4DC' },
                }}
              >
                {scale}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
