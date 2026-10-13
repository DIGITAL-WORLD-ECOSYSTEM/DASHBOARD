import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';

import { Iconify } from 'src/components/iconify';

import {
  MOCK_SAFE_ASSETS,
  MOCK_SAFE_SIGNERS,
  type SafeProposal,
  MOCK_SAFE_PROPOSALS,
} from '../../mock-data';

// ----------------------------------------------------------------------

const USD_TO_BRL_RATE = 5.5;

const ASSET_COLORS: Record<string, string> = {
  BTC: '#F7931A',
  ASPPBR: '#00A76F',
  USDT: '#0284C7',
  BRL: '#10B981',
};

export function TreasuryView() {
  const [simulationModalOpen, setSimulationModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<SafeProposal | null>(null);
  const [simulationFeedback, setSimulationFeedback] = useState<string | null>(null);

  // Cálculos consolidados da Tesouraria ASPPIBRA
  const totalUsdValuation = MOCK_SAFE_ASSETS.reduce((acc, curr) => acc + curr.valueUsd, 0);
  const totalBrlValuation = totalUsdValuation * USD_TO_BRL_RATE;

  const assetDistributions = MOCK_SAFE_ASSETS.map((asset) => {
    const percent = totalUsdValuation > 0 ? (asset.valueUsd / totalUsdValuation) * 100 : 0;
    return {
      ...asset,
      percent: Number(percent.toFixed(1)),
      color: ASSET_COLORS[asset.symbol] || '#64748B',
    };
  });

  const handleSimulate = (proposal: SafeProposal) => {
    setSelectedProposal(proposal);
    setSimulationModalOpen(true);
    setSimulationFeedback(null);
  };

  const handleExecuteSimulation = () => {
    setSimulationFeedback(
      `Simulação executada com sucesso em memória! Dry-run validado pelo motor local. NENHUMA transação foi transmitida para a rede blockchain (INV-001).`
    );
  };

  return (
    <Stack spacing={2.5}>

      {/* 2. VALORAÇÃO TOTAL CONSOLIDADA E ALOCAÇÃO DE RESERVAS (SLIM & THEME-AWARE) */}
      <Card
        sx={{
          p: 2.5,
          bgcolor: 'background.paper',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        {/* TOP ROW: VALORAÇÃO EM DESTAQUE */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2 }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}
            >
              Valoração Total Consolidada
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'baseline', mt: 0.25, flexWrap: 'wrap' }}>
              <Typography
                variant="h4"
                sx={{ color: 'success.main', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '-0.5px' }}
              >
                ${totalUsdValuation.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                <Typography component="span" variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  USD
                </Typography>
              </Typography>
              <Typography variant="subtitle1" sx={{ color: 'info.main', fontWeight: 700, fontFamily: 'monospace' }}>
                ≈ R$ {totalBrlValuation.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}{' '}
                <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                  BRL
                </Typography>
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 0.25 }}>
              Reserva Multi-Ativo Conciliada (Câmbio Base PTAX / D1)
            </Typography>
          </Box>

          <Chip
            label="100% Auditada em Partidas Dobradas"
            size="small"
            color="success"
            variant="soft"
            icon={<Iconify icon={'solar:shield-check-bold' as any} width={15} />}
            sx={{ fontWeight: 700, fontSize: '0.72rem' }}
          />
        </Stack>

        {/* DIVIDER */}
        <Divider sx={{ mb: 2, borderColor: 'divider' }} />

        {/* BOTTOM ROW: COMPOSIÇÃO PERCENTUAL SLIM */}
        <Box>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}
            >
              Composição Percentual da Reserva
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace' }}>
              4 Ativos em Custódia
            </Typography>
          </Stack>

          {/* Barra Visual Segmentada Slim */}
          <Box
            sx={{
              display: 'flex',
              height: 8,
              borderRadius: 1,
              overflow: 'hidden',
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16),
              mb: 1.25,
            }}
          >
            {assetDistributions.map((asset) => (
              <Tooltip
                key={asset.symbol}
                title={`${asset.name} (${asset.symbol}): ${asset.percent}% • $${asset.valueUsd.toLocaleString()} USD`}
              >
                <Box
                  sx={{
                    width: `${asset.percent}%`,
                    bgcolor: asset.color,
                    transition: 'width 0.3s ease',
                  }}
                />
              </Tooltip>
            ))}
          </Box>

          {/* Legenda dos Ativos Slim */}
          <Grid container spacing={1.5}>
            {assetDistributions.map((asset) => (
              <Grid key={asset.symbol} size={{ xs: 6, sm: 3 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: asset.color, flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap' }}>
                    {asset.symbol} ({asset.percent}%)
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '0.7rem', whiteSpace: 'nowrap' }}
                  >
                    ≈ ${asset.valueUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>

      {/* 3. ASSET BALANCES ROW (SLIM, EQUAL-HEIGHT, THEME-AWARE) */}
      <Grid container spacing={2}>
        {MOCK_SAFE_ASSETS.map((asset) => (
          <Grid key={asset.symbol} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                p: 2.25,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                bgcolor: 'background.paper',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Box>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {asset.name}
                  </Typography>
                  <Chip
                    label={asset.symbol}
                    size="small"
                    variant="soft"
                    sx={{
                      height: 20,
                      fontSize: '0.68rem',
                      fontWeight: 800,
                    }}
                  />
                </Stack>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: 'text.primary',
                    fontFamily: 'monospace',
                    letterSpacing: '-0.5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {asset.balance}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'success.main', fontWeight: 600, fontFamily: 'monospace', display: 'block', mt: 0.25 }}
                >
                  ≈ ${asset.valueUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </Typography>
              </Box>

              {asset.role && (
                <Box sx={{ mt: 1.5, pt: 1, borderTop: (theme) => `1px dashed ${theme.palette.divider}` }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.72rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={asset.role}
                  >
                    {asset.role}
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 4. DUAL COLUMN: ACTIVE PROPOSALS & SIGNERS MATRIX (THEME-AWARE) */}
      <Grid container spacing={2.5}>
        {/* Proposals Column */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card
            sx={{
              p: 2.5,
              bgcolor: 'background.paper',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              height: '100%',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
              Treasury Proposals ({MOCK_SAFE_PROPOSALS.length})
            </Typography>

            <Stack spacing={1.5}>
              {MOCK_SAFE_PROPOSALS.map((p) => {
                const quorumPercent = (p.confirmations / p.threshold) * 100;
                return (
                  <Box
                    key={p.id}
                    sx={{
                      p: 1.75,
                      bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      borderRadius: 1.5,
                    }}
                  >
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <Chip
                            label={p.id}
                            size="small"
                            variant="soft"
                            color="info"
                            sx={{
                              height: 20,
                              fontSize: '0.68rem',
                              fontWeight: 800,
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            {p.title}
                          </Typography>
                        </Stack>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                          Type: {p.type} • Target: <code>{p.targetAddress}</code>
                        </Typography>
                      </Box>

                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={() => handleSimulate(p)}
                        startIcon={<Iconify icon={'solar:play-circle-bold' as any} width={14} />}
                        sx={{
                          fontSize: '0.72rem',
                          textTransform: 'none',
                          py: 0.3,
                          px: 1,
                        }}
                      >
                        Simular (Local)
                      </Button>
                    </Stack>

                    <Stack spacing={0.5} sx={{ mt: 1.25 }}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Signatures: {p.confirmations} / {p.threshold} ({p.status})
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'info.main', fontWeight: 700, fontFamily: 'monospace' }}>
                          {p.valueEth}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={quorumPercent}
                        color={quorumPercent >= 100 ? 'success' : 'info'}
                        sx={{
                          height: 5,
                          borderRadius: 1,
                          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16),
                        }}
                      />
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          </Card>
        </Grid>

        {/* Signers Matrix Column */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card
            sx={{
              p: 2.5,
              bgcolor: 'background.paper',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              height: '100%',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
              Authorized Signers Matrix ({MOCK_SAFE_SIGNERS.length})
            </Typography>

            <Stack spacing={1.25}>
              {MOCK_SAFE_SIGNERS.map((signer) => (
                <Box
                  key={signer.address}
                  sx={{
                    p: 1.5,
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 1.5,
                  }}
                >
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {signer.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                        {signer.address} • {signer.role}
                      </Typography>
                    </Box>

                    <Chip
                      label={signer.status}
                      size="small"
                      variant="soft"
                      color={
                        signer.status === 'CONFIRMED'
                          ? 'success'
                          : signer.status === 'PENDING'
                            ? 'warning'
                            : 'default'
                      }
                      sx={{
                        height: 20,
                        fontSize: '0.62rem',
                        fontWeight: 800,
                      }}
                    />
                  </Stack>
                </Box>
              ))}
            </Stack>

            <Box sx={{ mt: 2, p: 1.25, bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04), borderRadius: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Note: Signer EVM identities are separated from Operator Ed25519 device identities (INV-010).
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* 5. TRANSACTION SIMULATION MODAL (SIMULATION ONLY) */}
      <Dialog
        open={simulationModalOpen}
        onClose={() => setSimulationModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}`, pb: 2 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Iconify icon={'solar:play-bold' as any} width={20} sx={{ color: 'warning.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Simulador de Transação Safe (In-Memory Dry-Run)
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            ASPPIBRA Protocol Vault • SIMULATION ONLY • ZERO BLOCKCHAIN INTERACTION
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          {selectedProposal && (
            <Stack spacing={2.5}>
              <Box sx={{ p: 2, bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04), borderRadius: 1.5, border: (theme) => `1px solid ${theme.palette.divider}` }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  PROPOSTA SELECIONADA
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: 'info.main', my: 0.5 }}>
                  {selectedProposal.id}: {selectedProposal.title}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  Amount: {selectedProposal.valueEth} → Recipient: {selectedProposal.targetAddress}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04), borderRadius: 1.5, border: (theme) => `1px solid ${theme.palette.divider}` }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  MOCK EXECUTION PRE-CHECK
                </Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Estimated Gas Units:</Typography>
                    <Typography variant="caption" sx={{ color: 'success.main', fontFamily: 'monospace' }}>42,108 Gas (Mock)</Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Operation Policy Check:</Typography>
                    <Typography variant="caption" sx={{ color: 'success.main', fontFamily: 'monospace' }}>ALLOWED (SIMULATION_ONLY)</Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>State Mutation Result:</Typography>
                    <Typography variant="caption" sx={{ color: 'warning.main', fontFamily: 'monospace' }}>SANDBOX ISOLATED (NO EVM WRITE)</Typography>
                  </Stack>
                </Stack>
              </Box>

              {simulationFeedback && (
                <Alert severity="success">
                  {simulationFeedback}
                </Alert>
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
          <Button
            onClick={() => setSimulationModalOpen(false)}
            sx={{ color: 'text.secondary', textTransform: 'none' }}
          >
            Fechar
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleExecuteSimulation}
            sx={{
              fontWeight: 800,
              textTransform: 'none',
            }}
          >
            Executar Dry-Run Local
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
