import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';

import { Iconify } from 'src/components/iconify';

import { MOCK_DEVICES, type MockDevice } from '../../mock-data';

// ----------------------------------------------------------------------

export function SecurityView() {
  const [selectedDevice, setSelectedDevice] = useState<MockDevice | null>(null);

  const getStatusColor = (status: MockDevice['status']) => {
    switch (status) {
      case 'ACTIVE':
        return '#10B981';
      case 'SUSPENDED':
        return '#F59E0B';
      case 'REVOKED':
        return '#EF4444';
      default:
        return '#94A3B8';
    }
  };

  return (
    <Stack spacing={3}>
      {/* 1. HEADER */}
      <Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#F8FAFC' }}>
            Security Operations & Device Registry
          </Typography>
          <Chip
            label="MOCK IDENTITIES"
            size="small"
            sx={{
              bgcolor: 'rgba(56, 189, 248, 0.15)',
              color: '#38BDF8',
              fontWeight: 700,
              fontSize: '0.68rem',
            }}
          />
        </Stack>
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          Visualização do catálogo de dispositivos autenticados por Ed25519 (INV-007). Chaves estritamente fictícias. Zero credenciais privadas em memória.
        </Typography>
      </Box>

      {/* 2. STATS SUMMARY ROW */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 2.5, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  ACTIVE DEVICES
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981', my: 0.5 }}>
                  1
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  AAL2 Session Active
                </Typography>
              </Box>
              <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                <Iconify icon={'solar:laptop-bold' as any} width={24} />
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 2.5, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  SUSPENDED SESSIONS
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B', my: 0.5 }}>
                  1
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Inactivity Timeout
                </Typography>
              </Box>
              <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
                <Iconify icon={'solar:clock-circle-bold' as any} width={24} />
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 2.5, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  REVOKED DEVICES
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#EF4444', my: 0.5 }}>
                  1
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Decommissioned by Admin
                </Typography>
              </Box>
              <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
                <Iconify icon={'solar:shield-cross-bold' as any} width={24} />
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* 3. DEVICE REGISTRY TABLE */}
      <Card
        sx={{
          bgcolor: '#0F172A',
          border: '1px solid #1E293B',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 2.5, borderBottom: '1px solid #1E293B' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
            Registered Hardware Enclaves & Workstations
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            Cada dispositivo possui uma chave pública Ed25519 independente de identidades EVM ou credenciais de usuários humanos.
          </Typography>
        </Box>

        <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#0B0F17' }}>
                <TableCell sx={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.72rem' }}>DISPOSITIVO</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.72rem' }}>STATUS</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.72rem' }}>ED25519 PUBKEY (MOCK)</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.72rem' }}>PLATAFORMA</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.72rem' }}>ÚLTIMA ATIVIDADE</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.72rem', textAlign: 'right' }}>AÇÕES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MOCK_DEVICES.map((d) => (
                <TableRow
                  key={d.id}
                  sx={{
                    borderBottom: '1px solid #1E293B',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1,
                          bgcolor: 'rgba(255, 255, 255, 0.04)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#38BDF8',
                        }}
                      >
                        <Iconify icon={'solar:laptop-minimalistic-bold' as any} width={18} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#F1F5F9' }}>
                          {d.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B', fontFamily: 'monospace' }}>
                          ID: {d.id}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={d.status}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        bgcolor: `${getStatusColor(d.status)}20`,
                        color: getStatusColor(d.status),
                        border: `1px solid ${getStatusColor(d.status)}40`,
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#38BDF8' }}>
                    {d.ed25519PublicKey.slice(0, 24)}...
                  </TableCell>

                  <TableCell sx={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                    {d.os} ({d.arch})
                  </TableCell>

                  <TableCell sx={{ fontSize: '0.8rem', color: '#E2E8F0' }}>
                    {d.lastActivity}
                  </TableCell>

                  <TableCell sx={{ textAlign: 'right' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setSelectedDevice(d)}
                      sx={{
                        fontSize: '0.72rem',
                        textTransform: 'none',
                        color: '#38BDF8',
                        borderColor: 'rgba(56, 189, 248, 0.3)',
                        '&:hover': { borderColor: '#38BDF8', bgcolor: 'rgba(56, 189, 248, 0.1)' },
                      }}
                    >
                      Inspecionar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* 4. INVARIANTS COMPLIANCE NOTICE */}
      <Box sx={{ p: 2, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 1.5 }}>
        <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5, fontWeight: 700 }}>
          SECURITY ARCHITECTURE INVARIANTS:
        </Typography>
        <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block' }}>
          • <strong>INV-005 & INV-006:</strong> Nenhuma chave privada manipulada em JavaScript ou transmitida pela rede.
          <br />
          • <strong>INV-007:</strong> Identidade de dispositivo Ed25519 permanece estritamente desacoplada da identidade humana.
          <br />
          • <strong>INV-010:</strong> Identidade Ed25519 não se confunde com chave signatária EVM do cofre Safe.
        </Typography>
      </Box>

      {/* 5. DEVICE DETAILS MODAL */}
      <Dialog
        open={Boolean(selectedDevice)}
        onClose={() => setSelectedDevice(null)}
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
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Detalhes do Dispositivo (Mock)
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            ID: {selectedDevice?.id}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          {selectedDevice && (
            <Stack spacing={2}>
              <Box sx={{ p: 2, bgcolor: '#0B0F17', borderRadius: 1.5, border: '1px solid #1E293B' }}>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                  CHAVE PÚBLICA ED25519 (FICTÍCIA)
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#38BDF8', wordBreak: 'break-all', mt: 0.5 }}>
                  {selectedDevice.ed25519PublicKey}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: '#0B0F17', borderRadius: 1.5, border: '1px solid #1E293B' }}>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                  SESSION TOKEN HASH (SHA-256 MOCK)
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#F59E0B', wordBreak: 'break-all', mt: 0.5 }}>
                  {selectedDevice.sessionHash}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: '#0B0F17', borderRadius: 1.5, border: '1px solid #1E293B' }}>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 1 }}>
                  CAPABILITIES CONCEDIDAS
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  {selectedDevice.capabilities.length > 0 ? (
                    selectedDevice.capabilities.map((cap) => (
                      <Chip
                        key={cap}
                        label={cap}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(56, 189, 248, 0.1)',
                          color: '#38BDF8',
                          fontSize: '0.68rem',
                          fontFamily: 'monospace',
                        }}
                      />
                    ))
                  ) : (
                    <Typography variant="caption" sx={{ color: '#EF4444' }}>
                      Nenhuma capability ativa (Dispositivo Revogado)
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: '1px solid #1E293B' }}>
          <Button onClick={() => setSelectedDevice(null)} sx={{ color: '#94A3B8' }}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
