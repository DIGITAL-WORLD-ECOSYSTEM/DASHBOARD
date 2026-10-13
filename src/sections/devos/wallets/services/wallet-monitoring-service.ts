import type { WalletBalanceReport } from 'src/platform/desktop/wallets/wallet-bridge';

import { WalletBridge } from 'src/platform/desktop/wallets/wallet-bridge';

export interface WalletBalanceUpdate {
  address: string;
  balance: string;
  symbol: string;
  status: 'Confirmed' | 'Unavailable' | 'Loading' | 'InvalidAddress' | 'NetworkUnsupported';
  transactionCount?: number | null;
  lastUpdatedAt: string;
  errorMessage?: string;
}

export const WalletMonitoringService = {
  /**
   * Atualiza o saldo de uma carteira específica através do cliente RPC nativo Rust
   * Suporta saldo nativo e tokens ERC-20 (USDT / USDC) com verificação de nonce.
   */
  async updateWalletBalance(
    address: string,
    network: string,
    tokenSymbol?: string
  ): Promise<WalletBalanceUpdate> {
    try {
      const report: WalletBalanceReport = await WalletBridge.fetchWalletBalance(
        address,
        network,
        tokenSymbol
      );
      return {
        address,
        balance: report.formatted_balance,
        symbol: report.symbol,
        status: report.status,
        transactionCount: report.transaction_count,
        lastUpdatedAt: report.last_updated_at,
        errorMessage: report.error_message,
      };
    } catch (err: any) {
      return {
        address,
        balance: 'Indisponível (Erro RPC)',
        symbol: tokenSymbol || 'ETH',
        status: 'Unavailable',
        transactionCount: null,
        lastUpdatedAt: new Date().toISOString(),
        errorMessage: err?.message || 'Falha na consulta RPC',
      };
    }
  },

  /**
   * Consulta em lote os saldos de uma lista de carteiras via RPC
   */
  async updateBatchBalances(
    items: { address: string; network: string; tokenSymbol?: string }[]
  ): Promise<Map<string, WalletBalanceUpdate>> {
    const resultMap = new Map<string, WalletBalanceUpdate>();

    try {
      const reports = await WalletBridge.batchFetchWalletBalances(items);
      for (const r of reports) {
        resultMap.set(r.address.toLowerCase(), {
          address: r.address,
          balance: r.formatted_balance,
          symbol: r.symbol,
          status: r.status,
          transactionCount: r.transaction_count,
          lastUpdatedAt: r.last_updated_at,
          errorMessage: r.error_message,
        });
      }
    } catch {
      // Fallback em caso de erro na chamada em lote
      for (const item of items) {
        resultMap.set(item.address.toLowerCase(), {
          address: item.address,
          balance: 'Indisponível',
          symbol: item.tokenSymbol || 'ETH',
          status: 'Unavailable',
          transactionCount: null,
          lastUpdatedAt: new Date().toISOString(),
        });
      }
    }

    return resultMap;
  },
};
