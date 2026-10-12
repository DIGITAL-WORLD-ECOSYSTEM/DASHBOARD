export interface SupportedNetwork {
  id: string;
  name: string;
  chainId: number;
  nativeSymbol: string;
  nativeDecimals: number;
  isEvm: boolean;
}

export const SUPPORTED_NETWORKS: SupportedNetwork[] = [
  {
    id: 'arbitrum',
    name: 'Arbitrum One',
    chainId: 42161,
    nativeSymbol: 'ETH',
    nativeDecimals: 18,
    isEvm: true,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    chainId: 1,
    nativeSymbol: 'ETH',
    nativeDecimals: 18,
    isEvm: true,
  },
  {
    id: 'polygon',
    name: 'Polygon',
    chainId: 137,
    nativeSymbol: 'POL',
    nativeDecimals: 18,
    isEvm: true,
  },
  {
    id: 'bsc',
    name: 'BNB Chain',
    chainId: 56,
    nativeSymbol: 'BNB',
    nativeDecimals: 18,
    isEvm: true,
  },
];

export const QUANTITY_OPTIONS = [1, 3, 5, 10, 50, 100];
export const SEED_LENGTH_OPTIONS = [12, 24];

export function getDerivationPath(target: 'dao' | 'clients', index: number): string {
  // Padrão BIP-44: m/44'/60'/account'/change/address_index
  // Para a DAO: branch institucional 0'
  // Para associados: cada cliente possui seu próprio cofre com semente independente e endereço principal 0
  const accountBranch = target === 'dao' ? 0 : 0;
  return `m/44'/60'/${accountBranch}'/0/${index}`;
}
