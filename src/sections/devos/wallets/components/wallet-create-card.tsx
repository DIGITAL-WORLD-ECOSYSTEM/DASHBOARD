import type { WalletTarget } from '../types/wallet-types';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { Iconify } from 'src/components/iconify';

import { QUANTITY_OPTIONS, SUPPORTED_NETWORKS } from '../domain/wallet-policy';

// ----------------------------------------------------------------------

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
        p: 2.25,
        bgcolor: 'background.paper',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2 }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Iconify icon={'solar:shield-keyhole-bold' as any} width={20} sx={{ color: 'primary.main' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Gerar Novas Carteiras
          </Typography>
        </Stack>
        <Chip
          label="BIP-39 / BIP-44 • AES-256-GCM"
          size="small"
          variant="soft"
          color="primary"
          sx={{ fontWeight: 800, fontSize: '0.68rem', height: 22 }}
        />
      </Stack>

      <Grid container spacing={2} sx={{ alignItems: 'flex-end' }}>
        {/* DESTINO DA CARTEIRA: DAO OU CLIENTES */}
        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.75 }}>
            Destino da Carteira
          </Typography>
          <ToggleButtonGroup
            value={walletTarget}
            exclusive
            onChange={(_, val) => {
              if (val) {
                setWalletTarget(val);
                setBaseLabel(val === 'dao' ? 'Caixa Operacional' : 'Custódia Membro');
              }
            }}
            fullWidth
            size="small"
            sx={{ height: 38 }}
          >
            <ToggleButton value="dao" sx={{ py: 0.5, fontWeight: 800, fontSize: '0.78rem' }}>
              🏛️ DAO
            </ToggleButton>
            <ToggleButton value="clients" sx={{ py: 0.5, fontWeight: 800, fontSize: '0.78rem' }}>
              👥 Cliente
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        {/* SEED WORDS */}
        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.75 }}>
            Padrão da Seed
          </Typography>
          <ToggleButtonGroup
            value={seedWordsCount}
            exclusive
            onChange={(_, val) => {
              if (val) setSeedWordsCount(val);
            }}
            fullWidth
            size="small"
            sx={{ height: 38 }}
          >
            <ToggleButton value={12} sx={{ py: 0.5, fontWeight: 700, fontSize: '0.78rem' }}>
              12 Palavras
            </ToggleButton>
            <ToggleButton value={24} sx={{ py: 0.5, fontWeight: 800, fontSize: '0.78rem' }}>
              24 Palavras
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        {/* QUANTIDADE */}
        <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.75 }}>
            Quantidade
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            sx={{ '& .MuiInputBase-root': { height: 38 } }}
          >
            {QUANTITY_OPTIONS.map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* REDE */}
        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.75 }}>
            Rede
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={targetNetwork}
            onChange={(e) => setTargetNetwork(e.target.value)}
            sx={{ '& .MuiInputBase-root': { height: 38 } }}
          >
            {SUPPORTED_NETWORKS.map((net) => (
              <MenuItem key={net.id} value={net.name}>
                {net.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* RÓTULO */}
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.75 }}>
            Rótulo Base
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder={walletTarget === 'dao' ? 'Ex: Caixa Operacional' : 'Ex: Nome Cliente'}
            value={baseLabel}
            onChange={(e) => setBaseLabel(e.target.value)}
            sx={{ '& .MuiInputBase-root': { height: 38 } }}
          />
        </Grid>

        {/* BOTÃO DE AÇÃO */}
        <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
          <Button
            variant="contained"
            fullWidth
            disabled={isGenerating}
            onClick={onGenerate}
            startIcon={<Iconify icon={'solar:bolt-circle-bold' as any} width={18} />}
            sx={{
              height: 38,
              fontWeight: 800,
              fontSize: '0.8rem',
              textTransform: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {isGenerating ? 'Gerando...' : 'Gerar'}
          </Button>
        </Grid>

        {/* CAMPOS CONDICIONAIS DE CLIENTE / ASSOCIADO */}
        {walletTarget === 'clients' && (
          <>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.75 }}>
                Nome do Associado / Titular
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: João da Silva"
                sx={{ '& .MuiInputBase-root': { height: 38 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.75 }}>
                Documento de Identificação (CPF/CNPJ)
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={clientDoc}
                onChange={(e) => setClientDoc(e.target.value)}
                placeholder="Ex: CPF 123.456.789-00"
                sx={{ '& .MuiInputBase-root': { height: 38 } }}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Card>
  );
}
