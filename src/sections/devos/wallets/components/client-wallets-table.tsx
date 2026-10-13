import type { ClientWallet } from '../types/wallet-types';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface ClientWalletsTableProps {
  wallets: ClientWallet[];
  onSelectWallet: (wallet: ClientWallet) => void;
  onRefreshBalance: (wallet: ClientWallet) => void;
  loadingAddresses: Set<string>;
}

export function ClientWalletsTable({
  wallets,
  onSelectWallet,
  onRefreshBalance,
  loadingAddresses,
}: ClientWalletsTableProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const paginatedWallets = wallets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Card sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
      <TableContainer sx={{ overflowX: 'auto', maxHeight: 380 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem', width: 60 }}>
                ID
              </TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem' }}>
                USUARIO
              </TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem' }}>
                DATA DE CRIAÇÃO
              </TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem' }}>
                REDE
              </TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem' }}>
                ENDEREÇO
              </TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem', textAlign: 'right' }}>
                SALDO
              </TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem', textAlign: 'center' }}>
                KYC
              </TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem', textAlign: 'center', width: 100 }}>
                AÇÕES
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {wallets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Nenhuma carteira de associado encontrada para os filtros atuais.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedWallets.map((wallet) => {
                const isLoadingBalance = loadingAddresses.has(wallet.address.toLowerCase());

                return (
                  <TableRow key={wallet.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    {/* 1. ID */}
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'info.main', fontSize: '0.75rem' }}>
                      #{wallet.id}
                    </TableCell>

                    {/* 2. USUARIO */}
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.8rem', color: 'text.primary' }}>
                        {wallet.clientName}
                      </Typography>
                    </TableCell>

                    {/* 3. DATA DE CRIAÇÃO */}
                    <TableCell>
                      <Typography variant="body2" sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'text.primary' }}>
                        {wallet.createdAt || 'Registrado'}
                      </Typography>
                    </TableCell>

                    {/* 4. REDE */}
                    <TableCell>
                      <Chip
                        label={wallet.network}
                        size="small"
                        variant="soft"
                        color="primary"
                        sx={{ fontSize: '0.68rem', fontWeight: 700 }}
                      />
                    </TableCell>

                    {/* 5. ENDEREÇO */}
                    <TableCell>
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', fontSize: '0.75rem' }}>
                          {wallet.address.length > 12
                            ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
                            : wallet.address}
                        </Typography>
                        <Tooltip title={copiedId === wallet.id ? 'Copiado!' : 'Copiar'}>
                          <IconButton
                            size="small"
                            onClick={() => handleCopy(wallet.id, wallet.address)}
                            sx={{ color: copiedId === wallet.id ? 'success.main' : 'text.secondary' }}
                          >
                            <Iconify
                              icon={(copiedId === wallet.id ? 'solar:check-circle-bold' : 'solar:copy-bold') as any}
                              width={14}
                            />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>

                    {/* 6. SALDO */}
                    <TableCell sx={{ textAlign: 'right' }}>
                      {isLoadingBalance ? (
                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                          <CircularProgress size={12} thickness={5} />
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                            RPC...
                          </Typography>
                        </Stack>
                      ) : (
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontFamily: 'monospace',
                              fontWeight: 800,
                              fontSize: '0.8rem',
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

                    {/* 7. KYC */}
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Chip
                        label={wallet.kycStatus || 'VERIFIED'}
                        size="small"
                        color={wallet.kycStatus === 'SIMULATED_TEST' ? 'warning' : 'success'}
                        variant="soft"
                        sx={{ fontSize: '0.62rem', fontWeight: 800, height: 20 }}
                      />
                    </TableCell>

                    {/* 8. AÇÕES */}
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
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

                        <Tooltip title="Inspecionar Detalhes do Cofre">
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

      <TablePagination
        component="div"
        count={wallets.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Linhas por página:"
      />
    </Card>
  );
}
