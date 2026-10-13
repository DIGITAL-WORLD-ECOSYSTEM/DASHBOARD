import { it, expect, describe } from 'vitest';

import { TOKEN_TIMEFRAME_DATA, type TimeframePeriod } from './native-token-monitor-card';
import {
  TRADINGVIEW_INTERVALS,
  buildTradingViewEmbedUrl,
  TRADINGVIEW_DEFAULT_SYMBOLS,
} from './tradingview-token-chart';

describe('NativeTokenMonitorCard — Regras de Monitoramento e Consistência de Dados', () => {
  const periods: TimeframePeriod[] = ['24H', '7D', '30D', '1A'];

  it('deve conter conjuntos de dados válidos para todos os períodos temporais suportados', () => {
    periods.forEach((period) => {
      const data = TOKEN_TIMEFRAME_DATA[period];
      expect(data).toBeDefined();
      expect(data.categories.length).toBeGreaterThan(0);
      expect(data.prices.length).toBe(data.categories.length);
      expect(data.volumes.length).toBe(data.categories.length);
      expect(data.changePercent).toBeDefined();
      expect(data.periodVolumeUsd).toBeGreaterThan(0);
    });
  });

  it('deve garantir que a máxima e a mínima de cada período coincidem com os extremos do array de preços', () => {
    periods.forEach((period) => {
      const data = TOKEN_TIMEFRAME_DATA[period];
      const maxPrice = Math.max(...data.prices);
      const minPrice = Math.min(...data.prices);

      expect(data.highPrice).toBeCloseTo(maxPrice, 3);
      expect(data.lowPrice).toBeCloseTo(minPrice, 3);
    });
  });

  it('deve registrar cotação do período 24H com último ponto em 0.6355 USD (correspondente ao par DEX)', () => {
    const data24h = TOKEN_TIMEFRAME_DATA['24H'];
    const currentPrice = data24h.prices[data24h.prices.length - 1];
    expect(currentPrice).toBe(0.6355);
  });

  it('deve assegurar que todos os volumes financeiros no período são positivos e não nulos', () => {
    periods.forEach((period) => {
      const data = TOKEN_TIMEFRAME_DATA[period];
      data.volumes.forEach((vol) => {
        expect(vol).toBeGreaterThan(0);
      });
    });
  });

  describe('TradingView Widget Oficial — Validação de Configurações e Construtor de URLs', () => {
    it('deve conter pares padrão incluindo ARBUSD para o ecossistema Arbitrum', () => {
      expect(TRADINGVIEW_DEFAULT_SYMBOLS.length).toBeGreaterThan(0);
      const arbSymbol = TRADINGVIEW_DEFAULT_SYMBOLS.find((s) => s.id === 'BINANCE:ARBUSDT');
      expect(arbSymbol).toBeDefined();
      expect(arbSymbol?.label).toBe('ARB/USDT');
    });

    it('deve fornecer timeframes padrão profissionais (15, 60, 240, D, W)', () => {
      expect(TRADINGVIEW_INTERVALS).toContain('15');
      expect(TRADINGVIEW_INTERVALS).toContain('60');
      expect(TRADINGVIEW_INTERVALS).toContain('240');
      expect(TRADINGVIEW_INTERVALS).toContain('D');
      expect(TRADINGVIEW_INTERVALS).toContain('W');
    });

    it('deve construir URL segura do TradingView widgetembed com parâmetros essenciais', () => {
      const url = buildTradingViewEmbedUrl({
        symbol: 'BINANCE:ARBUSDT',
        interval: 'D',
        theme: 'dark',
      });

      expect(url).toContain('https://s.tradingview.com/widgetembed/?');
      expect(url).toContain('symbol=BINANCE%3AARBUSDT');
      expect(url).toContain('interval=D');
      expect(url).toContain('theme=dark');
      expect(url).toContain('hidesidetoolbar=0');
      expect(url).toContain('symboledit=1');
      expect(url).toContain('saveimage=1');
      expect(url).toContain('style=1');
    });

    it('deve ajustar o toolbarbg de acordo com o tema claro e escuro', () => {
      const darkUrl = buildTradingViewEmbedUrl({ theme: 'dark' });
      const lightUrl = buildTradingViewEmbedUrl({ theme: 'light' });

      expect(darkUrl).toContain('toolbarbg=131722');
      expect(lightUrl).toContain('toolbarbg=f1f3f6');
    });
  });
});
