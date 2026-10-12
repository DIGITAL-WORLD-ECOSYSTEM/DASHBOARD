import { useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

import type { DaoWallet } from '../types/wallet-types';

interface DaoWalletsTableProps {
  wallets: DaoWallet[];
  onSelectWallet: (wallet: DaoWallet) => void;
  onRefreshBalance: (wallet: DaoWallet) => void;
  loadingAddresses: Set<string>;
}

export function DaoWalletsTable({
  wallets,
  onSelectWallet,
  onRefreshBalance,
  loadingAddresses,
}: DaoWalletsTableProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Card sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>USUÁRIO</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>RÓTULO</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>CUSTÓDIA</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>REDE</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>ENDEREÇO</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>SALDO (RPC)</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>KYC</TableCell>
              <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>AÇÕES</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {wallets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Nenhuma carteira da DAO encontrada para os filtros atuais.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              wallets.map((wallet) => {
                const isLoadingBalance = loadingAddresses.has(wallet.address.toLowerCase());

                return (
                  <TableRow key={wallet.id} hover>
                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>
                      #{wallet.id}
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {wallet.user}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        {wallet.createdAt || 'Registrado'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {wallet.label}
                      </Typography>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'info.main', fontSize: '0.68rem' }}>
                        {wallet.derivationPath}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={wallet.custodyType === 'CUSTODIAL_LOCAL' ? 'Cofre Local' : 'Watch-Only'}
                        color={wallet.custodyType === 'CUSTODIAL_LOCAL' ? 'success' : 'info'}
                        variant="outlined"
                        sx={{ height: 22, fontWeight: 800, fontSize: '0.66rem' }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={wallet.network}
                        color="primary"
                        variant="outlined"
                        sx={{ height: 22, fontWeight: 700, fontSize: '0.68rem' }}
                      />
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                        </Typography>
                        <Tooltip title={copiedId === wallet.id ? 'Copiado!' : 'Copiar Endereço'}>
                          <IconButton
                            size="small"
                            onClick={() => handleCopy(wallet.id, wallet.address)}
                            sx={{ color: copiedId === wallet.id ? 'success.main' : 'text.secondary' }}
                          >
                            <Iconify
                              icon={copiedId === wallet.id ? ('solar:check-circle-bold' as any) : ('solar:copy-bold' as any)}
                              width={16}
                            />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      {isLoadingBalance ? (
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <CircularProgress size={14} thickness={5} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Consultando RPC...
                          </Typography>
                        </Stack>
                      ) : (
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontFamily: 'monospace',
                              fontWeight: 800,
                              color: wallet.balanceStatus === 'Unavailable' ? 'warning.main' : 'success.main',
                            }}
                          >
                            {wallet.balance}
                          </Typography>
                          {wallet.nonce !== undefined && wallet.nonce !== null && (
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.65rem' }}>
                              Nonce: {wallet.nonce}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          wallet.kycStatus === 'VERIFIED'
                            ? 'Verificado'
                            : wallet.kycStatus === 'SIMULATED_TEST'
                            ? 'Simulado'
                            : 'Não Verificado'
                        }
                        color={
                          wallet.kycStatus === 'VERIFIED'
                            ? 'success'
                            : wallet.kycStatus === 'SIMULATED_TEST'
                            ? 'warning'
                            : 'default'
                        }
                        sx={{ height: 20, fontSize: '0.62rem', fontWeight: 800 }}
                      />
                    </TableCell>

                    <TableCell sx={{ textAlign: 'right' }}>
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                        <Tooltip title="Consultar Saldo Real via RPC">
                          <IconButton
                            size="small"
                            onClick={() => onRefreshBalance(wallet)}
                            disabled={isLoadingBalance}
                            sx={{ color: 'primary.main' }}
                          >
                            <Iconify icon={'solar:refresh-circle-bold' as any} width={18} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Inspecionar Custódia & Metadados">
                          <IconButton
                            size="small"
                            onClick={() => onSelectWallet(wallet)}
                            sx={{ color: 'warning.main' }}
                          >
                            <Iconify icon={'solar:shield-keyhole-bold' as any} width={18} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
