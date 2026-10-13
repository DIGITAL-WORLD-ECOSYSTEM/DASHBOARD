import type { DerivedPreview } from '../types/wallet-types';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

interface WalletSeedModalProps {
  open: boolean;
  onClose: () => void;
  mnemonicWords?: string[];
  sessionId?: string;
  onRevealMnemonic?: (password: string) => Promise<string>;
  derivedPreviews: DerivedPreview[];
  onConfirmAndSave: (masterPassword: string) => Promise<void>;
  target: 'dao' | 'clients';
}

export function WalletSeedModal({
  open,
  onClose,
  mnemonicWords = [],
  sessionId,
  onRevealMnemonic,
  derivedPreviews,
  onConfirmAndSave,
  target,
}: WalletSeedModalProps) {
  const [masterPassword, setMasterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Controle de Revelação Autorizada e Efêmera
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealedWords, setRevealedWords] = useState<string[]>(mnemonicWords);
  const [isRevealing, setIsRevealing] = useState(false);

  const handleToggleReveal = async () => {
    if (isRevealed) {
      setIsRevealed(false);
      setRevealedWords([]);
      return;
    }

    if (revealedWords.length > 0) {
      setIsRevealed(true);
      return;
    }

    if (onRevealMnemonic) {
      if (!masterPassword || masterPassword.length < 8) {
        setSaveError('Informe a senha mestre do cofre abaixo para autorizar a descriptografia da semente no núcleo nativo.');
        return;
      }
      setIsRevealing(true);
      try {
        const phrase = await onRevealMnemonic(masterPassword);
        setRevealedWords(phrase.trim().split(/\s+/));
        setIsRevealed(true);
        setSaveError(null);
      } catch (err: any) {
        setSaveError(err?.message || 'Falha ao recuperar mnemônica em Rust.');
      } finally {
        setIsRevealing(false);
      }
    }
  };

  const handleCopyMnemonic = () => {
    if (revealedWords.length > 0) {
      navigator.clipboard.writeText(revealedWords.join(' '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSave = async () => {
    if (!masterPassword || masterPassword.length < 8) {
      setSaveError('A senha mestre deve possuir pelo menos 8 caracteres para autorizar o cofre.');
      return;
    }
    setSaveError(null);
    setIsSaving(true);
    try {
      await onConfirmAndSave(masterPassword);
      setMasterPassword('');
      setIsRevealed(false);
      setRevealedWords([]);
    } catch (err: any) {
      setSaveError(err?.message || 'Falha ao salvar no cofre local');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseInternal = () => {
    setIsRevealed(false);
    setRevealedWords([]);
    setMasterPassword('');
    setSaveError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseInternal} maxWidth="md" fullWidth>
      <DialogTitle sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}`, pb: 2 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Iconify icon={'solar:shield-keyhole-bold' as any} width={24} sx={{ color: 'warning.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {target === 'dao' ? 'Cofre Institucional da DAO' : 'Cofre Individual do Associado'} — Material Criptográfico Gerado
          </Typography>
        </Stack>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
          Entropia retida no núcleo nativo Rust (Tauri). Sementes NUNCA transitam pela rede.
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Stack spacing={2.5}>
          {/* Card de Segurança e Revelação Autorizada da Mnemônica */}
          <Box
            sx={{
              p: 2.5,
              borderRadius: 1.5,
              bgcolor: (theme) => alpha(theme.palette.warning.main, 0.04),
              border: (theme) => `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
            }}
          >
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Iconify icon={'solar:shield-warning-bold' as any} width={20} sx={{ color: 'warning.main' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  Frase de Recuperação Mnemônica (BIP-39)
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                {isRevealed && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleCopyMnemonic}
                    startIcon={<Iconify icon={copied ? ('solar:check-circle-bold' as any) : ('solar:copy-bold' as any)} />}
                    sx={{ textTransform: 'none', fontWeight: 700 }}
                  >
                    {copied ? 'Copiado!' : 'Copiar'}
                  </Button>
                )}
                <Button
                  size="small"
                  variant={isRevealed ? 'outlined' : 'contained'}
                  color="warning"
                  onClick={handleToggleReveal}
                  disabled={isRevealing}
                  startIcon={
                    <Iconify
                      icon={isRevealed ? ('solar:eye-closed-bold' as any) : ('solar:eye-bold' as any)}
                    />
                  }
                  sx={{ textTransform: 'none', fontWeight: 800 }}
                >
                  {isRevealing
                    ? 'Consultando Rust...'
                    : isRevealed
                    ? 'Ocultar Frase'
                    : '👁️ Revelar Mnemônica (Backup Físico)'}
                </Button>
              </Stack>
            </Stack>

            {!isRevealed ? (
              <Alert severity="info" sx={{ fontSize: '0.78rem' }}>
                🔒 <strong>Segurança por Design:</strong> A semente foi gerada e está retida exclusivamente na memória segura do Rust (Zeroize). Ela não foi transferida para a interface. Você pode confirmar o salvamento diretamente sem expô-la em tela, ou revelá-la acima para anotação em papel.
              </Alert>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={1.25}>
                  {revealedWords.map((word, idx) => (
                    <Grid size={{ xs: 4, sm: 3, md: 2 }} key={idx}>
                      <Box
                        sx={{
                          p: 1,
                          textAlign: 'center',
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          border: (theme) => `1px solid ${theme.palette.divider}`,
                          fontFamily: 'monospace',
                        }}
                      >
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.65rem' }}>
                          #{idx + 1}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {word}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>

          {/* Pré-visualização das Carteiras Derivadas */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: 'text.secondary' }}>
              CARTEIRAS DERIVADAS DETERMINISTICAMENTE (BIP-44)
            </Typography>
            <TableContainer
              sx={{
                maxHeight: 220,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: 1.5,
              }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Rótulo</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Caminho de Derivação</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Endereço EVM (EIP-55)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {derivedPreviews.map((p) => (
                    <TableRow key={p.index} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{p.index + 1}</TableCell>
                      <TableCell>{p.label}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', color: 'info.main' }}>{p.derivationPath}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                        {p.address.slice(0, 8)}...{p.address.slice(-6)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Input de Senha Mestre do Cofre */}
          <Box
            sx={{
              p: 2,
              borderRadius: 1.5,
              bgcolor: (theme) => alpha(theme.palette.warning.main, 0.05),
              border: (theme) => `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'warning.main', display: 'block', mb: 1 }}>
              AUTORIZAÇÃO DO COFRE LOCAL — SENHA MESTRE
            </Typography>
            <TextField
              fullWidth
              size="small"
              type={showPassword ? 'text' : 'password'}
              label="Senha Mestre do Cofre DevOS"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              placeholder="Digite a senha mestre para selar o envelope AES-256-GCM"
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
            {saveError && (
              <Alert severity="error" sx={{ mt: 1.5 }}>
                {saveError}
              </Alert>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary', textTransform: 'none' }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={handleSave}
          disabled={isSaving || !masterPassword}
          startIcon={<Iconify icon={'solar:lock-password-bold' as any} />}
          sx={{ fontWeight: 800, textTransform: 'none' }}
        >
          {isSaving ? 'Selando no Cofre Local...' : 'Cifrar & Salvar no Cofre Local'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
