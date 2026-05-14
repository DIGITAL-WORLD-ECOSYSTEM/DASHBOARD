import type { ITreasuryTransaction } from 'src/actions/treasury';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  subheader?: string;
  tableData: ITreasuryTransaction[];
  headLabel?: any[];
};

export function AnalyticsTable({ title, subheader, tableData, headLabel, ...other }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const dataFiltered = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const TABLE_HEAD = headLabel || [
    { id: 'date', label: 'Date' },
    { id: 'counterparty', label: 'Counterparty' },
    { id: 'origin_institution', label: 'Origin Bank' },
    { id: 'destination_institution', label: 'Dest. Bank' },
    { id: 'amount', label: 'Value' },
    { id: 'payment_method', label: 'Method' },
    { id: 'status', label: 'Status' },
    { id: 'insights', label: 'Insights', align: 'right' },
  ];

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 960 }}>
            <TableHeadCustom headCells={TABLE_HEAD} />

            <TableBody>
              {dataFiltered.map((row) => (
                <AnalyticsTableRow key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <TablePagination
        component="div"
        count={tableData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

type AnalyticsTableRowProps = {
  row: ITreasuryTransaction;
};

function AnalyticsTableRow({ row }: AnalyticsTableRowProps) {
  const isOutbound = row.direction === 'outbound';
  const isAudit = row.category === 'AUDIT';

  return (
    <TableRow>
      <TableCell>{fDate(row.created_at)}</TableCell>

      <TableCell>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            {row.counterparty_name}
          </Box>
          <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
            {row.category}
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        <Label variant="soft" color="default" sx={{ textTransform: 'uppercase' }}>
          {row.origin_institution}
        </Label>
      </TableCell>

      <TableCell>
        <Label variant="soft" color="info" sx={{ textTransform: 'uppercase' }}>
          {row.destination_institution}
        </Label>
      </TableCell>

      <TableCell
        sx={{
          color: isAudit ? 'error.main' : (isOutbound ? 'error.main' : 'success.main'),
          fontWeight: 'bold',
        }}
      >
        {isOutbound || isAudit ? '-' : '+'} {fCurrency(row.amount / 100)}
      </TableCell>

      <TableCell sx={{ textTransform: 'uppercase', typography: 'caption', fontWeight: 'bold' }}>
        {row.payment_method}
      </TableCell>

      <TableCell>
        <Label
          variant="filled"
          color={
            (row.status === 'confirmed' && 'success') ||
            (row.status === 'pending' && 'warning') ||
            (row.status === 'failed' && 'error') ||
            'default'
          }
        >
          {row.status}
        </Label>
      </TableCell>

      <TableCell align="right">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          {row.documents && row.documents.length > 0 && (
            <Iconify icon={"eva:attach-2-fill" as any} sx={{ color: 'text.secondary', width: 20 }} />
          )}
          {row.ai_flags && row.ai_flags.length > 0 && (
            <Iconify icon={"eva:clock-outline" as any} sx={{ color: 'info.main', width: 20 }} />
          )}
          {row.risk_score.level !== 'low' && (
            <Iconify icon={"eva:alert-triangle-outline" as any} sx={{ color: 'error.main', width: 20 }} />
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
}
