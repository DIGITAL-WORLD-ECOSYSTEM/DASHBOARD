import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type NewIntegrationData = {
  id: string;
  name: string;
  provider: string;
  category: string;
  env: string;
  risk: string;
  criticality: string;
  status: string;
  drift: string;
  owner: string;
  secretRef: string;
  expiresIn: number;
  healthPct: number;
  logoUrl?: string;
};

type CreateIntegrationModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (integration: NewIntegrationData) => void;
};

const PROVIDER_PRESETS: Record<
  string,
  {
    name: string;
    category: string;
    risk: string;
    criticality: string;
    secretRef: string;
    owner: string;
    rotationDays: number;
  }
> = {
  coinmarketcap: {
    name: 'CoinMarketCap Market Data',
    category: 'Web3',
    risk: 'ELEVATED',
    criticality: 'HIGH',
    secretRef: 'CMC_PRO_API_KEY_PROD',
    owner: 'Web3 & Treasury Team',
    rotationDays: 90,
  },
  binance: {
    name: 'Binance Custodial Master',
    category: 'Web3',
    risk: 'CRITICAL',
    criticality: 'MISSION CRITICAL',
    secretRef: 'BINANCE_MASTER_API_KEY_PROD',
    owner: 'Core Treasury Team',
    rotationDays: 30,
  },
  stripe: {
    name: 'Stripe Payments Production',
    category: 'Finance',
    risk: 'NUCLEAR',
    criticality: 'MISSION CRITICAL',
    secretRef: 'STRIPE_LIVE_RESTRICTED_KEY',
    owner: 'Finance & Compliance',
    rotationDays: 60,
  },
  openai: {
    name: 'OpenAI Enterprise Model Gateway',
    category: 'AI',
    risk: 'HIGH',
    criticality: 'HIGH',
    secretRef: 'OPENAI_PROD_PROJECT_KEY',
    owner: 'AI Lab Team',
    rotationDays: 90,
  },
  resend: {
    name: 'Resend Transactional Mailer',
    category: 'Communications',
    risk: 'STANDARD',
    criticality: 'MEDIUM',
    secretRef: 'RESEND_SENDING_DOMAINS_KEY',
    owner: 'Infrastructure Team',
    rotationDays: 120,
  },
  custom: {
    name: '',
    category: 'Web3',
    risk: 'STANDARD',
    criticality: 'MEDIUM',
    secretRef: '',
    owner: 'DevOps & Security',
    rotationDays: 90,
  },
};

export function CreateIntegrationModal({ open, onClose, onCreated }: CreateIntegrationModalProps) {
  const [provider, setProvider] = useState<string>('coinmarketcap');
  const [name, setName] = useState<string>(PROVIDER_PRESETS.coinmarketcap.name);
  const [category, setCategory] = useState<string>(PROVIDER_PRESETS.coinmarketcap.category);
  const [env, setEnv] = useState<string>('Production');
  const [risk, setRisk] = useState<string>(PROVIDER_PRESETS.coinmarketcap.risk);
  const [criticality, setCriticality] = useState<string>(PROVIDER_PRESETS.coinmarketcap.criticality);
  const [secretRef, setSecretRef] = useState<string>(PROVIDER_PRESETS.coinmarketcap.secretRef);
  const [owner, setOwner] = useState<string>(PROVIDER_PRESETS.coinmarketcap.owner);
  const [rotationDays, setRotationDays] = useState<number>(PROVIDER_PRESETS.coinmarketcap.rotationDays);
  const [error, setError] = useState<string>('');

  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider);
    const preset = PROVIDER_PRESETS[newProvider] || PROVIDER_PRESETS.custom;
    if (preset.name) setName(preset.name);
    setCategory(preset.category);
    setRisk(preset.risk);
    setCriticality(preset.criticality);
    if (preset.secretRef) setSecretRef(preset.secretRef);
    setOwner(preset.owner);
    setRotationDays(preset.rotationDays);
    setError('');
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('O nome da integração é obrigatório.');
      return;
    }
    if (!secretRef.trim()) {
      setError('A referência do segredo (Secret Ref) é obrigatória.');
      return;
    }
    // Zero secret leakage check: Reject accidental raw keys
    if (secretRef.startsWith('sk_') || secretRef.startsWith('b54b') || secretRef.length > 80) {
      setError(
        'Violação de Segurança (INV-001): O campo Secret Ref aceita apenas identificadores de cofre (ex: CMC_PRO_API_KEY_PROD), nunca o segredo bruto ou chave crua.'
      );
      return;
    }

    const id = `intg_${provider}_${env.toLowerCase()}_${Date.now().toString(36)}`;

    const newIntegration: NewIntegrationData = {
      id,
      name: name.trim(),
      provider: provider === 'coinmarketcap' ? 'CoinMarketCap' : provider.charAt(0).toUpperCase() + provider.slice(1),
      category,
      env,
      risk,
      criticality,
      status: 'Online',
      drift: 'Sincronizado',
      owner: owner.trim() || 'DevOS Core',
      secretRef: secretRef.trim(),
      expiresIn: Number(rotationDays) || 90,
      healthPct: 100.0,
      logoUrl: provider === 'coinmarketcap' ? '/assets/icons/brands/ic-coinmarketcap.svg' : undefined,
    };

    onCreated(newIntegration);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon={'mingcute:safe-lock-line' as any} width={22} />
          </Box>
          <div>
            <Typography variant="h6">Credenciar Integração no Cofre</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              DevOS API & Secrets Vault v0.1.2 — Invariante Zero Secret Leakage (INV-001)
            </Typography>
          </div>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5 }}>
        <Stack spacing={2.5}>
          <Alert severity="info" variant="outlined" sx={{ py: 0.5 }}>
            Metadados registrados no control plane D1. O valor real da chave é gerenciado via Cloudflare Secrets ou KMS seguro.
          </Alert>

          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Provedor Preset */}
          <FormControl fullWidth size="small">
            <InputLabel id="provider-select-label">Provedor Catalogado</InputLabel>
            <Select
              labelId="provider-select-label"
              value={provider}
              label="Provedor Catalogado"
              onChange={(e) => handleProviderChange(e.target.value)}
            >
              <MenuItem value="coinmarketcap">CoinMarketCap (Market Data / Oráculo Web3)</MenuItem>
              <MenuItem value="binance">Binance (Web3 Custodial Exchange)</MenuItem>
              <MenuItem value="stripe">Stripe (Finance / Pagamentos)</MenuItem>
              <MenuItem value="openai">OpenAI (AI Gateway)</MenuItem>
              <MenuItem value="resend">Resend (Communications / Mailer)</MenuItem>
              <MenuItem value="custom">Outro / Provedor Customizado</MenuItem>
            </Select>
          </FormControl>

          {/* Nome e Categoria */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              size="small"
              label="Nome da Integração"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: CoinMarketCap Market Data"
            />

            <FormControl fullWidth size="small">
              <InputLabel id="category-select-label">Categoria na UI</InputLabel>
              <Select
                labelId="category-select-label"
                value={category}
                label="Categoria na UI"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="Web3">🪙 Web3 (Recomendado para CMC)</MenuItem>
                <MenuItem value="Finance">💳 Finance</MenuItem>
                <MenuItem value="AI">🤖 AI</MenuItem>
                <MenuItem value="Communications">📧 Communications</MenuItem>
                <MenuItem value="OAuth">🔑 OAuth</MenuItem>
                <MenuItem value="Infra">☁️ Infra</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {/* Ambiente e Nível de Risco */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="env-select-label">Ambiente</InputLabel>
              <Select
                labelId="env-select-label"
                value={env}
                label="Ambiente"
                onChange={(e) => setEnv(e.target.value)}
              >
                <MenuItem value="Production">Production</MenuItem>
                <MenuItem value="Staging">Staging</MenuItem>
                <MenuItem value="Development">Development</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel id="risk-select-label">Nível de Risco</InputLabel>
              <Select
                labelId="risk-select-label"
                value={risk}
                label="Nível de Risco"
                onChange={(e) => setRisk(e.target.value)}
              >
                <MenuItem value="STANDARD">STANDARD (Baixo impacto)</MenuItem>
                <MenuItem value="ELEVATED">ELEVATED (Cotações / Leitura)</MenuItem>
                <MenuItem value="HIGH">HIGH (Impacto Operacional)</MenuItem>
                <MenuItem value="CRITICAL">CRITICAL (Custódia / Execução)</MenuItem>
                <MenuItem value="NUCLEAR">NUCLEAR (Acesso Mestre Financeiro)</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {/* Secret Ref e Dias de Rotação */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              size="small"
              label="Secret Reference (KMS / Cofragem)"
              value={secretRef}
              onChange={(e) => setSecretRef(e.target.value)}
              placeholder="Ex: CMC_PRO_API_KEY_PROD"
              helperText="Identificador imutável. Nunca a chave pura."
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon={'mingcute:key-2-line' as any} sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              size="small"
              type="number"
              label="Intervalo de Rotação (Dias)"
              value={rotationDays}
              onChange={(e) => setRotationDays(Number(e.target.value))}
              helperText="Ciclo normativo de renovação."
            />
          </Stack>

          {/* Responsável / Owner */}
          <TextField
            fullWidth
            size="small"
            label="Equipe Responsável (Owner)"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="Ex: Web3 & Treasury Team"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon={'mingcute:check-circle-line' as any} />}
          onClick={handleSubmit}
        >
          Credenciar Integração
        </Button>
      </DialogActions>
    </Dialog>
  );
}
