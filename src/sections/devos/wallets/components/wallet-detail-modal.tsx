import { useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { WalletBridge } from 'src/platform/desktop/wallets/wallet-bridge';

import type { DaoWallet, ClientWallet } from '../types/wallet-types';

interface WalletDetailModalProps {
  open: boolean;
  onClose: () => void;
  wallet: DaoWallet | ClientWallet | null;
}

export function WalletDetailModal({ open, onClose, wallet }: WalletDetailModalProps) {
  const [masterPassword, setMasterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [revealedMnemonic, setRevealedMnemonic] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!wallet) return null;

  const isDao = 'user' in wallet;
  const titular = isDao ? wallet.user : wallet.clientName;
  const doc = !isDao ? wallet.clientDoc : null;

  const handleUnlockAndExport = async () => {
    if (!wallet.vaultId) {
      setErrorMsg('Esta carteira é de monitoramento Watch-Only e não possui envelope criptografado no cofre.');
      return;
    }
    if (!masterPassword) {
      setErrorMsg('Informe a senha mestre para autorizar a recuperação do material secreto.');
      return;
    }
    setErrorMsg(null);
    setIsExporting(true);
    try {
      const phrase = await WalletBridge.exportAuthorizedSecret(masterPassword, wallet.vaultId);
      setRevealedMnemonic(phrase);
      setMasterPassword('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Falha ao decifrar envelope local: Senha mestre incorreta');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopySecret = () => {
    if (revealedMnemonic) {
      navigator.clipboard.writeText(revealedMnemonic);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleClose = () => {
    setRevealedMnemonic(null);
    setMasterPassword('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}`, pb: 2 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Iconify
            icon={wallet.custodyType === 'WATCH_ONLY' ? ('solar:eye-bold' as any) : ('solar:shield-keyhole-bold' as any)}
            width={24}
            sx={{ color: wallet.custodyType === 'WATCH_ONLY' ? 'info.main' : 'warning.main' }}
          />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {wallet.custodyType === 'WATCH_ONLY' ? 'Inspeção Watch-Only' : 'Inspeção de Cofre Local'} — #{wallet.id}
          </Typography>
        </Stack>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {titular} • {wallet.network}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Stack spacing={2.5}>
          {/* Ficha Pública da Carteira */}
          <Box
            sx={{
              p: 2,
              borderRadius: 1.5,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Stack spacing={1.5}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>TITULAR / ENTIDADE:</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{titular}</Typography>
              </Stack>

              {doc && (
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>DOCUMENTO:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{doc}</Typography>
                </Stack>
              )}

              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>TIPO DE CUSTÓDIA:</Typography>
                <Chip
                  size="small"
                  label={wallet.custodyType === 'WATCH_ONLY' ? 'Watch-Only (Monitoramento)' : 'Cofre Local Cifrado'}
                  color={wallet.custodyType === 'WATCH_ONLY' ? 'info' : 'success'}
                  variant="outlined"
                  sx={{ height: 22, fontWeight: 800, fontSize: '0.68rem' }}
                />
              </Stack>

              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>STATUS KYC:</Typography>
                <Chip
                  size="small"
                  label={
                    wallet.kycStatus === 'VERIFIED'
                      ? 'Verificado'
                      : wallet.kycStatus === 'SIMULATED_TEST'
                      ? 'Simulado / Teste'
                      : 'Não Verificado'
                  }
                  color={wallet.kycStatus === 'VERIFIED' ? 'success' : 'default'}
                  sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800 }}
                />
              </Stack>

              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>RÓTULO / FINALIDADE:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{wallet.label}</Typography>
              </Stack>

              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>REDE BLOCKCHAIN:</Typography>
                <Chip size="small" label={wallet.network} color="primary" sx={{ height: 22, fontWeight: 700 }} />
              </Stack>

              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>ENDEREÇO EVM:</Typography>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 800 }}>
                  {wallet.address}
                </Typography>
              </Stack>

              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>DERIVAÇÃO (BIP-44):</Typography>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'info.main', fontWeight: 800 }}>
                  {wallet.derivationPath}
                </Typography>
              </Stack>

              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>SALDO EM TEMPO REAL:</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'success.main', fontFamily: 'monospace' }}>
                  {wallet.balance}
                </Typography>
              </Stack>

              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>TRANSAÇÕES ENVIADAS (NONCE):</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>
                  {wallet.nonce !== undefined && wallet.nonce !== null ? wallet.nonce : '0'}
                </Typography>
              </Stack>

              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>IDENTIFICADOR DO COFRE:</Typography>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                  {wallet.vaultId || 'N/A (Sem envelope cifrado local)'}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Transparência sobre Histórico de Transações */}
          <Alert severity="info" sx={{ py: 0.5, fontSize: '0.75rem' }}>
            <strong>Monitoramento RPC:</strong> O nó blockchain EVM confirma o saldo atual e a contagem de transações emitidas (Nonce). O histórico detalhado com lista completa de operações passadas depende de indexador externo (Arbiscan/Etherscan API).
          </Alert>

          {/* Recuperação Autorizada de Segredos OU Aviso de Watch-Only */}
          {wallet.custodyType === 'WATCH_ONLY' || !wallet.vaultId ? (
            <Box
              sx={{
                p: 2,
                borderRadius: 1.5,
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.05),
                border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                <Iconify icon={'solar:shield-check-bold' as any} width={20} sx={{ color: 'info.main' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'info.main' }}>
                  Custódia Segregada — Registro Watch-Only
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Esta carteira é de monitoramento estrito. Por diretriz de segurança, ela não possui segredos ou sementes armazenadas neste computador. Nenhuma chave sintética foi gerada.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                p: 2,
                borderRadius: 1.5,
                bgcolor: (theme) => alpha(theme.palette.warning.main, 0.05),
                border: (theme) => `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                <Iconify icon={'solar:shield-warning-bold' as any} width={20} sx={{ color: 'warning.main' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'warning.main' }}>
                  Recuperação Autorizada de Frase Mnemônica (Auditoria Local)
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
                Para decifrar o envelope AEAD local armazenado em disco (SQLite), forneça a senha mestre do cofre DevOS.
              </Typography>

              {!revealedMnemonic ? (
                <Stack spacing={1.5}>
                  <TextField
                    fullWidth
                    size="small"
                    type={showPassword ? 'text' : 'password'}
                    label="Senha Mestre"
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    placeholder="Digite a senha mestre..."
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                              <Iconify icon={showPassword ? ('solar:eye-bold' as any) : ('solar:eye-closed-bold' as any)} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  {errorMsg && (
                    <Alert severity="error" sx={{ py: 0.5 }}>
                      {errorMsg}
                    </Alert>
                  )}
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={handleUnlockAndExport}
                    disabled={isExporting || !masterPassword}
                    startIcon={<Iconify icon={'solar:key-minimalistic-square-3-bold' as any} />}
                    sx={{ textTransform: 'none', fontWeight: 800 }}
                  >
                    {isExporting ? 'Decifrando no Rust Core...' : 'Decifrar e Visualizar Mnemônica'}
                  </Button>
                </Stack>
              ) : (
                <Box sx={{ mt: 1 }}>
                  <Alert severity="success" sx={{ mb: 1.5 }}>
                    Envelope decifrado com sucesso via Argon2id + AES-256-GCM!
                  </Alert>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, mb: 1.5 }}>
                      {revealedMnemonic}
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={handleCopySecret}
                      startIcon={<Iconify icon={copied ? ('solar:check-circle-bold' as any) : ('solar:copy-bold' as any)} />}
                      sx={{ textTransform: 'none', fontWeight: 700 }}
                    >
                      {copied ? 'Copiado para Área de Transferência!' : 'Copiar Frase'}
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Button onClick={handleClose} sx={{ color: 'text.secondary', textTransform: 'none' }}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
