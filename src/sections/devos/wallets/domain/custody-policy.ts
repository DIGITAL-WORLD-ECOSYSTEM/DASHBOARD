/**
 * Políticas de Custódia Segregada e Segurança do Cofre DevOS
 *
 * REGRAS CRÍTICAS:
 * 1. A Tesouraria da DAO e os Associados NUNCA compartilham a mesma semente mnemônica.
 * 2. Cada associado possui um cofre criptográfico independente gerado com entropia própria.
 * 3. Todas as operações com material secreto (geração, derivação, cifragem)
 *    ocorrem no núcleo Rust nativo.
 * 4. A senha mestre nunca é enviada pela rede nem gravada em texto puro.
 */

export const CUSTODY_RULES = {
  MIN_MASTER_PASSWORD_LENGTH: 8,
  ALGORITHM_KDF: 'Argon2id (m=64MB, t=3, p=1)',
  ALGORITHM_CIPHER: 'AES-256-GCM (AEAD 96-bit nonce, 128-bit tag)',
  BIP_STANDARDS: ['BIP-39 (Mnemonic)', 'BIP-32 (HD Derivation)', 'BIP-44 (Multi-Account)', 'EIP-55 (Checksum)'],
};

export function validateMasterPassword(password: string): { isValid: boolean; error?: string } {
  if (!password || password.trim().length < CUSTODY_RULES.MIN_MASTER_PASSWORD_LENGTH) {
    return {
      isValid: false,
      error: `A senha mestre deve possuir pelo menos ${CUSTODY_RULES.MIN_MASTER_PASSWORD_LENGTH} caracteres.`,
    };
  }
  return { isValid: true };
}
