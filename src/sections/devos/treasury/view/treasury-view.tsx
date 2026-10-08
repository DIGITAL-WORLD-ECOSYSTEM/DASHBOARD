import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';

import { Iconify } from 'src/components/iconify';

import {
  MOCK_SAFE_CONFIG,
  MOCK_SAFE_ASSETS,
  MOCK_SAFE_SIGNERS,
  MOCK_SAFE_PROPOSALS,
  type SafeProposal,
} from '../../mock-data';

// ----------------------------------------------------------------------

export function TreasuryView() {
  const [simulationModalOpen, setSimulationModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<SafeProposal | null>(null);
  const [simulationFeedback, setSimulationFeedback] = useState<string | null>(null);

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
    <Stack spacing={3}>
      {/* 1. HEADER */}
      <Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#F8FAFC' }}>
            Treasury & Safe Multisig Engine
          </Typography>
          <Chip
            label="SIMULATION ONLY"
            size="small"
            sx={{
              bgcolor: 'rgba(245, 158, 11, 0.15)',
              color: '#F59E0B',
              fontWeight: 700,
              fontSize: '0.68rem',
            }}
          />
        </Stack>
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          Representação visual determinística do cofre Safe (N-of-M), signatários e propostas de tesouraria. Nenhuma carteira Web3 ou RPC conectado.
        </Typography>
      </Box>

      {/* 2. SAFE OVERVIEW HERO CARD */}
      <Card
        sx={{
          p: 3,
          bgcolor: '#0F172A',
          border: '1px solid #1E293B',
          borderRadius: 2,
        }}
      >
        <Grid container spacing={3} sx={{ alignItems: 'center' }}>
          {/* Safe Info */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid #38BDF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38BDF8',
                }}
              >
                <Iconify icon={'solar:shield-star-bold' as any} width={32} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>
                  TREASURY SAFE MULTISIG
                </Typography>
                <Typography variant="body1" sx={{ color: '#F8FAFC', fontWeight: 800, fontFamily: 'monospace' }}>
                  {MOCK_SAFE_CONFIG.address.slice(0, 10)}...{MOCK_SAFE_CONFIG.address.slice(-8)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#10B981', display: 'block', mt: 0.2 }}>
                  {MOCK_SAFE_CONFIG.status} • Nonce: #{MOCK_SAFE_CONFIG.nonce}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Threshold & Valuation */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
              THRESHOLD CONFIGURATION
            </Typography>
            <Typography variant="h5" sx={{ color: '#F8FAFC', fontWeight: 800, fontFamily: 'monospace', my: 0.5 }}>
              {MOCK_SAFE_CONFIG.threshold} of {MOCK_SAFE_CONFIG.totalSigners} Signers
            </Typography>
            <Typography variant="caption" sx={{ color: '#38BDF8' }}>
              60% M-of-N Quorum Required
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
              TOTAL ESTIMATED VALUATION (MOCK)
            </Typography>
            <Typography variant="h4" sx={{ color: '#10B981', fontWeight: 800, fontFamily: 'monospace', my: 0.5 }}>
              $4,892,400.00 <Typography component="span" variant="body2" sx={{ color: '#94A3B8' }}>USD</Typography>
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              Multi-Asset Treasury Reserve (Arbitrum One Target)
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* 3. ASSET BALANCES ROW */}
      <Grid container spacing={2}>
        {MOCK_SAFE_ASSETS.map((asset) => (
          <Grid key={asset.symbol} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                p: 2,
                bgcolor: '#0F172A',
                border: '1px solid #1E293B',
                borderRadius: 1.5,
              }}
            >
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>
                  {asset.name}
                </Typography>
                <Chip
                  label={asset.symbol}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    bgcolor: '#1E293B',
                    color: '#38BDF8',
                  }}
                />
              </Stack>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#F8FAFC', fontFamily: 'monospace' }}>
                {asset.balance}
              </Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontFamily: 'monospace' }}>
                ≈ ${asset.valueUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 4. DUAL COLUMN: ACTIVE PROPOSALS & SIGNERS MATRIX */}
      <Grid container spacing={3}>
        {/* Proposals Column */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card
            sx={{
              p: 3,
              bgcolor: '#0F172A',
              border: '1px solid #1E293B',
              borderRadius: 2,
              height: '100%',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 2 }}>
              Treasury Proposals ({MOCK_SAFE_PROPOSALS.length})
            </Typography>

            <Stack spacing={2}>
              {MOCK_SAFE_PROPOSALS.map((p) => {
                const quorumPercent = (p.confirmations / p.threshold) * 100;
                return (
                  <Box
                    key={p.id}
                    sx={{
                      p: 2,
                      bgcolor: '#0B0F17',
                      border: '1px solid #1E293B',
                      borderRadius: 1.5,
                    }}
                  >
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <Chip
                            label={p.id}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              bgcolor: 'rgba(56, 189, 248, 0.1)',
                              color: '#38BDF8',
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#F1F5F9' }}>
                            {p.title}
                          </Typography>
                        </Stack>
                        <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.5 }}>
                          Type: {p.type} • Target: <code style={{ color: '#94A3B8' }}>{p.targetAddress}</code>
                        </Typography>
                      </Box>

                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleSimulate(p)}
                        startIcon={<Iconify icon={'solar:play-circle-bold' as any} width={14} />}
                        sx={{
                          borderColor: '#F59E0B',
                          color: '#F59E0B',
                          fontSize: '0.72rem',
                          textTransform: 'none',
                          py: 0.3,
                          '&:hover': {
                            borderColor: '#F59E0B',
                            bgcolor: 'rgba(245, 158, 11, 0.1)',
                          },
                        }}
                      >
                        Simular (Local)
                      </Button>
                    </Stack>

                    <Stack spacing={0.5} sx={{ mt: 1.5 }}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          Signatures: {p.confirmations} / {p.threshold} ({p.status})
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 700 }}>
                          {p.valueEth}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={quorumPercent}
                        sx={{
                          height: 6,
                          borderRadius: 1,
                          bgcolor: '#1E293B',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: quorumPercent >= 100 ? '#10B981' : '#38BDF8',
                          },
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
              p: 3,
              bgcolor: '#0F172A',
              border: '1px solid #1E293B',
              borderRadius: 2,
              height: '100%',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 2 }}>
              Authorized Signers Matrix ({MOCK_SAFE_SIGNERS.length})
            </Typography>

            <Stack spacing={1.5}>
              {MOCK_SAFE_SIGNERS.map((signer) => (
                <Box
                  key={signer.address}
                  sx={{
                    p: 1.5,
                    bgcolor: '#0B0F17',
                    border: '1px solid #1E293B',
                    borderRadius: 1.5,
                  }}
                >
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#F1F5F9' }}>
                        {signer.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B', fontFamily: 'monospace' }}>
                        {signer.address} • {signer.role}
                      </Typography>
                    </Box>

                    <Chip
                      label={signer.status}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        bgcolor:
                          signer.status === 'CONFIRMED'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : signer.status === 'PENDING'
                              ? 'rgba(245, 158, 11, 0.15)'
                              : 'rgba(148, 163, 184, 0.15)',
                        color:
                          signer.status === 'CONFIRMED'
                            ? '#10B981'
                            : signer.status === 'PENDING'
                              ? '#F59E0B'
                              : '#94A3B8',
                      }}
                    />
                  </Stack>
                </Box>
              ))}
            </Stack>

            <Box sx={{ mt: 2.5, p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: 1 }}>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
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
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#0F172A',
              border: '1px solid #1E293B',
              color: '#F8FAFC',
            },
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #1E293B', pb: 2 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Iconify icon={'solar:play-bold' as any} width={20} sx={{ color: '#F59E0B' }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Simulador de Transação Safe (In-Memory Dry-Run)
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            Etapa 1.1 — SIMULATION ONLY • ZERO BLOCKCHAIN INTERACTION
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          {selectedProposal && (
            <Stack spacing={2.5}>
              <Box sx={{ p: 2, bgcolor: '#0B0F17', borderRadius: 1.5, border: '1px solid #1E293B' }}>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                  PROPOSTA SELECIONADA
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#38BDF8', my: 0.5 }}>
                  {selectedProposal.id}: {selectedProposal.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block' }}>
                  Amount: {selectedProposal.valueEth} → Recipient: {selectedProposal.targetAddress}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: '#0B0F17', borderRadius: 1.5, border: '1px solid #1E293B' }}>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                  MOCK EXECUTION PRE-CHECK
                </Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>Estimated Gas Units:</Typography>
                    <Typography variant="caption" sx={{ color: '#10B981', fontFamily: 'monospace' }}>42,108 Gas (Mock)</Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>Operation Policy Check:</Typography>
                    <Typography variant="caption" sx={{ color: '#10B981', fontFamily: 'monospace' }}>ALLOWED (SIMULATION_ONLY)</Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>State Mutation Result:</Typography>
                    <Typography variant="caption" sx={{ color: '#F59E0B', fontFamily: 'monospace' }}>SANDBOX ISOLATED (NO EVM WRITE)</Typography>
                  </Stack>
                </Stack>
              </Box>

              {simulationFeedback && (
                <Alert severity="success" sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid #10B981' }}>
                  {simulationFeedback}
                </Alert>
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: '1px solid #1E293B' }}>
          <Button
            onClick={() => setSimulationModalOpen(false)}
            sx={{ color: '#94A3B8', textTransform: 'none' }}
          >
            Fechar
          </Button>
          <Button
            variant="contained"
            onClick={handleExecuteSimulation}
            sx={{
              bgcolor: '#F59E0B',
              color: '#000',
              fontWeight: 800,
              textTransform: 'none',
              '&:hover': { bgcolor: '#D97706' },
            }}
          >
            Executar Dry-Run Local
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
