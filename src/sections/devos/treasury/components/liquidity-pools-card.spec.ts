import { it, expect, describe } from 'vitest';

import { MOCK_LIQUIDITY_POOLS, type LiquidityPoolItem } from './liquidity-pools-card';

describe('LiquidityPoolsCard — Consistência de Dados e Pools de Liquidez ASPPBR', () => {
  it('deve conter as 3 pools oficiais registradas no ecossistema Arbitrum e DAO', () => {
    expect(MOCK_LIQUIDITY_POOLS).toBeDefined();
    expect(MOCK_LIQUIDITY_POOLS.length).toBe(3);

    const poolIds = MOCK_LIQUIDITY_POOLS.map((p) => p.id);
    expect(poolIds).toContain('POOL-001');
    expect(poolIds).toContain('POOL-002');
    expect(poolIds).toContain('POOL-003');
  });

  it('deve conter pares essenciais de liquidez (USDT, WETH e BRL)', () => {
    const pairs = MOCK_LIQUIDITY_POOLS.map((p) => p.pair);
    expect(pairs).toContain('ASPPBR / USDT');
    expect(pairs).toContain('ASPPBR / WETH');
    expect(pairs).toContain('ASPPBR / BRL');
  });

  it('deve validar consistência financeira das pools (TVL positivo, Volume 24h e Cotação a 0.6355)', () => {
    MOCK_LIQUIDITY_POOLS.forEach((pool: LiquidityPoolItem) => {
      expect(pool.tvlUsd).toBeGreaterThan(0);
      expect(pool.volume24hUsd).toBeGreaterThan(0);
      expect(pool.priceUsd).toBe(0.6355);
      expect(pool.contractAddress).toMatch(/^0x[a-fA-F0-9.]+/);
      expect(pool.tokenRatio).toBeGreaterThanOrEqual(0);
      expect(pool.tokenRatio).toBeLessThanOrEqual(100);
      expect(pool.aprPercent).toBeGreaterThan(0);
    });
  });

  it('deve conter endereços de contrato válidos e redes compatíveis com Arbitrum One', () => {
    MOCK_LIQUIDITY_POOLS.forEach((pool: LiquidityPoolItem) => {
      expect(pool.network).toBe('Arbitrum One');
      expect(pool.dexName.length).toBeGreaterThan(0);
      expect(pool.feeTier.length).toBeGreaterThan(0);
    });
  });
});
