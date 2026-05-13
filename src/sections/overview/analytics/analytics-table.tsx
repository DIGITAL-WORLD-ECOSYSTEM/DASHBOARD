import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from 'src/utils/format-time';

import { ITreasuryTransaction } from 'src/actions/treasury';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  subheader?: string;
  tableData: ITreasuryTransaction[];
};

export function AnalyticsTable({ title, subheader, tableData }: Props) {
  const theme = useTheme();

  return (
    <Card>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {subheader}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="soft" size="small" startIcon={<Iconify icon={"eva:refresh-fill" as any} />}>
            Recurring
          </Button>
          <Button variant="soft" size="small" startIcon={<Iconify icon={"eva:swap-fill" as any} />}>
            Bank Change
          </Button>
          <Button variant="soft" size="small" startIcon={<Iconify icon={"eva:people-fill" as any} />}>
            Association
          </Button>
        </Box>
      </Box>

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Counterparty</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Method</TableCell>
                <TableCell align="center">Insights</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{fDate(row.created_at)}</TableCell>
                  
                  <TableCell>
                    <Label variant="soft" color="info" sx={{ textTransform: 'capitalize' }}>
                      {row.category}
                    </Label>
                  </TableCell>

                  <TableCell>
                    <Typography variant="subtitle2">{row.counterparty_name || row.recipient_id}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="subtitle2" sx={{ color: row.direction === 'inbound' ? 'success.main' : 'error.main' }}>
                      {row.direction === 'inbound' ? '+' : '-'} R$ {(row.amount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Label
                      variant="soft"
                      color="default"
                      sx={{ textTransform: 'uppercase', bgcolor: alpha(theme.palette.grey[500], 0.08) }}
                    >
                      {row.payment_method}
                    </Label>
                  </TableCell>

                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      {row.ai_flags.map((flag, index) => (
                        <Iconify
                          key={index}
                          icon={getFlagIcon(flag.type) as any}
                          sx={{
                            color: 'primary.main',
                            width: 20,
                            height: 20,
                          }}
                        />
                      ))}
                      {row.risk_score.level !== 'low' && (
                        <Iconify
                          icon={"eva:alert-triangle-fill" as any}
                          sx={{
                            color: 'error.main',
                            width: 20,
                            height: 20,
                          }}
                        />
                      )}
                      {row.ai_flags.length === 0 && row.risk_score.level === 'low' && (
                        <Iconify icon={"eva:checkmark-circle-2-fill" as any} sx={{ color: 'success.main', width: 20, height: 20 }} />
                      )}
                    </Box>
                  </TableCell>

                  <TableCell align="right">
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon={"eva:arrow-ios-forward-fill" as any} />}
        >
          View All
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

function getFlagIcon(type: string) {
  switch (type) {
    case 'recurring':
      return 'eva:clock-fill';
    case 'high_confidence':
      return 'eva:shield-fill';
    default:
      return 'eva:info-fill';
  }
}
