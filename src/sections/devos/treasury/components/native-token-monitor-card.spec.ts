import { it, expect, describe } from 'vitest';

import { TOKEN_TIMEFRAME_DATA, type TimeframePeriod } from './native-token-monitor-card';

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

  it('deve registrar cotação do período 24H com último ponto em 1.00 USD (paridade estável do ecossistema)', () => {
    const data24h = TOKEN_TIMEFRAME_DATA['24H'];
    const currentPrice = data24h.prices[data24h.prices.length - 1];
    expect(currentPrice).toBe(1.0);
  });

  it('deve assegurar que todos os volumes financeiros no período são positivos e não nulos', () => {
    periods.forEach((period) => {
      const data = TOKEN_TIMEFRAME_DATA[period];
      data.volumes.forEach((vol) => {
        expect(vol).toBeGreaterThan(0);
      });
    });
  });
});
