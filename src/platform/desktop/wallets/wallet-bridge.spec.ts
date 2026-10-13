import { it, vi, expect, describe, afterEach, beforeEach } from 'vitest';

import { WalletBridge, isTauriDesktop } from './wallet-bridge';

describe('WalletBridge — IPC Native Contract & Return Correspondence', () => {
  const originalWindow = (globalThis as any).window;

  beforeEach(() => {
    vi.restoreAllMocks();
    (globalThis as any).window = globalThis;
  });

  afterEach(() => {
    delete (globalThis as any).__TAURI_INTERNALS__;
    (globalThis as any).window = originalWindow;
  });

  describe('isTauriDesktop', () => {
    it('deve retornar false quando __TAURI_INTERNALS__ não estiver definido (ambiente web browser)', () => {
      delete (globalThis as any).__TAURI_INTERNALS__;
      expect(isTauriDesktop()).toBe(false);
    });

    it('deve retornar true quando __TAURI_INTERNALS__ estiver presente (ambiente Tauri v2)', () => {
      (globalThis as any).__TAURI_INTERNALS__ = { invoke: vi.fn() };
      expect(isTauriDesktop()).toBe(true);
    });
  });

  describe('initMasterPassword — Contrato de retorno booleano e tratamento de erros', () => {
    it('deve retornar exatamente true (boolean) quando o comando Rust nativo retornar Ok(true)', async () => {
      const mockInvoke = vi.fn().mockResolvedValue(true);
      (globalThis as any).__TAURI_INTERNALS__ = { invoke: mockInvoke };

      const result = await WalletBridge.initMasterPassword('SenhaSeguraInstitucional#2026');

      expect(mockInvoke).toHaveBeenCalledTimes(1);
      expect(mockInvoke).toHaveBeenCalledWith('init_master_password', {
        masterPassword: 'SenhaSeguraInstitucional#2026',
      });
      expect(result).toBe(true);
      expect(typeof result).toBe('boolean');
    });

    it('deve propagar o valor booleano exato sem perda (preservação estrita de tipo pela ponte IPC)', async () => {
      const mockInvoke = vi.fn().mockResolvedValue(false);
      (globalThis as any).__TAURI_INTERNALS__ = { invoke: mockInvoke };

      const result = await WalletBridge.initMasterPassword('SenhaQualquer#2026');

      expect(result).toBe(false);
      expect(typeof result).toBe('boolean');
    });

    it('deve lançar erro tipado [Rust Core Error] quando o comando Rust nativo rejeitar com VAULT_ERR_ALREADY_INITIALIZED', async () => {
      const mockInvoke = vi.fn().mockRejectedValue(
        'VAULT_ERR_ALREADY_INITIALIZED: O cofre já foi inicializado anteriormente.'
      );
      (globalThis as any).__TAURI_INTERNALS__ = { invoke: mockInvoke };

      await expect(
        WalletBridge.initMasterPassword('NovaSenha#2026')
      ).rejects.toThrow(
        '[Rust Core Error] VAULT_ERR_ALREADY_INITIALIZED: O cofre já foi inicializado anteriormente.'
      );
    });

    it('deve lançar erro tipado [Rust Core Error] quando o comando Rust nativo rejeitar com VAULT_ERR_STORAGE', async () => {
      const mockInvoke = vi.fn().mockRejectedValue(
        'VAULT_ERR_STORAGE: Falha ao acessar armazenamento local: disco cheio'
      );
      (globalThis as any).__TAURI_INTERNALS__ = { invoke: mockInvoke };

      await expect(
        WalletBridge.initMasterPassword('SenhaForte#2026')
      ).rejects.toThrow('[Rust Core Error] VAULT_ERR_STORAGE');
    });

    it('deve rejeitar se executado fora do ambiente Tauri nativo', async () => {
      delete (globalThis as any).__TAURI_INTERNALS__;

      await expect(
        WalletBridge.initMasterPassword('SenhaForte#2026')
      ).rejects.toThrow(
        "Ambiente não suportado: A operação 'init_master_password' requer execução dentro do executável nativo Desktop (Tauri)."
      );
    });
  });
});
