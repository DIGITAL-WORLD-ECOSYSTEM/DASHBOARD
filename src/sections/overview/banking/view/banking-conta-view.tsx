import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

export function BankingContaView() {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Informações da Conta
      </Typography>

      <Card sx={{ p: 5 }}>
        <Typography variant="body1">
          Aqui ficarão todas as configurações, detalhes pessoais e preferências da conta bancária/DAO do usuário.
        </Typography>
      </Card>
    </DashboardContent>
  );
}
