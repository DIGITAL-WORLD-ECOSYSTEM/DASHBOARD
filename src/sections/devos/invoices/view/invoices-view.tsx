import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
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

import {
  INITIAL_INVOICES,
  type InvoiceItem,
} from '../invoices-data';

// ----------------------------------------------------------------------

export function InvoicesView() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(INITIAL_INVOICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [newInvoiceModalOpen, setNewInvoiceModalOpen] = useState(false);
  const [feedbackAlert, setFeedbackAlert] = useState<string | null>(null);

  // Formulário de nova fatura
  const [newMemberName, setNewMemberName] = useState('Andressa de Lima Ferreira');
  const [newMemberDoc, setNewMemberDoc] = useState('CPF ***.***.780-**');
  const [newDescription, setNewDescription] = useState('Mensalidade Associativa ASPPIBRA');
  const [newReferenceMonth, setNewReferenceMonth] = useState('2026-11');
  const [newAmount, setNewAmount] = useState('800.00');
  const [newDueDate, setNewDueDate] = useState('2026-11-20');

  // Cálculos consolidados
  const totalBilled = invoices.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSettled = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = totalBilled - totalSettled;
  const settlementRate = totalBilled > 0 ? (totalSettled / totalBilled) * 100 : 0;

  // Filtros
  const filteredInvoices = useMemo(() => invoices.filter((inv) => {
      const matchSearch =
        !searchQuery ||
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.referenceMonth.includes(searchQuery) ||
        inv.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === 'all' || inv.status === statusFilter;

      return matchSearch && matchStatus;
    }), [invoices, searchQuery, statusFilter]);

  const paginatedInvoices = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredInvoices.slice(start, start + rowsPerPage);
  }, [filteredInvoices, page, rowsPerPage]);

  const handleSettleInvoice = (inv: InvoiceItem) => {
    const today = new Date().toISOString().slice(0, 10);
    setInvoices(
      invoices.map((item) =>
        item.id === inv.id
          ? {
              ...item,
              status: 'paid',
              settledDate: today,
              paymentMethod: 'Pix Instantâneo (Liquidação Manual)',
            }
          : item
      )
    );
    setFeedbackAlert(`Fatura ${inv.id} liquidada com sucesso! Lançamento de crédito enviado ao Livro-Razão D1.`);
    if (selectedInvoice?.id === inv.id) {
      setSelectedInvoice({
        ...selectedInvoice,
        status: 'paid',
        settledDate: today,
        paymentMethod: 'Pix Instantâneo (Liquidação Manual)',
      });
    }
  };

  const handleCreateInvoice = () => {
    const numAmt = parseFloat(newAmount) || 0;
    if (numAmt <= 0) return;

    const newId = `INV-2026-${(invoices.length + 1).toString().padStart(3, '0')}`;
    const newInv: InvoiceItem = {
      id: newId,
      memberId: 10,
      memberName: newMemberName,
      memberDoc: newMemberDoc,
      description: newDescription,
      referenceMonth: newReferenceMonth,
      amount: numAmt,
      amountFormatted: `R$ ${numAmt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      dueDate: newDueDate,
      settledDate: null,
      paymentMethod: 'Boleto / Pix Dinâmico',
      status: 'pending',
    };

    setInvoices([newInv, ...invoices]);
    setNewInvoiceModalOpen(false);
    setFeedbackAlert(`Fatura ${newId} emitida com sucesso para ${newMemberName}!`);
  };

  return (
    <Stack spacing={2.5}>
      {/* 1. HEADER SLIM */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}
      >
        <Box>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
              Faturas & Mensalidades (Invoices)
            </Typography>
            <Chip
              label="RECEBÍVEIS DA ASSOCIAÇÃO"
              size="small"
              color="primary"
              variant="soft"
              sx={{ fontWeight: 800, fontSize: '0.68rem' }}
            />
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Emissão de faturas, acompanhamento de adimplência dos membros e liquidação contábil automática na tesouraria.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Iconify icon={'solar:add-circle-bold' as any} width={20} />}
          onClick={() => setNewInvoiceModalOpen(true)}
          sx={{ fontWeight: 800, textTransform: 'none', whiteSpace: 'nowrap' }}
        >
          Emitir Nova Fatura
        </Button>
      </Stack>

      {/* FEEDBACK ALERT */}
      {feedbackAlert && (
        <Alert severity="success" onClose={() => setFeedbackAlert(null)}>
          {feedbackAlert}
        </Alert>
      )}

      {/* 2. KPI METRICS CARDS */}
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
                Faturamento Auditado
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
                <Iconify icon={'solar:bill-check-bold' as any} width={20} />
              </Box>
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'text.primary' }}>
              R$ {totalBilled.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5, display: 'block' }}>
              {invoices.length} faturas emitidas no histórico
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
                Total Liquidado / Recebido
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
                <Iconify icon={'solar:check-circle-bold' as any} width={20} />
              </Box>
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'success.main' }}>
              R$ {totalSettled.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Typography>
            <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700, mt: 0.5, display: 'block' }}>
              ● {settlementRate.toFixed(1)}% Taxa de Adimplência
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
                Recebíveis em Aberto
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
                <Iconify icon={'solar:clock-circle-bold' as any} width={20} />
              </Box>
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'warning.main' }}>
              R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5, display: 'block' }}>
              Restante a conciliar (Andressa #2024001)
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
                Membros Contribuintes
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
                <Iconify icon={'solar:users-group-two-rounded-bold' as any} width={20} />
              </Box>
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'text.primary' }}>
              12 Associados
            </Typography>
            <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700, mt: 0.5, display: 'block' }}>
              ● 100% Identidades Verificadas
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* 3. TABELA DE FATURAS */}
      <Card
        sx={{
          p: 2.5,
          bgcolor: 'background.paper',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Buscar por fatura, associado ou competência..."
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
            sx={{ flex: 1, width: { xs: '100%', sm: 'auto' } }}
          />

          <TextField
            select
            size="small"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 160, width: { xs: '100%', sm: 'auto' } }}
          >
            <MenuItem value="all">Todos os Status</MenuItem>
            <MenuItem value="paid">Liquidadas (Pagas)</MenuItem>
            <MenuItem value="pending">Pendentes</MenuItem>
            <MenuItem value="overdue">Em Atraso / Vencidas</MenuItem>
          </TextField>
        </Stack>

        <TableContainer sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 1.5 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem', width: 110 }}>
                  FATURA / ID
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem' }}>
                  ASSOCIADO / MEMBRO
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem' }}>
                  COMPETÊNCIA
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem' }}>
                  VENCIMENTO
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem' }}>
                  MÉTODO / GATEWAY
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem', textAlign: 'right' }}>
                  VALOR (BRL)
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem', textAlign: 'center' }}>
                  STATUS
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem', textAlign: 'center', width: 110 }}>
                  AÇÕES
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedInvoices.map((inv) => (
                <TableRow key={inv.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell sx={{ fontFamily: 'monospace', fontWeight: 800, color: 'primary.main', fontSize: '0.78rem' }}>
                    {inv.id}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.primary' }}>
                      {inv.memberName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                      {inv.memberDoc}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.78rem', color: 'text.primary', fontWeight: 600 }}>
                    {inv.referenceMonth}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                    {inv.dueDate}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.78rem', color: 'text.secondary', maxWidth: 180 }}>
                    <Typography variant="caption" noWrap sx={{ display: 'block' }}>
                      {inv.paymentMethod}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right', fontWeight: 800, fontFamily: 'monospace', fontSize: '0.82rem', color: inv.status === 'paid' ? 'success.main' : 'text.primary' }}>
                    {inv.amountFormatted}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Chip
                      label={inv.status === 'paid' ? 'Liquidada' : inv.status === 'overdue' ? 'Em Atraso' : 'Pendente'}
                      size="small"
                      variant="soft"
                      color={inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'error' : 'warning'}
                      sx={{ height: 20, fontSize: '0.68rem', fontWeight: 800 }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                      <Tooltip title="Ver Recibo / Fatura">
                        <IconButton
                          size="small"
                          onClick={() => setSelectedInvoice(inv)}
                          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                        >
                          <Iconify icon={'solar:file-text-bold' as any} width={18} />
                        </IconButton>
                      </Tooltip>
                      {inv.status !== 'paid' && (
                        <Tooltip title="Dar Baixa / Liquidar Fatura">
                          <IconButton
                            size="small"
                            onClick={() => handleSettleInvoice(inv)}
                            sx={{ color: 'warning.main', '&:hover': { color: 'success.main' } }}
                          >
                            <Iconify icon={'solar:check-circle-bold' as any} width={18} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedInvoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                    Nenhuma fatura encontrada para os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredInvoices.length}
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

      {/* MODAL DE EMISSÃO DE FATURA */}
      <Dialog
        open={newInvoiceModalOpen}
        onClose={() => setNewInvoiceModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Emitir Nova Fatura de Mensalidade
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            A fatura será vinculada à identidade do associado e registrada no Livro-Razão.
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome do Associado"
              fullWidth
              size="small"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Documento (CPF / ID)"
                  fullWidth
                  size="small"
                  value={newMemberDoc}
                  onChange={(e) => setNewMemberDoc(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Competência (AAAA-MM)"
                  fullWidth
                  size="small"
                  value={newReferenceMonth}
                  onChange={(e) => setNewReferenceMonth(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Valor (R$)"
                  fullWidth
                  size="small"
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Data de Vencimento"
                  fullWidth
                  size="small"
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
            </Grid>

            <TextField
              label="Descrição do Recebível"
              fullWidth
              size="small"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
          <Button onClick={() => setNewInvoiceModalOpen(false)} sx={{ color: 'text.secondary', textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateInvoice}
            sx={{ fontWeight: 800, textTransform: 'none' }}
          >
            Emitir Fatura
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL DE RECIBO / FATURA DETALHADA */}
      <Dialog
        open={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                Fatura de Mensalidade • {selectedInvoice?.id}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Associação dos Proprietários e Parceiros do Brasil (ASPPIBRA)
              </Typography>
            </Box>
            <IconButton onClick={() => setSelectedInvoice(null)} size="small">
              <Iconify icon={'solar:close-circle-bold' as any} width={20} />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5 }}>
          {selectedInvoice && (
            <Stack spacing={2.5}>
              {/* STATUS BANNER */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1.5,
                  bgcolor: (theme) =>
                    selectedInvoice.status === 'paid'
                      ? alpha(theme.palette.success.main, 0.08)
                      : alpha(theme.palette.warning.main, 0.08),
                  border: (theme) =>
                    `1px solid ${
                      selectedInvoice.status === 'paid'
                        ? theme.palette.success.main
                        : theme.palette.warning.main
                    }`,
                }}
              >
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 800,
                        color: selectedInvoice.status === 'paid' ? 'success.main' : 'warning.main',
                      }}
                    >
                      {selectedInvoice.status === 'paid' ? 'FATURA LIQUIDADA E COMPROVADA' : 'FATURA PENDENTE DE LIQUIDAÇÃO'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {selectedInvoice.status === 'paid'
                        ? `Liquidada em ${selectedInvoice.settledDate} via ${selectedInvoice.paymentMethod}`
                        : `Vencimento previsto para ${selectedInvoice.dueDate}`}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      color: selectedInvoice.status === 'paid' ? 'success.main' : 'warning.main',
                    }}
                  >
                    {selectedInvoice.amountFormatted}
                  </Typography>
                </Stack>
              </Box>

              {/* DADOS DO MEMBRO & DETALHES */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1.5,
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Membro / Pagador:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {selectedInvoice.memberName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {selectedInvoice.memberDoc}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Competência:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {selectedInvoice.referenceMonth}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Ref. Contábil D1: #{selectedInvoice.txId || 'GEN-PENDING'}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Descrição do Serviço / Contribuição:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {selectedInvoice.description}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* CONCILIAÇÃO BANCÁRIA & D1 CARIMBO */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1.5,
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                  border: (theme) => `1px dashed ${theme.palette.divider}`,
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  AUTENTICAÇÃO & PROTOCOLO D1
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontFamily: 'monospace', color: 'primary.main', wordBreak: 'break-all', fontSize: '0.72rem' }}
                >
                  D1-HASH: 05d4084730d36b1073d62c37ab83e9c425d795b5ff34ed949083cdbf02fd7b33::{selectedInvoice.id}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
          {selectedInvoice && selectedInvoice.status !== 'paid' && (
            <Button
              variant="contained"
              color="success"
              onClick={() => handleSettleInvoice(selectedInvoice)}
              sx={{ fontWeight: 800, textTransform: 'none' }}
            >
              Confirmar Recebimento / Liquidar
            </Button>
          )}
          <Button onClick={() => setSelectedInvoice(null)} sx={{ color: 'text.secondary', textTransform: 'none' }}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
