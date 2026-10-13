import { describe, it, expect } from 'vitest';
import {
  sanitizeVaultError,
  isWithinCodePointLimit,
  getUnicodeLength,
  hasSpecialSymbol,
  estimatePasswordStrength,
  SPECIAL_SYMBOL_REGEX,
  MARGINAL_WHITESPACE_REGEX,
  MIN_MASTER_PASSWORD_LENGTH,
  MAX_MASTER_PASSWORD_LENGTH,
} from './vault-init-card';

describe('VaultInitCard — Tratamento de Erros, Validações e Conformidade Criptográfica', () => {
  describe('P1 — A & Sanitização de Erros Nativos (sanitizeVaultError)', () => {
    it('deve mapear VAULT_ERR_INIT_NOT_CONFIRMED para a mensagem precisa sem presumir o estado de persistência', () => {
      const error = new Error(
        'VAULT_ERR_INIT_NOT_CONFIRMED: O motor nativo do cofre não confirmou a inicialização.'
      );
      const result = sanitizeVaultError(error);

      expect(result).toBe(
        'Não foi possível confirmar o resultado da inicialização. Verifique o estado do cofre antes de tentar novamente.'
      );
      // Garante que NÃO afirma categoricamente que nada foi persistido
      expect(result).not.toContain('Nenhuma alteração foi persistida');
    });

    it('deve mapear VAULT_ERR_ALREADY_INITIALIZED sem presumir que outra senha foi utilizada', () => {
      const error = new Error('VAULT_ERR_ALREADY_INITIALIZED: O cofre já foi inicializado anteriormente.');
      const result = sanitizeVaultError(error);

      expect(result).toBe(
        'O cofre do DevOS já está inicializado. A operação foi bloqueada e nenhum cabeçalho existente foi substituído. Utilize o procedimento de acesso ao cofre já configurado.'
      );
      expect(result).not.toContain('outra senha');
    });

    it('deve mapear VAULT_ERR_INVALID_LENGTH exibindo os limites exatos (12 a 128)', () => {
      const error = new Error('VAULT_ERR_INVALID_LENGTH: A senha mestre deve possuir pelo menos 12 caracteres.');
      const result = sanitizeVaultError(error);

      expect(result).toBe(
        `A senha mestre deve conter entre ${MIN_MASTER_PASSWORD_LENGTH} e ${MAX_MASTER_PASSWORD_LENGTH} caracteres.`
      );
    });

    it('deve mapear VAULT_ERR_MARGINAL_WHITESPACE com explicação precisa de caracteres invisíveis', () => {
      const error = new Error('VAULT_ERR_MARGINAL_WHITESPACE: Caracteres invisíveis nas extremidades.');
      const result = sanitizeVaultError(error);

      expect(result).toBe(
        'A senha mestre não pode conter espaços, quebras de linha ou caracteres invisíveis no início ou no fim.'
      );
    });

    it('deve mapear VAULT_ERR_STORAGE sem expor caminhos internos de arquivos ou SQLite', () => {
      const error = new Error('VAULT_ERR_STORAGE: Falha ao acessar /home/user/.local/share/db: IO error');
      const result = sanitizeVaultError(error);

      expect(result).toBe(
        'Falha de persistência no armazenamento seguro local. Verifique as permissões de gravação no disco.'
      );
      expect(result).not.toContain('/home/user');
    });

    it('deve mapear VAULT_ERR_CRYPTO para falha de derivação Argon2id', () => {
      const error = new Error('VAULT_ERR_CRYPTO: Argon2 parameter error');
      const result = sanitizeVaultError(error);

      expect(result).toBe(
        'Falha no motor criptográfico durante a derivação de chave Argon2id.'
      );
    });

    it('deve retornar mensagem genérica segura para erros desconhecidos', () => {
      const error = new Error('UnknownFatalKernelPanic');
      const result = sanitizeVaultError(error);

      expect(result).toBe(
        'Falha operacional ao inicializar o cofre. Verifique a integridade do ambiente antes de tentar novamente.'
      );
    });
  });

  describe('Proteção Anti-DoS e Contagem de Code Points (isWithinCodePointLimit)', () => {
    it('deve aceitar strings dentro do limite de 128 code points', () => {
      const validPass = 'A'.repeat(128);
      expect(isWithinCodePointLimit(validPass, 128)).toBe(true);
    });

    it('deve rejeitar e abortar antecipadamente strings que excedem 128 code points sem alocar array', () => {
      const massiveInput = 'B'.repeat(100_000); // 100k caracteres
      expect(isWithinCodePointLimit(massiveInput, 128)).toBe(false);
    });

    it('deve contar corretamente caracteres multibyte Unicode e emojis sem quebrar surrogate pairs', () => {
      const emojis = '🔐'.repeat(128); // 128 emojis de cofre
      expect(isWithinCodePointLimit(emojis, 128)).toBe(true);
      expect(getUnicodeLength(emojis)).toBe(128);

      const excessEmojis = '🔐'.repeat(129);
      expect(isWithinCodePointLimit(excessEmojis, 128)).toBe(false);
    });
  });

  describe('Validação Rigorosa de Caracteres Invisíveis e Marginais (MARGINAL_WHITESPACE_REGEX)', () => {
    it('deve detectar espaço comum no início ou no fim', () => {
      expect(MARGINAL_WHITESPACE_REGEX.test(' senhaValida123#')).toBe(true);
      expect(MARGINAL_WHITESPACE_REGEX.test('senhaValida123# ')).toBe(true);
    });

    it('deve detectar quebras de linha (\\n, \\r, \\t)', () => {
      expect(MARGINAL_WHITESPACE_REGEX.test('\tsenhaValida123#')).toBe(true);
      expect(MARGINAL_WHITESPACE_REGEX.test('senhaValida123#\n')).toBe(true);
    });

    it('deve detectar Next Line (U+0085)', () => {
      expect(MARGINAL_WHITESPACE_REGEX.test('\u0085senhaValida123#')).toBe(true);
      expect(MARGINAL_WHITESPACE_REGEX.test('senhaValida123#\u0085')).toBe(true);
    });

    it('deve detectar Byte Order Mark (U+FEFF)', () => {
      expect(MARGINAL_WHITESPACE_REGEX.test('\uFEFFsenhaValida123#')).toBe(true);
      expect(MARGINAL_WHITESPACE_REGEX.test('senhaValida123#\uFEFF')).toBe(true);
    });

    it('deve detectar Zero-Width Space (U+200B)', () => {
      expect(MARGINAL_WHITESPACE_REGEX.test('\u200BsenhaValida123#')).toBe(true);
      expect(MARGINAL_WHITESPACE_REGEX.test('senhaValida123#\u200B')).toBe(true);
    });

    it('deve detectar Non-Breaking Space (U+00A0)', () => {
      expect(MARGINAL_WHITESPACE_REGEX.test('\u00A0senhaValida123#')).toBe(true);
      expect(MARGINAL_WHITESPACE_REGEX.test('senhaValida123#\u00A0')).toBe(true);
    });

    it('deve aceitar senhas limpas com caracteres especiais ou espaços intermediários', () => {
      expect(MARGINAL_WHITESPACE_REGEX.test('Senha Segura Institucional #2026')).toBe(false);
      expect(MARGINAL_WHITESPACE_REGEX.test('Cofre-Forte_987@#$!')).toBe(false);
    });
  });

  describe('Detecção Precisa de Símbolos Especiais e Estimativa de Robustez (hasSpecialSymbol & estimatePasswordStrength)', () => {
    it('deve reconhecer pontuação e símbolos Unicode como símbolos especiais válidos', () => {
      expect(hasSpecialSymbol('!@#$%^&*()_+')).toBe(true);
      expect(hasSpecialSymbol('senha-com-hifen')).toBe(true);
      expect(hasSpecialSymbol('senha_com_underline')).toBe(true);
      expect(hasSpecialSymbol('€500EuroValor')).toBe(true);
      expect(hasSpecialSymbol('parágrafo§simbolo')).toBe(true);
      expect(SPECIAL_SYMBOL_REGEX.test('©2026')).toBe(true);
    });

    it('NÃO deve considerar espaços comuns, tabs ou quebras de linha como símbolos especiais', () => {
      expect(hasSpecialSymbol(' ')).toBe(false);
      expect(hasSpecialSymbol('\t')).toBe(false);
      expect(hasSpecialSymbol('\n')).toBe(false);
      expect(hasSpecialSymbol('minha senha mestre institucional')).toBe(false);
      expect(hasSpecialSymbol('somenteletras')).toBe(false);
      expect(hasSpecialSymbol('1234567890')).toBe(false);
    });

    it('deve diferenciar pontuação na estimativa de robustez sem inflar frases-senha puras', () => {
      // Frase-senha com 28 caracteres, maiúsculas, minúsculas e espaços, mas SEM pontuação/símbolos
      const passphraseWithoutSymbols = 'Minha Senha Mestre Institucional';
      expect(hasSpecialSymbol(passphraseWithoutSymbols)).toBe(false);

      const strengthSemSimbolos = estimatePasswordStrength(passphraseWithoutSymbols);

      // Frase-senha com símbolo especial real no final
      const passphraseWithSymbol = 'Minha Senha Mestre Institucional!';
      expect(hasSpecialSymbol(passphraseWithSymbol)).toBe(true);

      const strengthComSimbolos = estimatePasswordStrength(passphraseWithSymbol);

      // A versão com símbolo especial deve ter pontuação maior ou igual
      expect(strengthComSimbolos.score).toBeGreaterThanOrEqual(strengthSemSimbolos.score);
    });

    it('deve classificar senha curta (< 12) como Muito Curta independentemente de caracteres', () => {
      const shortPass = 'Senha!123';
      const strength = estimatePasswordStrength(shortPass);
      expect(strength.score).toBe(20);
      expect(strength.label).toContain('Muito Curta');
      expect(strength.color).toBe('error');
    });
  });
});
