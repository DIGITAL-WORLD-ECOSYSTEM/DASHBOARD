import type { BoxProps } from '@mui/material/Box';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export interface TradingViewSymbolOption {
  id: string;
  label: string;
  description: string;
}

export const TRADINGVIEW_DEFAULT_SYMBOLS: TradingViewSymbolOption[] = [
  { id: 'BINANCE:ARBUSDT', label: 'ARB/USDT', description: 'Arbitrum One (Rede do Token ASPPBR)' },
  { id: 'BINANCE:BTCUSDT', label: 'BTC/USDT', description: 'Bitcoin Tether' },
  { id: 'BINANCE:ETHUSDT', label: 'ETH/USDT', description: 'Ethereum Tether' },
  { id: 'BINANCE:SOLUSDT', label: 'SOL/USDT', description: 'Solana Tether' },
];

export const TRADINGVIEW_INTERVALS = ['15', '60', '240', 'D', 'W'] as const;

export type TradingViewInterval = (typeof TRADINGVIEW_INTERVALS)[number];

export interface TradingViewEmbedOptions {
  symbol?: string;
  interval?: string;
  theme?: 'dark' | 'light';
  locale?: string;
  timezone?: string;
  hideSideToolbar?: boolean;
  allowSymbolEdit?: boolean;
}

/**
 * Constrói a URL oficial de incorporação do TradingView Advanced Chart.
 * Utiliza o endpoint oficial 's.tradingview.com/widgetembed' sem dependências externas.
 */
export function buildTradingViewEmbedUrl(options: TradingViewEmbedOptions = {}): string {
  const {
    symbol = 'BINANCE:ARBUSDT',
    interval = 'D',
    theme = 'dark',
    locale = 'br',
    timezone = 'America/Sao_Paulo',
    hideSideToolbar = false,
    allowSymbolEdit = true,
  } = options;

  const params = new URLSearchParams({
    frameElementId: 'tradingview_widget_frame',
    symbol,
    interval,
    hidesidetoolbar: hideSideToolbar ? '1' : '0',
    symboledit: allowSymbolEdit ? '1' : '0',
    saveimage: '1',
    toolbarbg: theme === 'dark' ? '131722' : 'f1f3f6',
    theme,
    style: '1',
    timezone,
    withdateranges: '1',
    showpopupbutton: '1',
    locale,
  });

  return `https://s.tradingview.com/widgetembed/?${params.toString()}`;
}

// ----------------------------------------------------------------------

export interface TradingViewTokenChartProps extends BoxProps {
  initialSymbol?: string;
  chartHeight?: number;
}

export function TradingViewTokenChart({
  initialSymbol = 'BINANCE:ARBUSDT',
  chartHeight = 360,
  sx,
  ...other
}: TradingViewTokenChartProps) {
  const theme = useTheme();
  const [activeSymbol, setActiveSymbol] = useState<string>(initialSymbol);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const effectiveHeight = isExpanded ? 520 : chartHeight;

  const embedUrl = useMemo(
    () =>
      buildTradingViewEmbedUrl({
        symbol: activeSymbol,
        interval: 'D',
        theme: theme.palette.mode === 'light' ? 'light' : 'dark',
        locale: 'br',
        timezone: 'America/Sao_Paulo',
        hideSideToolbar: false,
        allowSymbolEdit: true,
      }),
    [activeSymbol, theme.palette.mode]
  );

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 1.5,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: (t) => alpha(t.palette.divider, 0.8),
        bgcolor: '#131722',
        ...sx,
      }}
      {...other}
    >
      {/* Barra de Ferramentas Superior — Seleção Rápida de Ativo */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{
          px: 1.5,
          py: 0.85,
          bgcolor: '#171b26',
          borderBottom: '1px solid #2a2e39',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
        }}
      >
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Stack direction="row" spacing={0.6} sx={{ alignItems: 'center', mr: 1 }}>
            <Box
              component="span"
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#26a69a',
                boxShadow: '0 0 6px #26a69a',
                display: 'inline-block',
              }}
            />
            <Typography variant="caption" sx={{ color: '#d1d4dc', fontWeight: 700, fontSize: '0.72rem' }}>
              TradingView Oficial
            </Typography>
          </Stack>

          {TRADINGVIEW_DEFAULT_SYMBOLS.map((s) => {
            const isSelected = activeSymbol === s.id;
            return (
              <Tooltip key={s.id} title={s.description} arrow>
                <Chip
                  size="small"
                  label={s.label}
                  clickable
                  onClick={() => {
                    if (activeSymbol !== s.id) {
                      setIsLoading(true);
                      setActiveSymbol(s.id);
                    }
                  }}
                  sx={{
                    height: 22,
                    fontSize: '0.68rem',
                    fontWeight: isSelected ? 800 : 600,
                    bgcolor: isSelected ? alpha('#2962ff', 0.25) : 'rgba(255, 255, 255, 0.05)',
                    color: isSelected ? '#2962ff' : '#9db2ce',
                    border: '1px solid',
                    borderColor: isSelected ? '#2962ff' : 'rgba(255, 255, 255, 0.08)',
                    '&:hover': {
                      bgcolor: isSelected ? alpha('#2962ff', 0.35) : 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                />
              </Tooltip>
            );
          })}
        </Stack>

        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <Tooltip title={isExpanded ? 'Recolher altura' : 'Expandir altura'} arrow>
            <IconButton
              size="small"
              onClick={() => setIsExpanded((prev) => !prev)}
              sx={{
                color: '#9db2ce',
                p: 0.5,
                '&:hover': { color: '#ffffff', bgcolor: 'rgba(255, 255, 255, 0.08)' },
              }}
            >
              <Iconify icon={(isExpanded ? 'solar:minimize-square-bold' : 'solar:maximize-square-bold') as any} width={15} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Abrir par no TradingView externo" arrow>
            <IconButton
              component={Link}
              href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(activeSymbol)}`}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{
                color: '#9db2ce',
                p: 0.5,
                '&:hover': { color: '#ffffff', bgcolor: 'rgba(255, 255, 255, 0.08)' },
              }}
            >
              <Iconify icon={'solar:arrow-right-up-bold' as any} width={15} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Container do Iframe Oficial */}
      <Box sx={{ position: 'relative', width: '100%', height: effectiveHeight }}>
        {isLoading && (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(26, 30, 42, 0.85)',
              zIndex: 1,
            }}
          />
        )}

        <Box
          component="iframe"
          title="TradingView Advanced Chart"
          src={embedUrl}
          onLoad={() => setIsLoading(false)}
          sx={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
            bgcolor: '#131722',
          }}
        />
      </Box>
    </Box>
  );
}
