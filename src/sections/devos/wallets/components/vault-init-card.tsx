import type { FormEvent } from 'react';
import type { IconifyName } from 'src/components/iconify';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { WalletBridge } from 'src/platform/desktop/wallets/wallet-bridge';
import { Iconify } from 'src/components/iconify';

export const MIN_MASTER_PASSWORD_LENGTH = 12;
export const MAX_MASTER_PASSWORD_LENGTH = 128;

// Cobre rigorosamente espaços, tabs, quebras de linha e caracteres invisíveis:
// \s (espaços comuns, tabs, LF, CR), \u0085 (Next Line), \uFEFF (BOM), \u200B (Zero-Width Space) e \u00A0 (NBSP)
export const MARGINAL_WHITESPACE_REGEX = /^[\s\u0085\uFEFF\u200B\u00A0]|[\s\u0085\uFEFF\u200B\u00A0]$/;

// Regex de pontuações e símbolos Unicode estritos (impede que espaços comuns ou quebras de linha contem como símbolos)
export const SPECIAL_SYMBOL_REGEX = /[\p{P}\p{S}]/u;

export function hasSpecialSymbol(str: string): boolean {
  return SPECIAL_SYMBOL_REGEX.test(str);
}

interface VaultInitCardProps {
  isInitialized: boolean;
  isLoadingStorage?: boolean;
  onSuccess: () => Promise<void> | void;
}

interface StrengthEvaluation {
  score: number;
  label: string;
  color: 'error' | 'warning' | 'info' | 'success';
}

/**
 * Validação limitada que interrompe a iteração assim que o limite de caracteres Unicode é excedido,
 * evitando alocação de arrays gigantescos na memória em caso de colagem excessiva (Anti-DoS).
 */
export function isWithinCodePointLimit(value: string, maxLength: number): boolean {
  let count = 0;
  for (const _char of value) {
    count += 1;
    if (count > maxLength) {
      return false;
    }
  }
  return true;
}

/**
 * Calcula a quantidade de pontos de código Unicode reais (Code Points), idêntico a String::chars().count() no Rust.
 */
export function getUnicodeLength(str: string): number {
  return [...str].length;
}

/**
 * Sanitiza e mapeia códigos de erro estáveis retornados pelo Rust Core.
 * Impede que caminhos de arquivos, detalhes internos do SO ou do SQLite sejam exibidos na interface.
 */
export function sanitizeVaultError(error: unknown): string {
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : error && typeof error === 'object' && 'message' in error
          ? String((error as { message: unknown }).message)
          : '';

  if (raw.includes('VAULT_ERR_ALREADY_INITIALIZED') || /já foi inicializado|AlreadyInitialized/i.test(raw)) {
    return 'O cofre do DevOS já está inicializado. A operação foi bloqueada e nenhum cabeçalho existente foi substituído. Utilize o procedimento de acesso ao cofre já configurado.';
  }
  if (raw.includes('VAULT_ERR_INVALID_LENGTH') || /pelo menos 12 caracteres/i.test(raw)) {
    return `A senha mestre deve conter entre ${MIN_MASTER_PASSWORD_LENGTH} e ${MAX_MASTER_PASSWORD_LENGTH} caracteres.`;
  }
  if (raw.includes('VAULT_ERR_MARGINAL_WHITESPACE') || /espaços.*extremidades|espaços ou quebras de linha/i.test(raw)) {
    return 'A senha mestre não pode conter espaços, quebras de linha ou caracteres invisíveis no início ou no fim.';
  }
  if (raw.includes('VAULT_ERR_INIT_NOT_CONFIRMED')) {
    return 'Não foi possível confirmar o resultado da inicialização. Verifique o estado do cofre antes de tentar novamente.';
  }
  if (raw.includes('VAULT_ERR_STORAGE') || /SQLite|DatabaseError|IO error/i.test(raw)) {
    return 'Falha de persistência no armazenamento seguro local. Verifique as permissões de gravação no disco.';
  }
  if (raw.includes('VAULT_ERR_CRYPTO')) {
    return 'Falha no motor criptográfico durante a derivação de chave Argon2id.';
  }

  return 'Falha operacional ao inicializar o cofre. Verifique a integridade do ambiente antes de tentar novamente.';
}

/**
 * Avalia de forma transparente a robustez da senha informada com suporte nativo a Unicode (\p{L}, \p{N}, \p{P}, \p{S}).
 * Nota: Isto é um estimador visual para guiar o operador, não uma prova formal de entropia.
 */
export function estimatePasswordStrength(pass: string): StrengthEvaluation {
  const length = getUnicodeLength(pass);
  if (length === 0) {
    return { score: 0, label: 'Não informada', color: 'error' };
  }

  // Detecção de repetições e sequências triviais conhecidas
  const hasRepeatingChars = /(.)\1{3,}/u.test(pass);
  const isTrivialSequence = /12345|abcdef|qwerty|password|asppibra|admin/i.test(pass);

  let points = 0;

  if (length >= MIN_MASTER_PASSWORD_LENGTH) points += 2;
  if (length >= 16) points += 2;

  // Suporte a alfabetos Unicode (maiúsculas, minúsculas e números)
  if (/\p{Ll}/u.test(pass) && /\p{Lu}/u.test(pass)) points += 1;
  if (/\p{N}/u.test(pass)) points += 1;
  // Símbolos especiais reais (pontuação e símbolos Unicode - exclui espaços)
  if (hasSpecialSymbol(pass)) points += 2;

  if (hasRepeatingChars || isTrivialSequence) {
    points = Math.max(1, points - 2);
  }

  if (length < MIN_MASTER_PASSWORD_LENGTH) {
    return {
      score: 20,
      label: `Muito Curta (Mínimo ${MIN_MASTER_PASSWORD_LENGTH} caracteres)`,
      color: 'error',
    };
  }

  if (points <= 3) {
    return { score: 40, label: 'Fraca / Previsível', color: 'error' };
  }
  if (points <= 5) {
    return { score: 70, label: 'Razoável', color: 'warning' };
  }
  if (points <= 7) {
    return { score: 85, label: 'Forte (Recomendada)', color: 'info' };
  }

  return { score: 100, label: 'Excelente / Alta Robustez', color: 'success' };
}

export function VaultInitCard({
  isInitialized,
  isLoadingStorage = false,
  onSuccess,
}: VaultInitCardProps) {
  // ---------------------------------------------------------------------------
  // 1. Definição Estrita de Hooks no Topo Incondicional (Regra P0)
  // ---------------------------------------------------------------------------
  const [initialMasterPassword, setInitialMasterPassword] = useState('');
  const [confirmMasterPassword, setConfirmMasterPassword] = useState('');
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isInitializingVault, setIsInitializingVault] = useState(false);
  const [isLocallyInitialized, setIsLocallyInitialized] = useState(false);

  const [localAlert, setLocalAlert] = useState<{
    severity: 'error' | 'warning' | 'info' | 'success';
    message: string;
  } | null>(null);

  // Trava síncrona contra chamadas concorrentes
  const isSubmittingRef = useRef(false);

  // Higiene de memória e limpeza reativa caso o cofre seja inicializado
  useEffect(() => {
    if (isInitialized || isLocallyInitialized) {
      setInitialMasterPassword('');
      setConfirmMasterPassword('');
      setShowMasterPassword(false);
      setShowConfirmPassword(false);
      setLocalAlert(null);
    }
  }, [isInitialized, isLocallyInitialized]);

  // ---------------------------------------------------------------------------
  // 2. Validação Centralizada e Compatível (Unicode Code Points + Whitespace)
  // ---------------------------------------------------------------------------
  const passwordLength = useMemo(() => getUnicodeLength(initialMasterPassword), [initialMasterPassword]);

  const passwordStrength = useMemo(
    () => estimatePasswordStrength(initialMasterPassword),
    [initialMasterPassword]
  );

  // Desacoplamento estrito de validação de whitespace por campo (P1 - 2 e P1 - 4)
  const passwordHasMarginalWhitespace = useMemo(
    () => MARGINAL_WHITESPACE_REGEX.test(initialMasterPassword),
    [initialMasterPassword]
  );

  const confirmHasMarginalWhitespace = useMemo(
    () => MARGINAL_WHITESPACE_REGEX.test(confirmMasterPassword),
    [confirmMasterPassword]
  );

  const hasLettersAndNumbers = useMemo(
    () => /\p{N}/u.test(initialMasterPassword) && /\p{L}/u.test(initialMasterPassword),
    [initialMasterPassword]
  );

  const hasSpecialChar = useMemo(
    () => hasSpecialSymbol(initialMasterPassword),
    [initialMasterPassword]
  );

  const validation = useMemo(() => {
    const lengthOk =
      passwordLength >= MIN_MASTER_PASSWORD_LENGTH &&
      passwordLength <= MAX_MASTER_PASSWORD_LENGTH;

    const passwordsMatch = initialMasterPassword === confirmMasterPassword;
    const hasConfirmation = confirmMasterPassword.length > 0;

    let errorMessage: string | null = null;

    if (passwordHasMarginalWhitespace || confirmHasMarginalWhitespace) {
      errorMessage = 'A senha mestra não pode conter espaços, quebras de linha ou caracteres invisíveis nas extremidades.';
    } else if (passwordLength > 0 && passwordLength < MIN_MASTER_PASSWORD_LENGTH) {
      errorMessage = `A senha mestra deve conter no mínimo ${MIN_MASTER_PASSWORD_LENGTH} caracteres.`;
    } else if (passwordLength > MAX_MASTER_PASSWORD_LENGTH) {
      errorMessage = `A senha mestra não pode exceder ${MAX_MASTER_PASSWORD_LENGTH} caracteres.`;
    } else if (hasConfirmation && !passwordsMatch) {
      errorMessage = 'A confirmação de senha não coincide exatamente com a senha informada.';
    }

    const canSubmit =
      lengthOk &&
      passwordsMatch &&
      !passwordHasMarginalWhitespace &&
      !confirmHasMarginalWhitespace &&
      !isInitializingVault;

    return {
      canSubmit,
      passwordsMatch: !hasConfirmation || passwordsMatch,
      passwordHasMarginalWhitespace,
      confirmHasMarginalWhitespace,
      errorMessage,
    };
  }, [
    initialMasterPassword,
    confirmMasterPassword,
    passwordLength,
    passwordHasMarginalWhitespace,
    confirmHasMarginalWhitespace,
    isInitializingVault,
  ]);

  // Limite estrito na digitação/colagem com interrupção rápida (Anti-DoS sem alocação proporcional)
  const handlePasswordChange = useCallback((value: string) => {
    if (!isWithinCodePointLimit(value, MAX_MASTER_PASSWORD_LENGTH)) {
      setLocalAlert({
        severity: 'warning',
        message: `A senha mestra não pode exceder ${MAX_MASTER_PASSWORD_LENGTH} caracteres.`,
      });
      return;
    }
    // Remove alerta transitório de limite ao retornar para entrada válida
    setLocalAlert((prev) => (prev?.severity === 'warning' ? null : prev));
    setInitialMasterPassword(value);
  }, []);

  const handleConfirmChange = useCallback((value: string) => {
    if (!isWithinCodePointLimit(value, MAX_MASTER_PASSWORD_LENGTH)) {
      setLocalAlert({
        severity: 'warning',
        message: `A confirmação de senha não pode exceder ${MAX_MASTER_PASSWORD_LENGTH} caracteres.`,
      });
      return;
    }
    // Remove alerta transitório de limite ao retornar para entrada válida
    setLocalAlert((prev) => (prev?.severity === 'warning' ? null : prev));
    setConfirmMasterPassword(value);
  }, []);

  // ---------------------------------------------------------------------------
  // 3. Submissão Segura com Verificação Explícita de Confirmação (P1 - 1)
  // ---------------------------------------------------------------------------
  const handleInitVault = useCallback(
    async (e?: FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      if (isSubmittingRef.current || isInitializingVault) {
        return;
      }

      if (!validation.canSubmit) {
        if (validation.errorMessage) {
          setLocalAlert({ severity: 'error', message: validation.errorMessage });
        }
        return;
      }

      isSubmittingRef.current = true;
      setIsInitializingVault(true);
      setLocalAlert(null);

      // FASE 1: Execução Criptográfica no Rust Core (Tauri IPC)
      try {
        const initialized = await WalletBridge.initMasterPassword(initialMasterPassword);
        // Confirmação explícita de retorno estritamente verdadeiro
        if (initialized !== true) {
          throw new Error('VAULT_ERR_INIT_NOT_CONFIRMED: O motor nativo do cofre não confirmou a inicialização.');
        }
      } catch (err: unknown) {
        // Reporta o erro real sanitizado sem expor detalhes internos
        setLocalAlert({
          severity: 'error',
          message: sanitizeVaultError(err),
        });
        isSubmittingRef.current = false;
        setIsInitializingVault(false);
        return;
      }

      // FASE 2: Pós-inicialização (Proteção de estado local e limpeza de memória)
      setIsLocallyInitialized(true);
      setInitialMasterPassword('');
      setConfirmMasterPassword('');

      try {
        await onSuccess();
      } catch {
        setLocalAlert({
          severity: 'warning',
          message:
            'O cofre foi inicializado e selado com sucesso no disco, porém ocorreu uma falha ao atualizar a listagem de carteiras. Por favor, atualize a página.',
        });
      } finally {
        isSubmittingRef.current = false;
        setIsInitializingVault(false);
      }
    },
    [initialMasterPassword, isInitializingVault, onSuccess, validation]
  );

  // ---------------------------------------------------------------------------
  // 4. Retorno Condicional APÓS todos os Hooks registrados
  // ---------------------------------------------------------------------------
  if (isInitialized || isLocallyInitialized || isLoadingStorage) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // 5. Interface com Formulário Semântico, Acessibilidade e Controles Estritos
  // ---------------------------------------------------------------------------
  return (
    <Card
      sx={{
        p: 3,
        bgcolor: (theme) => alpha(theme.palette.warning.main, 0.05),
        border: (theme) => `1px solid ${alpha(theme.palette.warning.main, 0.35)}`,
        borderRadius: 2,
        boxShadow: (theme) => `0 4px 20px 0 ${alpha(theme.palette.warning.main, 0.1)}`,
      }}
    >
      <Stack spacing={2.5}>
        {/* Cabeçalho Institucional de Alerta */}
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (theme) => alpha(theme.palette.warning.main, 0.15),
              color: 'warning.main',
              flexShrink: 0,
              mt: 0.25,
            }}
          >
            <Iconify icon={'solar:shield-warning-bold' as IconifyName} width={28} />
          </Box>
          <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Inicialização Obrigatória do Cofre DevOS
              </Typography>
              <Chip
                label="Status: Aguardando Inicialização"
                size="small"
                color="warning"
                variant="outlined"
                sx={{ height: 22, fontSize: '0.72rem', fontWeight: 700 }}
              />
            </Stack>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              Defina a Senha Mestre do Cofre Local para derivar a chave de 256 bits via{' '}
              <strong>Argon2id</strong> e selar o cabeçalho canário local com{' '}
              <strong>AES-256-GCM</strong>. Como a aplicação opera sob custódia local protegida,{' '}
              <em>não existe mecanismo de recuperação caso esta senha seja perdida</em>.
            </Typography>
          </Stack>
        </Stack>

        {localAlert && (
          <Alert severity={localAlert.severity} onClose={() => setLocalAlert(null)}>
            {localAlert.message}
          </Alert>
        )}

        {/* Formulário Semântico com Suporte Nativo a Teclado e Tecnologias Assistivas */}
        <Box component="form" onSubmit={handleInitVault} noValidate sx={{ width: '100%' }}>
          <Stack spacing={2} sx={{ maxWidth: 920 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                required
                size="small"
                type={showMasterPassword ? 'text' : 'password'}
                label="Nova Senha Mestre"
                placeholder={`Mínimo ${MIN_MASTER_PASSWORD_LENGTH} caracteres...`}
                value={initialMasterPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
                disabled={isInitializingVault}
                autoComplete="new-password"
                error={validation.passwordHasMarginalWhitespace}
                helperText={
                  validation.passwordHasMarginalWhitespace
                    ? 'Remova espaços, quebras de linha ou caracteres invisíveis'
                    : undefined
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          onClick={() => setShowMasterPassword((prev) => !prev)}
                          edge="end"
                          size="small"
                          aria-label={showMasterPassword ? 'Ocultar senha mestra' : 'Mostrar senha mestra'}
                          aria-pressed={showMasterPassword}
                          disabled={isInitializingVault}
                        >
                          <Iconify
                            icon={
                              showMasterPassword
                                ? 'solar:eye-bold'
                                : 'solar:eye-closed-bold'
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                fullWidth
                required
                size="small"
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirmar Senha Mestre"
                placeholder="Repita a senha exatamente..."
                value={confirmMasterPassword}
                onChange={(e) => handleConfirmChange(e.target.value)}
                disabled={isInitializingVault}
                autoComplete="new-password"
                error={validation.confirmHasMarginalWhitespace || !validation.passwordsMatch}
                helperText={
                  validation.confirmHasMarginalWhitespace
                    ? 'Remova espaços, quebras de linha ou caracteres invisíveis'
                    : !validation.passwordsMatch
                      ? 'As senhas não coincidem'
                      : undefined
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          edge="end"
                          size="small"
                          aria-label={
                            showConfirmPassword
                              ? 'Ocultar confirmação de senha'
                              : 'Mostrar confirmação de senha'
                          }
                          aria-pressed={showConfirmPassword}
                          disabled={isInitializingVault}
                        >
                          <Iconify
                            icon={
                              showConfirmPassword
                                ? 'solar:eye-bold'
                                : 'solar:eye-closed-bold'
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="warning"
                disabled={!validation.canSubmit || isInitializingVault}
                startIcon={
                  isInitializingVault ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <Iconify icon={'solar:lock-keyhole-minimalistic-bold' as IconifyName} />
                  )
                }
                sx={{
                  textTransform: 'none',
                  fontWeight: 800,
                  minWidth: { xs: '100%', md: 170 },
                  height: 40,
                  flexShrink: 0,
                }}
              >
                {isInitializingVault ? 'Derivando Chave...' : 'Inicializar Cofre'}
              </Button>
            </Stack>

            {/* Estimativa de Robustez e Checklist Dinâmico com Suporte a Unicode */}
            {passwordLength > 0 && (
              <Stack spacing={1} sx={{ pt: 0.5 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Estimativa de Robustez:{' '}
                    <Box
                      component="span"
                      sx={{
                        color: `${passwordStrength.color}.main`,
                        fontWeight: 700,
                      }}
                    >
                      {passwordStrength.label}
                    </Box>
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {passwordLength} / {MAX_MASTER_PASSWORD_LENGTH} caracteres
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={passwordStrength.score}
                  color={passwordStrength.color}
                  aria-label="Indicador de robustez da senha"
                  sx={{ height: 6, borderRadius: 1 }}
                />

                <Stack direction="row" spacing={2.5} sx={{ pt: 0.5, flexWrap: 'wrap', gap: 1 }}>
                  <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                    <Iconify
                      icon={
                        passwordLength >= MIN_MASTER_PASSWORD_LENGTH && passwordLength <= MAX_MASTER_PASSWORD_LENGTH
                          ? 'solar:check-circle-bold'
                          : 'solar:close-circle-bold'
                      }
                      width={14}
                      sx={{
                        color:
                          passwordLength >= MIN_MASTER_PASSWORD_LENGTH && passwordLength <= MAX_MASTER_PASSWORD_LENGTH
                            ? 'success.main'
                            : 'text.disabled',
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          passwordLength >= MIN_MASTER_PASSWORD_LENGTH && passwordLength <= MAX_MASTER_PASSWORD_LENGTH
                            ? 'text.primary'
                            : 'text.secondary',
                        fontSize: '0.73rem',
                      }}
                    >
                      Mínimo {MIN_MASTER_PASSWORD_LENGTH} caracteres
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                    <Iconify
                      icon={
                        hasLettersAndNumbers
                          ? 'solar:check-circle-bold'
                          : 'solar:close-circle-bold'
                      }
                      width={14}
                      sx={{
                        color:
                          hasLettersAndNumbers
                            ? 'success.main'
                            : 'text.disabled',
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          hasLettersAndNumbers
                            ? 'text.primary'
                            : 'text.secondary',
                        fontSize: '0.73rem',
                      }}
                    >
                      Letras e números
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                    <Iconify
                      icon={
                        hasSpecialChar
                          ? 'solar:check-circle-bold'
                          : 'solar:info-circle-bold'
                      }
                      width={14}
                      sx={{
                        color: hasSpecialChar
                          ? 'success.main'
                          : 'text.disabled',
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: hasSpecialChar
                          ? 'text.primary'
                          : 'text.secondary',
                        fontSize: '0.73rem',
                      }}
                    >
                      Símbolos especiais (Recomendado)
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                    <Iconify
                      icon={
                        !validation.passwordHasMarginalWhitespace
                          ? 'solar:check-circle-bold'
                          : 'solar:close-circle-bold'
                      }
                      width={14}
                      sx={{
                        color: !validation.passwordHasMarginalWhitespace ? 'success.main' : 'error.main',
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: !validation.passwordHasMarginalWhitespace ? 'text.secondary' : 'error.main',
                        fontSize: '0.73rem',
                      }}
                    >
                      Sem espaços marginais
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}
