import { it, expect, describe } from 'vitest';

import { MOCK_TOKEN_HOLDERS, type TokenHolderItem } from './token-holders-card';

describe('TokenHoldersCard — Monitoramento de Carteiras e Consistência de Dados', () => {
  it('deve conter 5 principais carteiras no monitor de holders', () => {
    expect(MOCK_TOKEN_HOLDERS).toBeDefined();
    expect(MOCK_TOKEN_HOLDERS.length).toBe(5);
  });

  it('deve validar consistência patrimonial de cada carteira monitorada', () => {
    MOCK_TOKEN_HOLDERS.forEach((holder: TokenHolderItem) => {
      expect(holder.id).toMatch(/^HOLDER-\d{2}$/);
      expect(holder.label.length).toBeGreaterThan(0);
      expect(holder.address).toMatch(/^0x[a-fA-F0-9.]+/);
      expect(holder.balanceTokens).toBeGreaterThan(0);
      expect(holder.sharePercent).toBeGreaterThan(0);
      expect(holder.sharePercent).toBeLessThanOrEqual(100);
      expect(holder.categoryLabel.length).toBeGreaterThan(0);
    });
  });

  it('deve assegurar soma coerente das participações dos top 5 detentores (72.5% do total)', () => {
    const totalShare = MOCK_TOKEN_HOLDERS.reduce((acc, curr) => acc + curr.sharePercent, 0);
    expect(totalShare).toBeCloseTo(72.5, 1);

    const totalTokens = MOCK_TOKEN_HOLDERS.reduce((acc, curr) => acc + curr.balanceTokens, 0);
    expect(totalTokens).toBe(7250000);
  });

  it('deve conter o cofre Safe DAO e o contrato de staking entre os maiores detentores', () => {
    const safeHolder = MOCK_TOKEN_HOLDERS.find((h) => h.category === 'SAFE');
    const stakingHolder = MOCK_TOKEN_HOLDERS.find((h) => h.category === 'STAKING');

    expect(safeHolder).toBeDefined();
    expect(safeHolder?.balanceTokens).toBe(1000000);

    expect(stakingHolder).toBeDefined();
    expect(stakingHolder?.balanceTokens).toBe(3450000);
  });
});
