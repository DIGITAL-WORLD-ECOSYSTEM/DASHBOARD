import type { AccountData } from '../types';

import { useState, useEffect, useCallback } from 'react';

import axiosInstance, { endpoints } from 'src/lib/axios';

import { MOCK_ACCOUNTS } from '../mocks';

export function useBankAccount() {
  const [accounts, setAccounts] = useState<AccountData[]>(MOCK_ACCOUNTS);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Iniciar com os dados base
      let currentAccounts = [...MOCK_ACCOUNTS];

      // 2. Tentar consultar a carteira Web3 ativa conectada na API canônica (/api/v1/web3/wallets/active)
      const activeWalletRes = await axiosInstance.get(endpoints.web3.activeWallet).catch(() => null);

      if (activeWalletRes?.data?.success && activeWalletRes.data?.data) {
        const activeWallet = activeWalletRes.data.data;
        const walletAddress = activeWallet.address;

        // 3. Consultar o saldo real on-chain na BSC Mainnet (/api/v1/web3/wallets/:address/balance)
        const balanceRes = await axiosInstance
          .get(endpoints.web3.balance(walletAddress))
          .catch(() => null);

        let bnbBalance = 0;
        let usdtBalance = 0;

        if (balanceRes?.data?.success && balanceRes.data?.data) {
          const balanceData = balanceRes.data.data;
          bnbBalance = parseFloat(balanceData.native?.balanceFormatted || '0');

          const usdtToken = balanceData.tokens?.find(
            (t: any) => t.symbol?.toUpperCase() === 'USDT'
          );
          if (usdtToken) {
            usdtBalance = parseFloat(usdtToken.balanceFormatted || '0');
          }
        }

        // 4. Integrar dinamicamente a conta Web3 com dados reais de produção
        currentAccounts = currentAccounts.map((acc) => {
          if (acc.type === 'web3') {
            return {
              ...acc,
              status: 'Ativa',
              label: 'Carteira Custodial BSC (On-Chain)',
              web3Addresses: [
                {
                  id: activeWallet.id || 'w-custodial-bsc',
                  network: 'BNB Smart Chain (Mainnet)',
                  address: walletAddress,
                  icon: 'logos:binance',
                  isFavorite: true,
                },
                ...(acc.web3Addresses?.filter((w) => w.address !== walletAddress) || []),
              ],
              balances: [
                {
                  id: 'b-usdt',
                  asset: 'USDT',
                  name: 'Tether USD (BEP-20)',
                  icon: 'cryptocurrency-color:usdt',
                  available: usdtBalance,
                  blocked: 0,
                  inLiquidation: 0,
                  fiatValue: usdtBalance * 5.65,
                },
                {
                  id: 'b-bnb',
                  asset: 'BNB',
                  name: 'Binance Coin (Nativo)',
                  icon: 'cryptocurrency-color:bnb',
                  available: bnbBalance,
                  blocked: 0,
                  inLiquidation: 0,
                  fiatValue: bnbBalance * 3450,
                },
              ],
            };
          }
          return acc;
        });
      }

      setAccounts(currentAccounts);
    } catch (error) {
      console.error('Falha ao conectar contas com o backend:', error);
      setAccounts(MOCK_ACCOUNTS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return { accounts, isLoading, refetch: fetchAccounts };
}
