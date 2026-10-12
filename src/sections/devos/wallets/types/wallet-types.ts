export type WalletTarget = 'dao' | 'clients';
export type CustodyType = 'WATCH_ONLY' | 'CUSTODIAL_LOCAL';
export type KycStatus = 'UNVERIFIED' | 'SIMULATED_TEST' | 'VERIFIED';

export interface DaoWallet {
  id: number;
  user: string;
  label: string;
  derivationPath: string;
  network: string;
  address: string;
  keyProvider: string;
  keyReference?: string | null;
  custodyType: CustodyType;
  status: 'ACTIVE' | 'PENDING' | 'ROTATED';
  kycStatus: KycStatus;
  balance: string;
  balanceStatus?: 'Confirmed' | 'Unavailable' | 'Loading' | 'InvalidAddress' | 'NetworkUnsupported';
  nonce?: number | null;
  selectedToken?: string;
  tokenBalances?: Record<string, string>;
  seedWordsCount?: number;
  createdAt?: string;
  vaultId?: string | null;
}

export interface ClientWallet {
  id: number;
  clientName: string;
  clientDoc: string;
  label: string;
  derivationPath: string;
  network: string;
  address: string;
  keyProvider: string;
  keyReference?: string | null;
  custodyType: CustodyType;
  status: 'ACTIVE' | 'PENDING';
  kycStatus: KycStatus;
  balance: string;
  balanceStatus?: 'Confirmed' | 'Unavailable' | 'Loading' | 'InvalidAddress' | 'NetworkUnsupported';
  nonce?: number | null;
  selectedToken?: string;
  tokenBalances?: Record<string, string>;
  seedWordsCount?: number;
  createdAt?: string;
  vaultId?: string | null;
}

export interface DerivedPreview {
  index: number;
  derivationPath: string;
  address: string;
  label: string;
  network: string;
}
