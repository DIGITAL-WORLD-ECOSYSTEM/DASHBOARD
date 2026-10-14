import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
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
import Checkbox from '@mui/material/Checkbox';
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
import TableSortLabel from '@mui/material/TableSortLabel';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import TablePagination from '@mui/material/TablePagination';

import { Iconify } from 'src/components/iconify';

import {
  INITIAL_INVOICES,
  type InvoiceItem,
  type InvoiceItemDetail,
} from '../invoices-data';
import {
  DevOSInvoicePDFViewer,
  DevOSInvoicePDFDownload,
} from '../components/invoice-pdf';

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = [
  'Todas as Categorias',
  'Mensalidade Associativa',
  'Aporte de Liquidez',
  'Taxa de Governança',
  'Consultoria Técnica',
  'Contrato Smart',
];

// ----------------------------------------------------------------------

export function InvoicesView() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(INITIAL_INVOICES);
  const [statusTab, setStatusTab] = useState<'all' | 'paid' | 'pending' | 'overdue' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('Todas as Categorias');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Tabela: ordenação, paginação e densidade
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [orderBy, setOrderBy] = useState<keyof InvoiceItem>('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dense, setDense] = useState(false);

  // Seleção em lote
  const [selected, setSelected] = useState<string[]>([]);
  const [batchConfirmOpen, setBatchConfirmOpen] = useState(false);

  // Modais de detalhe, criação e PDF
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [newInvoiceModalOpen, setNewInvoiceModalOpen] = useState(false);
  const [feedbackAlert, setFeedbackAlert] = useState<{ type: 'success' | 'info' | 'warning'; message: string } | null>(null);

  // Form de Nova Fatura com múltiplos itens dinâmicos
  const [newMemberName, setNewMemberName] = useState('Andressa de Lima Ferreira');
  const [newMemberDoc, setNewMemberDoc] = useState('CPF ***.***.780-**');
  const [newMemberEmail, setNewMemberEmail] = useState('andressa.ferreira@asppibra.org.br');
  const [newReferenceMonth, setNewReferenceMonth] = useState('2026-11');
  const [newDueDate, setNewDueDate] = useState('2026-11-20');
  const [newPaymentMethod, setNewPaymentMethod] = useState('Pix Dinâmico / D1');
  const [newItems, setNewItems] = useState<InvoiceItemDetail[]>([
    {
      id: 'item-1',
      description: 'Mensalidade Associativa ASPPIBRA',
      service: 'Mensalidade Associativa',
      quantity: 1,
      price: 800.0,
      total: 800.0,
    },
  ]);
  const [newDiscount, setNewDiscount] = useState('0');
  const [newTaxes, setNewTaxes] = useState('0');

  // Cálculos Consolidados
  const totalBilled = invoices.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSettled = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = totalBilled - totalSettled;
  const settlementRate = totalBilled > 0 ? (totalSettled / totalBilled) * 100 : 0;

  // Contadores para as abas
  const countAll = invoices.length;
  const countPaid = invoices.filter((i) => i.status === 'paid').length;
  const countPending = invoices.filter((i) => i.status === 'pending').length;
  const countOverdue = invoices.filter((i) => i.status === 'overdue').length;
  const countDraft = invoices.filter((i) => i.status === 'draft').length;

  // Filtros dinâmicos
  const filteredInvoices = useMemo(() => {
    let result = invoices;

    // Filtro por Aba de Status
    if (statusTab !== 'all') {
      result = result.filter((inv) => inv.status === statusTab);
    }

    // Filtro de Busca Textual
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.id.toLowerCase().includes(q) ||
          inv.memberName.toLowerCase().includes(q) ||
          inv.memberDoc.toLowerCase().includes(q) ||
          inv.referenceMonth.toLowerCase().includes(q) ||
          inv.description.toLowerCase().includes(q) ||
          inv.paymentMethod.toLowerCase().includes(q)
      );
    }

    // Filtro por Serviço/Categoria
    if (serviceFilter !== 'Todas as Categorias') {
      result = result.filter(
        (inv) =>
          inv.description.toLowerCase().includes(serviceFilter.toLowerCase()) ||
          inv.items?.some((it) => it.service.toLowerCase().includes(serviceFilter.toLowerCase()))
      );
    }

    // Filtro por Período de Datas
    if (startDate) {
      result = result.filter((inv) => inv.dueDate >= startDate);
    }
    if (endDate) {
      result = result.filter((inv) => inv.dueDate <= endDate);
    }

    // Ordenação
    result = [...result].sort((a, b) => {
      let aVal = a[orderBy];
      let bVal = b[orderBy];

      if (orderBy === 'amount') {
        aVal = a.amount;
        bVal = b.amount;
      }

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [invoices, statusTab, searchQuery, serviceFilter, startDate, endDate, order, orderBy]);

  // Paginação
  const paginatedInvoices = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredInvoices.slice(start, start + rowsPerPage);
  }, [filteredInvoices, page, rowsPerPage]);

  const hasActiveFilters = Boolean(
    statusTab !== 'all' ||
    searchQuery.trim() ||
    serviceFilter !== 'Todas as Categorias' ||
    startDate ||
    endDate
  );

  const handleResetFilters = () => {
    setStatusTab('all');
    setSearchQuery('');
    setServiceFilter('Todas as Categorias');
    setStartDate('');
    setEndDate('');
    setPage(0);
  };

  // Ordenação de colunas
  const handleRequestSort = (property: keyof InvoiceItem) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Seleção de linhas
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = paginatedInvoices.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSelectClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Ações em Lote
  const handleBatchSettle = () => {
    const today = new Date().toISOString().slice(0, 10);
    setInvoices(
      invoices.map((inv) =>
        selected.includes(inv.id) && inv.status !== 'paid'
          ? {
              ...inv,
              status: 'paid',
              settledDate: today,
              paymentMethod: 'Pix Instantâneo (Liquidação em Lote D1)',
            }
          : inv
      )
    );
    setFeedbackAlert({
      type: 'success',
      message: `${selected.length} faturas liquidadas com sucesso com baixa instantânea no Livro-Razão D1!`,
    });
    setSelected([]);
  };

  const handleBatchDelete = () => {
    setInvoices(invoices.filter((inv) => !selected.includes(inv.id)));
    setFeedbackAlert({
      type: 'info',
      message: `${selected.length} faturas removidas do registro operacional.`,
    });
    setSelected([]);
    setBatchConfirmOpen(false);
  };

  // Liquidação individual
  const handleSettleInvoice = useCallback(
    (inv: InvoiceItem) => {
      const today = new Date().toISOString().slice(0, 10);
      setInvoices((prev) =>
        prev.map((item) =>
          item.id === inv.id
            ? {
                ...item,
                status: 'paid',
                settledDate: today,
                paymentMethod: 'Pix Instantâneo (Liquidação Manual D1)',
              }
            : item
        )
      );
      setFeedbackAlert({
        type: 'success',
        message: `Fatura ${inv.id} liquidada com sucesso! Lançamento de crédito enviado ao Livro-Razão D1.`,
      });
      if (selectedInvoice?.id === inv.id) {
        setSelectedInvoice({
          ...selectedInvoice,
          status: 'paid',
          settledDate: today,
          paymentMethod: 'Pix Instantâneo (Liquidação Manual D1)',
        });
      }
    },
    [selectedInvoice]
  );

  // Manipulação de Itens dinâmicos no modal de criação
  const handleAddItem = () => {
    const nextId = `item-${newItems.length + 1}`;
    setNewItems([
      ...newItems,
      {
        id: nextId,
        description: 'Serviço / Contribuição Adicional',
        service: 'Mensalidade Associativa',
        quantity: 1,
        price: 200.0,
        total: 200.0,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (newItems.length <= 1) return;
    setNewItems(newItems.filter((it) => it.id !== id));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItemDetail, val: any) => {
    setNewItems(
      newItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: val };
          if (field === 'quantity' || field === 'price') {
            const q = field === 'quantity' ? Number(val) || 0 : item.quantity;
            const p = field === 'price' ? Number(val) || 0 : item.price;
            updated.total = q * p;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const calculatedItemsTotal = newItems.reduce((acc, curr) => acc + curr.total, 0);
  const calculatedFinalAmount =
    calculatedItemsTotal + (parseFloat(newTaxes) || 0) - (parseFloat(newDiscount) || 0);

  const handleCreateInvoice = () => {
    if (calculatedFinalAmount <= 0) return;

    const newId = `INV-2026-${(invoices.length + 1).toString().padStart(3, '0')}`;
    const newInv: InvoiceItem = {
      id: newId,
      memberId: 10,
      memberName: newMemberName,
      memberDoc: newMemberDoc,
      memberEmail: newMemberEmail,
      description: newItems.map((i) => i.description).join(', '),
      referenceMonth: newReferenceMonth,
      amount: calculatedFinalAmount,
      amountFormatted: `R$ ${calculatedFinalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      dueDate: newDueDate,
      createDate: new Date().toISOString().slice(0, 10),
      settledDate: null,
      paymentMethod: newPaymentMethod,
      status: 'pending',
      items: newItems,
      taxes: parseFloat(newTaxes) || 0,
      discount: parseFloat(newDiscount) || 0,
      d1Protocol: `D1-HASH: 05d4084730d36b1073d62c37ab83e9c425d795b5ff34ed949083cdbf02fd7b33::${newId}`,
    };

    setInvoices([newInv, ...invoices]);
    setNewInvoiceModalOpen(false);
    setFeedbackAlert({
      type: 'success',
      message: `Fatura ${newId} emitida com sucesso para ${newMemberName}! Espelho e PDF gerados com protocolo D1.`,
    });
  };

  return (
    <Stack spacing={2.5}>
      {/* 1. HEADER DO MÓDULO */}
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
              label="RECEBÍVEIS ASPPIBRA"
              size="small"
              color="primary"
              variant="soft"
              sx={{ fontWeight: 800, fontSize: '0.68rem' }}
            />
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Gestão completa de faturas, geração de PDFs oficiais, conciliação e liquidação imutável no D1 Ledger.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Tooltip title={dense ? 'Modo Normal de Espaçamento' : 'Modo Compacto / Denso'}>
            <IconButton
              onClick={() => setDense(!dense)}
              sx={{
                bgcolor: dense ? alpha('#38BDF8', 0.15) : 'background.paper',
                border: (t) => `1px solid ${t.palette.divider}`,
                color: dense ? 'primary.main' : 'text.secondary',
              }}
            >
              <Iconify icon={'solar:list-bold' as any} width={18} />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<Iconify icon={'solar:add-circle-bold' as any} width={20} />}
            onClick={() => setNewInvoiceModalOpen(true)}
            sx={{ fontWeight: 800, textTransform: 'none', whiteSpace: 'nowrap' }}
          >
            Emitir Nova Fatura
          </Button>
        </Stack>
      </Stack>

      {/* FEEDBACK ALERT */}
      {feedbackAlert && (
        <Alert severity={feedbackAlert.type} onClose={() => setFeedbackAlert(null)}>
          {feedbackAlert.message}
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
              border: (t) => `1px solid ${t.palette.divider}`,
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
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
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
              border: (t) => `1px solid ${t.palette.divider}`,
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
                  bgcolor: (t) => alpha(t.palette.success.main, 0.1),
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
              border: (t) => `1px solid ${t.palette.divider}`,
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
                  bgcolor: (t) => alpha(t.palette.warning.main, 0.1),
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
              Aguardando conciliação bancária / Pix
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.25,
              height: '100%',
              bgcolor: 'background.paper',
              border: (t) => `1px solid ${t.palette.divider}`,
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
                  bgcolor: (t) => alpha(t.palette.info.main, 0.1),
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
              ● 100% Identidades Verificadas D1
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* 3. CARD PRINCIPAL DA TABELA */}
      <Card
        sx={{
          bgcolor: 'background.paper',
          border: (t) => `1px solid ${t.palette.divider}`,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {/* 3.1. ABAS DE FILTRAGEM RÁPIDA (STATUS TABS) */}
        <Box sx={{ borderBottom: (t) => `1px solid ${t.palette.divider}`, px: 2.5 }}>
          <Tabs
            value={statusTab}
            onChange={(_, val) => {
              setStatusTab(val);
              setPage(0);
            }}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: '0.85rem',
                textTransform: 'none',
                minHeight: 48,
              },
            }}
          >
            <Tab
              value="all"
              label="Todas"
              icon={<Chip label={countAll} size="small" sx={{ height: 20, fontWeight: 800, fontSize: '0.68rem' }} />}
              iconPosition="end"
            />
            <Tab
              value="paid"
              label="Liquidadas"
              icon={
                <Chip
                  label={countPaid}
                  size="small"
                  color="success"
                  variant="soft"
                  sx={{ height: 20, fontWeight: 800, fontSize: '0.68rem' }}
                />
              }
              iconPosition="end"
            />
            <Tab
              value="pending"
              label="Pendentes"
              icon={
                <Chip
                  label={countPending}
                  size="small"
                  color="warning"
                  variant="soft"
                  sx={{ height: 20, fontWeight: 800, fontSize: '0.68rem' }}
                />
              }
              iconPosition="end"
            />
            <Tab
              value="overdue"
              label="Em Atraso"
              icon={
                <Chip
                  label={countOverdue}
                  size="small"
                  color="error"
                  variant="soft"
                  sx={{ height: 20, fontWeight: 800, fontSize: '0.68rem' }}
                />
              }
              iconPosition="end"
            />
            <Tab
              value="draft"
              label="Rascunhos"
              icon={
                <Chip
                  label={countDraft}
                  size="small"
                  variant="outlined"
                  sx={{ height: 20, fontWeight: 800, fontSize: '0.68rem' }}
                />
              }
              iconPosition="end"
            />
          </Tabs>
        </Box>

        {/* 3.2. TOOLBAR AVANÇADA (BUSCA, CATEGORIA E DATAS) */}
        <Box sx={{ p: 2.5, pb: 2 }}>
          <Grid container spacing={1.5} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar por fatura, associado, doc ou competência..."
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
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                select
                fullWidth
                size="small"
                value={serviceFilter}
                onChange={(e) => {
                  setServiceFilter(e.target.value);
                  setPage(0);
                }}
              >
                {SERVICE_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 6, sm: 3, md: 2.5 }}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Vencimento De"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(0);
                }}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            <Grid size={{ xs: 6, sm: 3, md: 2.5 }}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Vencimento Até"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(0);
                }}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
          </Grid>

          {/* 3.3. BARRA DE FILTROS ATIVOS & RESET */}
          {hasActiveFilters && (
            <Stack direction="row" spacing={1} sx={{ mt: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                Filtros ativos ({filteredInvoices.length} resultados):
              </Typography>
              {statusTab !== 'all' && (
                <Chip
                  label={`Status: ${statusTab}`}
                  size="small"
                  onDelete={() => setStatusTab('all')}
                  sx={{ height: 22, fontSize: '0.72rem' }}
                />
              )}
              {searchQuery && (
                <Chip
                  label={`Busca: "${searchQuery}"`}
                  size="small"
                  onDelete={() => setSearchQuery('')}
                  sx={{ height: 22, fontSize: '0.72rem' }}
                />
              )}
              {serviceFilter !== 'Todas as Categorias' && (
                <Chip
                  label={`Categoria: ${serviceFilter}`}
                  size="small"
                  onDelete={() => setServiceFilter('Todas as Categorias')}
                  sx={{ height: 22, fontSize: '0.72rem' }}
                />
              )}
              {(startDate || endDate) && (
                <Chip
                  label={`Período: ${startDate || 'início'} até ${endDate || 'fim'}`}
                  size="small"
                  onDelete={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                  sx={{ height: 22, fontSize: '0.72rem' }}
                />
              )}
              <Button
                size="small"
                color="error"
                startIcon={<Iconify icon={'solar:trash-bin-minimalistic-bold' as any} width={14} />}
                onClick={handleResetFilters}
                sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'none' }}
              >
                Limpar Todos
              </Button>
            </Stack>
          )}
        </Box>

        {/* 3.4. BARRA DE AÇÕES EM LOTE (BATCH ACTIONS) */}
        {selected.length > 0 && (
          <Box
            sx={{
              p: 1.5,
              px: 2.5,
              bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
              borderTop: (t) => `1px solid ${alpha(t.palette.primary.main, 0.2)}`,
              borderBottom: (t) => `1px solid ${alpha(t.palette.primary.main, 0.2)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1.5,
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Chip
                label={`${selected.length} selecionadas`}
                color="primary"
                size="small"
                sx={{ fontWeight: 800 }}
              />
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
                Ações em massa para as faturas marcadas
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="contained"
                color="success"
                startIcon={<Iconify icon={'solar:check-read-bold' as any} width={16} />}
                onClick={handleBatchSettle}
                sx={{ fontWeight: 800, textTransform: 'none', fontSize: '0.75rem' }}
              >
                Liquidar em Lote (D1)
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<Iconify icon={'solar:trash-bin-trash-bold' as any} width={16} />}
                onClick={() => setBatchConfirmOpen(true)}
                sx={{ fontWeight: 800, textTransform: 'none', fontSize: '0.75rem' }}
              >
                Excluir Selecionadas
              </Button>
              <Button
                size="small"
                variant="text"
                onClick={() => setSelected([])}
                sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '0.75rem' }}
              >
                Desmarcar
              </Button>
            </Stack>
          </Box>
        )}

        {/* 3.5. TABELA COM ORDENAÇÃO DINÂMICA DE COLUNAS */}
        <TableContainer>
          <Table size={dense ? 'small' : 'medium'}>
            <TableHead sx={{ bgcolor: (t) => alpha(t.palette.grey[500], 0.04) }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < paginatedInvoices.length}
                    checked={paginatedInvoices.length > 0 && selected.length === paginatedInvoices.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem' }}>
                  <TableSortLabel
                    active={orderBy === 'id'}
                    direction={orderBy === 'id' ? order : 'asc'}
                    onClick={() => handleRequestSort('id')}
                  >
                    FATURA / ID
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem' }}>
                  <TableSortLabel
                    active={orderBy === 'memberName'}
                    direction={orderBy === 'memberName' ? order : 'asc'}
                    onClick={() => handleRequestSort('memberName')}
                  >
                    ASSOCIADO / MEMBRO
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem' }}>
                  <TableSortLabel
                    active={orderBy === 'referenceMonth'}
                    direction={orderBy === 'referenceMonth' ? order : 'asc'}
                    onClick={() => handleRequestSort('referenceMonth')}
                  >
                    COMPETÊNCIA
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem' }}>
                  <TableSortLabel
                    active={orderBy === 'dueDate'}
                    direction={orderBy === 'dueDate' ? order : 'asc'}
                    onClick={() => handleRequestSort('dueDate')}
                  >
                    VENCIMENTO
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem' }}>
                  MÉTODO / GATEWAY
                </TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textAlign: 'right' }}>
                  <TableSortLabel
                    active={orderBy === 'amount'}
                    direction={orderBy === 'amount' ? order : 'asc'}
                    onClick={() => handleRequestSort('amount')}
                  >
                    VALOR (BRL)
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textAlign: 'center' }}>
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleRequestSort('status')}
                  >
                    STATUS
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textAlign: 'center', width: 140 }}>
                  AÇÕES
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedInvoices.map((inv) => {
                const isItemSelected = isSelected(inv.id);
                return (
                  <TableRow
                    key={inv.id}
                    hover
                    selected={isItemSelected}
                    sx={{ '&:last-child td': { borderBottom: 0 } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onChange={() => handleSelectClick(inv.id)}
                      />
                    </TableCell>

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

                    <TableCell sx={{ fontSize: '0.78rem', color: 'text.secondary', maxWidth: 170 }}>
                      <Typography variant="caption" noWrap sx={{ display: 'block' }}>
                        {inv.paymentMethod}
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{
                        textAlign: 'right',
                        fontWeight: 800,
                        fontFamily: 'monospace',
                        fontSize: '0.82rem',
                        color: inv.status === 'paid' ? 'success.main' : 'text.primary',
                      }}
                    >
                      {inv.amountFormatted}
                    </TableCell>

                    <TableCell sx={{ textAlign: 'center' }}>
                      <Chip
                        label={
                          inv.status === 'paid'
                            ? 'Liquidada'
                            : inv.status === 'overdue'
                            ? 'Em Atraso'
                            : inv.status === 'draft'
                            ? 'Rascunho'
                            : 'Pendente'
                        }
                        size="small"
                        variant="soft"
                        color={
                          inv.status === 'paid'
                            ? 'success'
                            : inv.status === 'overdue'
                            ? 'error'
                            : inv.status === 'draft'
                            ? 'default'
                            : 'warning'
                        }
                        sx={{ height: 20, fontSize: '0.68rem', fontWeight: 800 }}
                      />
                    </TableCell>

                    <TableCell sx={{ textAlign: 'center' }}>
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                        {/* BOTÃO DETALHES */}
                        <Tooltip title="Ver Espelho e Detalhes">
                          <IconButton
                            size="small"
                            onClick={() => setSelectedInvoice(inv)}
                            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                          >
                            <Iconify icon={'solar:eye-bold' as any} width={18} />
                          </IconButton>
                        </Tooltip>

                        {/* BOTÃO BAIXAR PDF */}
                        <DevOSInvoicePDFDownload invoice={inv} currentStatus={inv.status} />

                        {/* BOTÃO LIQUIDAR */}
                        {inv.status !== 'paid' && (
                          <Tooltip title="Dar Baixa / Liquidar no D1">
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
                );
              })}

              {paginatedInvoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                    Nenhuma fatura encontrada com os filtros especificados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 3.6. PAGINAÇÃO */}
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
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Linhas por página:"
          sx={{ borderTop: (t) => `1px solid ${t.palette.divider}` }}
        />
      </Card>

      {/* 4. MODAL DE EMISSÃO COMPLETA DE FATURA (MÚLTIPLOS ITENS) */}
      <Dialog
        open={newInvoiceModalOpen}
        onClose={() => setNewInvoiceModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1, borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Emitir Nova Fatura Multi-Item (ASPPIBRA)
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Emissão com cálculo automático de subtotal, discriminação de serviços e registro D1 Ledger.
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            {/* DADOS DO ASSOCIADO */}
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', textTransform: 'uppercase' }}>
              1. Identificação do Pagador
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Nome do Associado / Membro"
                  fullWidth
                  size="small"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Documento (CPF / CNPJ / DID)"
                  fullWidth
                  size="small"
                  value={newMemberDoc}
                  onChange={(e) => setNewMemberDoc(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="E-mail de Contato"
                  fullWidth
                  size="small"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  label="Competência (AAAA-MM)"
                  fullWidth
                  size="small"
                  value={newReferenceMonth}
                  onChange={(e) => setNewReferenceMonth(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  label="Vencimento"
                  fullWidth
                  size="small"
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
            </Grid>

            {/* ITENS E SERVIÇOS DA FATURA */}
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', textTransform: 'uppercase' }}>
                2. Discriminação de Serviços / Itens
              </Typography>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Iconify icon={'solar:add-circle-bold' as any} width={16} />}
                onClick={handleAddItem}
                sx={{ textTransform: 'none', fontWeight: 700 }}
              >
                Adicionar Linha
              </Button>
            </Stack>

            <Stack spacing={1.5}>
              {newItems.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    bgcolor: (t) => alpha(t.palette.grey[500], 0.04),
                    border: (t) => `1px solid ${t.palette.divider}`,
                  }}
                >
                  <Grid container spacing={1.5} sx={{ alignItems: 'center' }}>
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <TextField
                        label={`Descrição do Item #${index + 1}`}
                        fullWidth
                        size="small"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <TextField
                        select
                        label="Categoria"
                        fullWidth
                        size="small"
                        value={item.service}
                        onChange={(e) => handleItemChange(item.id, 'service', e.target.value)}
                      >
                        {SERVICE_OPTIONS.filter((s) => s !== 'Todas as Categorias').map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 3, sm: 1.5 }}>
                      <TextField
                        label="Qtd"
                        type="number"
                        fullWidth
                        size="small"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 3, sm: 2 }}>
                      <TextField
                        label="Valor (R$)"
                        type="number"
                        fullWidth
                        size="small"
                        value={item.price}
                        onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 0.5 }} sx={{ textAlign: 'right' }}>
                      <IconButton
                        size="small"
                        color="error"
                        disabled={newItems.length <= 1}
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Iconify icon={'solar:trash-bin-minimalistic-bold' as any} width={18} />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Stack>

            {/* TOTAIS E DESCONTOS */}
            <Grid container spacing={2} sx={{ mt: 1, alignItems: 'center' }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Método de Pagamento"
                  fullWidth
                  size="small"
                  value={newPaymentMethod}
                  onChange={(e) => setNewPaymentMethod(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <TextField
                  label="Desconto (R$)"
                  type="number"
                  fullWidth
                  size="small"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <TextField
                  label="Taxas / Retenções (R$)"
                  type="number"
                  fullWidth
                  size="small"
                  value={newTaxes}
                  onChange={(e) => setNewTaxes(e.target.value)}
                />
              </Grid>
            </Grid>

            {/* CARD DE TOTAL FINAL */}
            <Box
              sx={{
                p: 2,
                borderRadius: 1.5,
                bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
                border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.2)}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  Subtotal: R$ {calculatedItemsTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Protocolo Imutável D1 Ledger ativo
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                  VALOR CONSOLIDADO:
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: 'monospace' }}>
                  R$ {calculatedFinalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: (t) => `1px solid ${t.palette.divider}` }}>
          <Button onClick={() => setNewInvoiceModalOpen(false)} sx={{ color: 'text.secondary', textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateInvoice}
            sx={{ fontWeight: 800, textTransform: 'none' }}
          >
            Emitir Fatura & Gerar PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* 5. MODAL DE RECIBO & ESPELHO DETALHADO DA FATURA */}
      <Dialog
        open={Boolean(selectedInvoice) && !pdfModalOpen}
        onClose={() => setSelectedInvoice(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1, borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                Espelho da Fatura • {selectedInvoice?.id}
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
                  bgcolor: (t) =>
                    selectedInvoice.status === 'paid'
                      ? alpha(t.palette.success.main, 0.08)
                      : alpha(t.palette.warning.main, 0.08),
                  border: (t) =>
                    `1px solid ${
                      selectedInvoice.status === 'paid'
                        ? t.palette.success.main
                        : t.palette.warning.main
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
                      {selectedInvoice.status === 'paid'
                        ? 'FATURA LIQUIDADA E COMPROVADA'
                        : 'FATURA PENDENTE DE LIQUIDAÇÃO'}
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
                  bgcolor: (t) => alpha(t.palette.grey[500], 0.04),
                  border: (t) => `1px solid ${t.palette.divider}`,
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

              {/* CONCILIAÇÃO & PROTOCOLO D1 */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1.5,
                  bgcolor: (t) => alpha(t.palette.grey[500], 0.04),
                  border: (t) => `1px dashed ${t.palette.divider}`,
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  AUTENTICAÇÃO & PROTOCOLO CRIPTOGRÁFICO D1
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontFamily: 'monospace', color: 'primary.main', wordBreak: 'break-all', fontSize: '0.72rem' }}
                >
                  {selectedInvoice.d1Protocol ||
                    `D1-HASH: 05d4084730d36b1073d62c37ab83e9c425d795b5ff34ed949083cdbf02fd7b33::${selectedInvoice.id}`}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: (t) => `1px solid ${t.palette.divider}`, justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1}>
            {selectedInvoice && (
              <>
                <DevOSInvoicePDFDownload invoice={selectedInvoice} currentStatus={selectedInvoice.status} />
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Iconify icon={'solar:document-text-bold' as any} width={16} />}
                  onClick={() => setPdfModalOpen(true)}
                  sx={{ textTransform: 'none', fontWeight: 700 }}
                >
                  Visualizar PDF
                </Button>
              </>
            )}
          </Stack>

          <Stack direction="row" spacing={1}>
            {selectedInvoice && selectedInvoice.status !== 'paid' && (
              <Button
                variant="contained"
                color="success"
                onClick={() => handleSettleInvoice(selectedInvoice)}
                sx={{ fontWeight: 800, textTransform: 'none' }}
              >
                Confirmar Recebimento / Liquidar D1
              </Button>
            )}
            <Button onClick={() => setSelectedInvoice(null)} sx={{ color: 'text.secondary', textTransform: 'none' }}>
              Fechar
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* 6. MODAL FULLSCREEN DE VISUALIZAÇÃO DO PDF */}
      <Dialog
        fullScreen
        open={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <DialogTitle
            sx={{
              p: 1.5,
              px: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: (t) => `1px solid ${t.palette.divider}`,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Visualizador Oficial de Fatura PDF • {selectedInvoice?.id}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setPdfModalOpen(false)}
              sx={{ textTransform: 'none', fontWeight: 800 }}
            >
              Fechar Visualizador
            </Button>
          </DialogTitle>
          <Box sx={{ flexGrow: 1, height: 'calc(100% - 64px)' }}>
            {selectedInvoice && (
              <DevOSInvoicePDFViewer invoice={selectedInvoice} currentStatus={selectedInvoice.status} />
            )}
          </Box>
        </Box>
      </Dialog>

      {/* 7. DIÁLOGO DE CONFIRMAÇÃO DE EXCLUSÃO EM LOTE */}
      <Dialog
        open={batchConfirmOpen}
        onClose={() => setBatchConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Excluir Faturas em Massa</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tem certeza de que deseja excluir permanentemente as <strong>{selected.length}</strong> faturas selecionadas?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setBatchConfirmOpen(false)} sx={{ textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleBatchDelete}
            sx={{ fontWeight: 800, textTransform: 'none' }}
          >
            Confirmar Exclusão
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
