import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetTreasuryAnalytics } from 'src/actions/treasury';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { AnalyticsTable } from '../analytics-table';
import { AnalyticsFilters } from '../analytics-filters';
import { AnalyticsAIInsights } from '../analytics-ai-insights';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const [selectedYear, setSelectedYear] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { analytics, analyticsLoading } = useGetTreasuryAnalytics(selectedYear);

  if (analyticsLoading) {
    return (
      <DashboardContent>
        <LinearProgress color="inherit" sx={{ width: 1, my: 5 }} />
      </DashboardContent>
    );
  }

  const { summary, monthlyTrend, distribution, transactions, availableYears } = analytics || {
    summary: { totalInflow: 0, topRecipient: 'N/A', avgTicket: 0, count: 0 },
    monthlyTrend: [],
    distribution: [],
    availableYears: ['All'],
    transactions: [],
  };

  const dataFiltered = transactions.filter((tx) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      tx.counterparty_name?.toLowerCase().includes(searchLower) ||
      tx.origin_institution?.toLowerCase().includes(searchLower) ||
      tx.destination_institution?.toLowerCase().includes(searchLower) ||
      tx.category?.toLowerCase().includes(searchLower) ||
      tx.payment_method?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: '700' }}>
            Vincit Ledger
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Inteligência Financeira para Andressa de Lima Ferreira
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="soft"
            color="primary"
            startIcon={<Iconify icon={"solar:share-bold-duotone" as any} />}
            onClick={() => {
              const url = `${window.location.origin}/share/analytics`;
              navigator.clipboard.writeText(url);
              toast.success('Link público copiado para a área de transferência!');
            }}
            sx={{ borderRadius: 1.5 }}
          >
            Compartilhar
          </Button>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon={"eva:file-text-fill" as any} />}
            sx={{ borderRadius: 1.5 }}
          >
            Exportar PDF
          </Button>
        </Box>
      </Box>

      <AnalyticsFilters
        years={availableYears}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        summary={summary}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="JUROS POR ATRASO"
            percent={+0.5}
            total="R$ 1.240,00"
            color="info"
            icon={<Iconify icon={"solar:reorder-bold-duotone" as any} width={32} />}
            chart={{
              categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
              series: [5, 18, 12, 51, 68, 11, 39, 37],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="DATA DE PAGAMENTO"
            percent={-1.2}
            total="Dia 10 (Méd.)"
            color="warning"
            icon={<Iconify icon={"solar:calendar-date-bold-duotone" as any} width={32} />}
            chart={{
              categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
              series: [20, 41, 63, 33, 28, 35, 50, 46],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="VALOR TOTAL PAGO"
            percent={+2.6}
            total={`R$ ${summary.totalInflow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            color="success"
            icon={<Iconify icon={"solar:hand-money-bold-duotone" as any} width={32} />}
            chart={{
              categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
              series: [22, 33, 54, 12, 12, 43, 33, 20],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="ENCARGOS DE IMPOSTOS"
            percent={+1.1}
            total={`R$ ${(summary.totalInflow * 0.06).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            color="error"
            icon={<Iconify icon={"solar:bill-list-bold-duotone" as any} width={32} />}
            chart={{
              categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
              series: [15, 25, 45, 10, 10, 30, 25, 15],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Tendência Mensal (R$)"
            chart={{
              categories: monthlyTrend.map((m: any) => m.month),
              series: [
                {
                  name: 'Entradas',
                  data: monthlyTrend.map((m: any) => m.total),
                },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Distribuição por Favorecido"
            chart={{
              series: distribution,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <AnalyticsTable title="Ledger de Recebimentos Digitais" tableData={dataFiltered} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <AnalyticsAIInsights />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
