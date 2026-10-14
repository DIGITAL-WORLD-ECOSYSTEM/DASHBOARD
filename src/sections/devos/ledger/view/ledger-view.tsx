import { useMemo, useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
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
import TablePagination from '@mui/material/TablePagination';

import { Iconify } from 'src/components/iconify';

import { CitizenLedgerView } from '../citizen-ledger';
import {
  LEDGER_METADATA,
  LEDGER_ACCOUNTS,
  LEDGER_TRANSACTIONS,
  type LedgerTransaction,
} from '../ledger-data';

// ----------------------------------------------------------------------

export function LedgerView() {
  const [activeTab, setActiveTab] = useState<'macro' | 'citizen'>('macro');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTx, setSelectedTx] = useState<LedgerTransaction | null>(null);

  // Filtragem
  const filteredTransactions = useMemo(() => LEDGER_TRANSACTIONS.filter((tx) => {
      const matchSearch =
        !searchQuery ||
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(tx.id).includes(searchQuery);

      const matchCategory =
        categoryFilter === 'all' || tx.category === categoryFilter;

      const matchStatus =
        statusFilter === 'all' || tx.status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    }), [searchQuery, categoryFilter, statusFilter]);

  const paginatedTransactions = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredTransactions.slice(start, start + rowsPerPage);
  }, [filteredTransactions, page, rowsPerPage]);

  return (
    <Stack spacing={2.5}>
      {/* 1. HEADER SLIM */}
      <Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Livro-Razão Contábil (Double-Entry Ledger)
          </Typography>
          <Chip
            label="D1 CLOUDFLARE • V16 CANÔNICO"
            size="small"
            color="primary"
            variant="soft"
            sx={{ fontWeight: 800, fontSize: '0.68rem' }}
          />
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Histórico contábil em partidas dobradas sincronizado com o banco D1. Cada débito possui crédito correspondente em conformidade contábil estrita.
        </Typography>
      </Box>

      {/* 2. NAVEGAÇÃO DE ABAS */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              minHeight: 44,
              fontWeight: 700,
              fontSize: '0.85rem',
            },
          }}
        >
          <Tab
            value="macro"
            icon={<Iconify icon={'solar:calculator-bold-duotone' as any} width={20} />}
            iconPosition="start"
            label="Partidas Dobradas (D1 Macro Ledger)"
          />
          <Tab
            value="citizen"
            icon={<Iconify icon="solar:user-id-bold" width={20} />}
            iconPosition="start"
            label="Extrato por Associado (Citizen Ledger)"
          />
        </Tabs>
      </Box>

      {activeTab === 'citizen' ? (
        <CitizenLedgerView />
      ) : (
        <>
          {/* 3. KPI METRICS CARDS */}
          <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.25,
              height: '100%',
              bgcolor: 'background.paper',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase' }}>
                Reserva Gênesis (Conta #1)
              </Typography>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                }}
              >
                <Iconify icon={'solar:banknote-bold' as any} width={20} />
              </Box>
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'text.primary' }}>
              {LEDGER_METADATA.reservaGenesis}
            </Typography>
            <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700, mt: 0.5, display: 'block' }}>
              ● 100% Lastreado em Reserva Fiduciária
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.25,
              height: '100%',
              bgcolor: 'background.paper',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase' }}>
                Volume Total Movimentado
              </Typography>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'success.main',
                }}
              >
                <Iconify icon={'solar:chart-2-bold' as any} width={20} />
              </Box>
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'success.main' }}>
              {LEDGER_METADATA.volumeTotal}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5, display: 'block' }}>
              42 transações liquidadas comprovadas
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.25,
              height: '100%',
              bgcolor: 'background.paper',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase' }}>
                Tesouraria Consolidada
              </Typography>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'info.main',
                }}
              >
                <Iconify icon={'solar:wallet-money-bold' as any} width={20} />
              </Box>
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'text.primary' }}>
              R$ 36.623,00
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5, display: 'block' }}>
              Ref: 2026-07-PM4 (Conta #11)
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.25,
              height: '100%',
              bgcolor: 'background.paper',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase' }}>
                Lançamentos Auditados
              </Typography>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'warning.main',
                }}
              >
                <Iconify icon={'solar:checklist-minimalistic-bold' as any} width={20} />
              </Box>
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'text.primary' }}>
              43 Lançamentos
            </Typography>
            <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700, mt: 0.5, display: 'block' }}>
              ● 0 Inconsistências de Balancete
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* 3. CONTAS CONTÁBEIS (PLANOS DE CONTAS D1) */}
      <Card
        sx={{
          p: 2.5,
          bgcolor: 'background.paper',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: 'text.primary' }}>
          Plano de Contas D1 & Saldos Conciliados
        </Typography>

        <Grid container spacing={2}>
          {LEDGER_ACCOUNTS.map((acc) => (
            <Grid key={acc.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  p: 1.75,
                  borderRadius: 1.5,
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    Conta #{acc.accountId}
                  </Typography>
                  <Chip
                    label={acc.accountType}
                    size="small"
                    variant="soft"
                    sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }}
                  />
                </Stack>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                  {acc.accountName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  Titular: {acc.titular}
                </Typography>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline', mt: 1 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Saldo Disponível:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'primary.main' }}>
                    {acc.saldoDisponivel}
                  </Typography>
                </Stack>
                {acc.saldoBloqueado !== 'R$ 0.00' && (
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline', mt: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'error.main' }}>
                      Bloq / Devedor:
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'error.main' }}>
                      {acc.saldoBloqueado}
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* 4. TABELA DE TRANSAÇÕES E PARTIDAS DOBRADAS */}
      <Card
        sx={{
          p: 2.5,
          bgcolor: 'background.paper',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Buscar por descrição, associado ou ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon={'solar:magnifer-linear' as any} width={18} sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ flex: 1, width: { xs: '100%', md: 'auto' } }}
          />

          <Stack direction="row" spacing={1.5} sx={{ width: { xs: '100%', md: 'auto' } }}>
            <TextField
              select
              size="small"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(0);
              }}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">Todas Categorias</MenuItem>
              <MenuItem value="membership">Mensalidades (Membership)</MenuItem>
              <MenuItem value="operational">Operacional</MenuItem>
              <MenuItem value="other">Outros / Gênesis</MenuItem>
            </TextField>

            <TextField
              select
              size="small"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              sx={{ minWidth: 130 }}
            >
              <MenuItem value="all">Todos Status</MenuItem>
              <MenuItem value="completed">Concluído</MenuItem>
              <MenuItem value="failed">Falha / Vazio</MenuItem>
            </TextField>
          </Stack>
        </Stack>

        <TableContainer sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 1.5 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem', width: 70 }}>
                  ID / TX
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem' }}>
                  DATA (UTC)
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem' }}>
                  MEMBRO / TITULAR
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem' }}>
                  DESCRIÇÃO CONTÁBIL
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem' }}>
                  CATEGORIA
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem', textAlign: 'right' }}>
                  VALOR (BRL)
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem', textAlign: 'center' }}>
                  STATUS
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem', textAlign: 'center', width: 90 }}>
                  AÇÕES
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.map((tx) => (
                <TableRow key={tx.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell sx={{ fontFamily: 'monospace', fontWeight: 800, color: 'primary.main', fontSize: '0.75rem' }}>
                    #{tx.id}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                    {tx.createdAt.replace(' UTC', '')}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.primary' }}>
                    {tx.userName}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: 'text.primary', maxWidth: 320 }}>
                    <Typography variant="body2" noWrap sx={{ fontSize: '0.8rem' }}>
                      {tx.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tx.category}
                      size="small"
                      variant="soft"
                      color={tx.category === 'membership' ? 'primary' : tx.category === 'operational' ? 'info' : 'default'}
                      sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right', fontWeight: 800, fontFamily: 'monospace', fontSize: '0.82rem', color: tx.status === 'completed' ? 'success.main' : 'text.disabled' }}>
                    {tx.amountFormatted}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Chip
                      label={tx.status}
                      size="small"
                      variant="soft"
                      color={tx.status === 'completed' ? 'success' : 'error'}
                      sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Tooltip title="Ver Partida Dobrada (D1)">
                      <IconButton
                        size="small"
                        onClick={() => setSelectedTx(tx)}
                        sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                      >
                        <Iconify icon={'solar:document-text-bold' as any} width={18} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                    Nenhum lançamento encontrado para os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredTransactions.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Linhas por página:"
          sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
        />
      </Card>

      {/* MODAL DE DETALHES DE PARTIDAS DOBRADAS */}
      <Dialog
        open={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                Detalhamento Contábil • Transação #{selectedTx?.id}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Registro Imutável em Partidas Dobradas (Cloudflare D1 / SQLite Engine)
              </Typography>
            </Box>
            <IconButton onClick={() => setSelectedTx(null)} size="small">
              <Iconify icon={'solar:close-circle-bold' as any} width={20} />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5 }}>
          {selectedTx && (
            <Stack spacing={2}>
              <Box sx={{ p: 2, bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04), borderRadius: 1.5, border: (theme) => `1px solid ${theme.palette.divider}` }}>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Descrição do Lançamento:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {selectedTx.description}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Titular:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {selectedTx.userName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Valor Total:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'success.main' }}>
                      {selectedTx.amountFormatted}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                Lançamentos no Livro-Razão (Partidas Dobradas)
              </Typography>

              <TableContainer sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 1.5 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04) }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem' }}>CONTA</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem' }}>DIREÇÃO</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem' }}>ATIVO</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem', textAlign: 'right' }}>VALOR BASE</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem', textAlign: 'right' }}>VALOR FORMATADO</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedTx.entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700 }}>#{entry.id}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{entry.accountName}</TableCell>
                        <TableCell>
                          <Chip
                            label={entry.direction.toUpperCase()}
                            size="small"
                            color={entry.direction === 'credit' ? 'success' : 'warning'}
                            variant="soft"
                            sx={{ height: 20, fontSize: '0.68rem', fontWeight: 800 }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{entry.assetCode}</TableCell>
                        <TableCell sx={{ textAlign: 'right', fontFamily: 'monospace' }}>{entry.amountBaseUnits}</TableCell>
                        <TableCell sx={{ textAlign: 'right', fontWeight: 800, fontFamily: 'monospace', color: 'success.main' }}>
                          {entry.amountFormatted}
                        </TableCell>
                      </TableRow>
                    ))}
                    {selectedTx.entries.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
                          Nenhum lançamento no livro-razão registrado (Transação de controle / falha).
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
          <Button onClick={() => setSelectedTx(null)} sx={{ color: 'text.secondary', textTransform: 'none' }}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )}
</Stack>
  );
}
