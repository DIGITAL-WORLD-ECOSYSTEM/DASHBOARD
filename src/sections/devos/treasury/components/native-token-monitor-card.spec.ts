import { it, expect, describe } from 'vitest';

import { TOKEN_TIMEFRAME_DATA, type TimeframePeriod } from './native-token-monitor-card';
import { MOCK_TRADINGVIEW_DATA, type TradingViewTimeframe } from './tradingview-token-chart';

describe('NativeTokenMonitorCard — Regras de Monitoramento e Consistência de Dados', () => {
  const periods: TimeframePeriod[] = ['24H', '7D', '30D', '1A'];
  const tvTimeframes: TradingViewTimeframe[] = ['15m', '1h', '4h', '1D', '1W'];

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

  describe('TradingView Lightweight Charts — Validação de Velas Japonesas (OHLCV)', () => {
    it('deve conter séries temporais completas para todos os timeframes profissionais (15m, 1h, 4h, 1D, 1W)', () => {
      tvTimeframes.forEach((tf) => {
        const dataset = MOCK_TRADINGVIEW_DATA[tf];
        expect(dataset).toBeDefined();
        expect(dataset.length).toBeGreaterThan(0);
      });
    });

    it('deve validar consistência geométrica de cada vela japonesa (High >= Low e High >= Open/Close)', () => {
      tvTimeframes.forEach((tf) => {
        const dataset = MOCK_TRADINGVIEW_DATA[tf];
        dataset.forEach((candle) => {
          expect(candle.high).toBeGreaterThanOrEqual(candle.low);
          expect(candle.high).toBeGreaterThanOrEqual(candle.open);
          expect(candle.high).toBeGreaterThanOrEqual(candle.close);
          expect(candle.low).toBeLessThanOrEqual(candle.open);
          expect(candle.low).toBeLessThanOrEqual(candle.close);
          expect(candle.volume).toBeGreaterThan(0);
        });
      });
    });

    it('deve conter a vela de fechamento em 0.6355 no timeframe semanal correspondente ao print de mercado', () => {
      const dataset1w = MOCK_TRADINGVIEW_DATA['1W'];
      const lastCandle = dataset1w[dataset1w.length - 1];
      expect(lastCandle.close).toBe(0.6355);
      expect(lastCandle.high).toBe(1.05);
    });
  });
});
