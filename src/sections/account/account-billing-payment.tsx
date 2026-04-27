import type { CardProps } from '@mui/material/Card';
import type { IPaymentCard } from 'src/types/common';

import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CardHeader from '@mui/material/CardHeader';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = CardProps & {
  cards: IPaymentCard[];
};

export function AccountBillingPayment({ cards, sx, ...other }: Props) {
  return (
    <Card sx={[{ my: 3 }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <CardHeader title="Payment method" />
      <Box sx={{ p: 3, typography: 'body2', color: 'text.secondary' }}>
        Payment management is currently disabled in this dashboard.
      </Box>
    </Card>
  );
}
