import type { AuthUser, UserProfileViewModel } from 'src/auth/types';

// ======================================================================
// === TRANSFORMADORES PURAS (VIEW MODEL)                             ===
// === Isola as regras de negócio visuais de reconstrução Web3        ===
// ======================================================================

/**
 * Reconstrói e encurta o endereço da carteira a partir do DID do usuário.
 * Exemplo de DID: did:dao:asppibra:0xDfcE227bf1ffbbbec6410c2c2e22873293e6b56f
 */
export function extractWalletAddress(did?: string): string | undefined {
  if (!did) return undefined;
  
  // Extrai o endereço Ethereum (0x seguido de 40 caracteres hex)
  const match = did.match(/0x[a-fA-F0-9]{40}/i);
  if (match) {
    return match[0];
  }
  
  return undefined;
}

/**
 * Formata um endereço de carteira para exibição (ex: 0x1234...5678)
 */
export function formatWalletAddress(address?: string): string {
  if (!address || address.length !== 42) return 'Wallet Desconhecida';
  return `${address.slice(0, 7)}...${address.slice(-4)}`;
}

/**
 * Determina o nome de exibição do usuário (Single Source of Truth).
 * A hierarquia é:
 * 1. Nome Completo Real (Web2)
 * 2. Endereço da Carteira Encurtado (Web3)
 * 3. Username fallback
 * 4. 'Usuário'
 */
export function buildDisplayName(user: AuthUser | null): string {
  if (!user) return 'Usuário';

  // Se o backend gerou um nome no padrão Web3 (ou se o firstName começa com web3)
  // E o usuário tem um DID com uma carteira válida, extraímos a carteira.
  const walletAddress = extractWalletAddress(user.did);
  const isSyntheticWeb3Name = user.firstName?.toLowerCase().startsWith('web3 0x');

  if (walletAddress && (!user.firstName || isSyntheticWeb3Name)) {
    return formatWalletAddress(walletAddress);
  }

  // Nome convencional Web2
  if (user.firstName) {
    return `${user.firstName} ${user.lastName || ''}`.trim();
  }

  return user.email ? user.email.split('@')[0] : 'Usuário';
}

/**
 * Higieniza o e-mail de exibição.
 * Contas Web3 recebem e-mails hash gerados pelo sistema (ex: 12345@web3.com).
 * Para essas contas, retornamos a label amigável "Wallet".
 */
export function buildDisplayEmail(user: AuthUser | null): string {
  if (!user || !user.email) return 'Sem email';

  const lowerEmail = user.email.toLowerCase();
  if (lowerEmail.includes('@web3') || lowerEmail.includes('@eth')) {
    return 'Wallet';
  }

  return user.email;
}

/**
 * Determina se a sessão atual pertence puramente a uma carteira Web3.
 */
export function checkIsWeb3Account(user: AuthUser | null): boolean {
  if (!user) return false;
  return buildDisplayEmail(user) === 'Wallet' || !!extractWalletAddress(user.did);
}

/**
 * Cria a View Model completa do perfil do usuário para os componentes visuais.
 */
export function transformUserProfile(user: AuthUser | null): UserProfileViewModel {
  return {
    displayName: buildDisplayName(user),
    displayEmail: buildDisplayEmail(user),
    walletAddress: extractWalletAddress(user?.did),
    isWeb3Account: checkIsWeb3Account(user),
    photoURL: user?.photoURL,
  };
}
