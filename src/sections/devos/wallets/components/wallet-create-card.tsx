import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

import { SUPPORTED_NETWORKS, QUANTITY_OPTIONS, SEED_LENGTH_OPTIONS } from '../domain/wallet-policy';
import type { WalletTarget } from '../types/wallet-types';

interface WalletCreateCardProps {
  walletTarget: WalletTarget;
  setWalletTarget: (target: WalletTarget) => void;
  seedWordsCount: number;
  setSeedWordsCount: (count: number) => void;
  targetNetwork: string;
  setTargetNetwork: (net: string) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
  baseLabel: string;
  setBaseLabel: (label: string) => void;
  clientName: string;
  setClientName: (name: string) => void;
  clientDoc: string;
  setClientDoc: (doc: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function WalletCreateCard({
  walletTarget,
  setWalletTarget,
  seedWordsCount,
  setSeedWordsCount,
  targetNetwork,
  setTargetNetwork,
  quantity,
  setQuantity,
  baseLabel,
  setBaseLabel,
  clientName,
  setClientName,
  clientDoc,
  setClientDoc,
  onGenerate,
  isGenerating,
}: WalletCreateCardProps) {
  return (
    <Card
      sx={{
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack spacing={2.5}>
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Iconify icon={'solar:wallet-money-bold' as any} width={22} sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Criação de Carteiras & Cofre Criptográfico
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
            Motor de geração e custódia isolado no núcleo nativo Rust (Tauri). Entropia criptográfica do sistema operacional, derivação BIP-44 e cofre AEAD com Argon2id + AES-256-GCM.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {/* Destino da Carteira */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block', color: 'text.secondary' }}>
              DESTINO DA CUSTÓDIA
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              size="small"
              value={walletTarget}
              onChange={(_, val) => val && setWalletTarget(val)}
            >
              <ToggleButton value="dao" sx={{ fontWeight: 700, textTransform: 'none' }}>
                Carteiras da DAO (Institucional)
              </ToggleButton>
              <ToggleButton value="clients" sx={{ fontWeight: 700, textTransform: 'none' }}>
                Carteiras de Associados (Cofre Individual)
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          {/* Comprimento da Semente */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block', color: 'text.secondary' }}>
              TAMANHO DA FRASE MNEMÔNICA (BIP-39)
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              size="small"
              value={seedWordsCount}
              onChange={(_, val) => val && setSeedWordsCount(val)}
            >
              {SEED_LENGTH_OPTIONS.map((count) => (
                <ToggleButton key={count} value={count} sx={{ fontWeight: 700, textTransform: 'none' }}>
                  {count} palavras {count === 24 ? '(Recomendado)' : ''}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>

          {/* Rede Blockchain */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Rede Blockchain (Padrão ERC-20 / EVM)"
              value={targetNetwork}
              onChange={(e) => setTargetNetwork(e.target.value)}
            >
              {SUPPORTED_NETWORKS.map((net) => (
                <MenuItem key={net.id} value={net.name}>
                  {net.name} ({net.nativeSymbol} • Chain ID {net.chainId})
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Seletor de Quantidade */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.75, display: 'block', color: 'text.secondary' }}>
              QUANTIDADE DE CARTEIRAS NO LOTE
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              size="small"
              value={quantity}
              onChange={(_, val) => val && setQuantity(val)}
            >
              {QUANTITY_OPTIONS.map((num) => (
                <ToggleButton key={num} value={num} sx={{ fontWeight: 800 }}>
                  {num}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>

          {/* Campos condicionais se associado */}
          {walletTarget === 'clients' && (
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Nome do Associado / Titular"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: João da Silva"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Documento de Identificação (CPF/CNPJ)"
                  value={clientDoc}
                  onChange={(e) => setClientDoc(e.target.value)}
                  placeholder="Ex: CPF 123.456.789-00"
                />
              </Grid>
            </>
          )}

          {/* Rótulo / Finalidade */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              size="small"
              label="Rótulo Base / Finalidade da Carteira"
              value={baseLabel}
              onChange={(e) => setBaseLabel(e.target.value)}
              placeholder={walletTarget === 'dao' ? 'Ex: Caixa Operacional, Tesouraria Safe, Gas Station' : 'Ex: Custódia Pessoal'}
            />
          </Grid>
        </Grid>

        <Stack direction="row" sx={{ justifyContent: 'flex-end', pt: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onGenerate}
            disabled={isGenerating}
            startIcon={<Iconify icon={'solar:shield-keyhole-bold' as any} />}
            sx={{
              fontWeight: 800,
              px: 3,
              py: 1,
              textTransform: 'none',
              boxShadow: (theme) => `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.4)}`,
            }}
          >
            {isGenerating ? 'Gerando no Rust Core...' : 'Gerar Carteiras no Rust Core'}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
