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

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type RowProps = {
  id: string;
  date: string;
  favored: string;
  value: number;
  institution: string;
  insight: string;
  receipt: boolean;
};

type Props = {
  title?: string;
  subheader?: string;
  tableData: RowProps[];
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
                <TableCell>Favored</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Institution</TableCell>
                <TableCell>Insights</TableCell>
                <TableCell align="right">Receipt</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{row.favored}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                      R$ {row.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Label
                      variant="soft"
                      color="default"
                      sx={{ textTransform: 'capitalize', bgcolor: alpha(theme.palette.grey[500], 0.08) }}
                    >
                      {row.institution}
                    </Label>
                  </TableCell>
                  <TableCell>
                    <Iconify
                      icon={getInsightIcon(row.insight) as any}
                      sx={{
                        color: getInsightColor(row.insight),
                        width: 20,
                        height: 20,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {row.receipt && (
                      <Iconify icon={"eva:paperclip-fill" as any} sx={{ color: 'text.disabled' }} />
                    )}
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

function getInsightIcon(insight: string) {
  switch (insight) {
    case 'recurring':
      return 'eva:clock-fill';
    case 'change':
      return 'eva:swap-fill';
    case 'alert':
      return 'eva:alert-triangle-fill';
    default:
      return 'eva:checkmark-circle-2-fill';
  }
}

function getInsightColor(insight: string) {
  switch (insight) {
    case 'recurring':
      return 'success.main';
    case 'change':
      return 'warning.main';
    case 'alert':
      return 'error.main';
    default:
      return 'primary.main';
  }
}
