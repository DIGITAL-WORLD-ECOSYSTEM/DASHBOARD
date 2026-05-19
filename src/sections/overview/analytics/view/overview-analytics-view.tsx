import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

import { _appFeatured } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';
import { useGetTreasuryAnalytics } from 'src/actions/treasury';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { useMockedUser } from 'src/auth/hooks';

import { AppWelcome } from '../../app/app-welcome';
import { AnalyticsTable } from '../analytics-table';
import { AppFeatured } from '../../app/app-featured';
import { AnalyticsFilters } from '../analytics-filters';
import { AnalyticsAIInsights } from '../analytics-ai-insights';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AppWidgetSummary as AppWidgetSummaryHome } from '../../app/app-widget-summary';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { user } = useMockedUser();
  const theme = useTheme();

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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 5 }}>

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

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.displayName}`}
            description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
            img={<SeoIllustration hideBackground />}
            action={
              <Button variant="contained" color="primary">
                Go now
              </Button>
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AppFeatured list={_appFeatured} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AppWidgetSummaryHome
            title="Total active users"
            percent={2.6}
            total={18765}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [15, 18, 12, 51, 68, 11, 39, 37],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AppWidgetSummaryHome
            title="Total installed"
            percent={0.2}
            total={4876}
            chart={{
              colors: [theme.palette.info.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [20, 41, 63, 33, 28, 35, 50, 46],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AppWidgetSummaryHome
            title="Total downloads"
            percent={-0.1}
            total={678}
            chart={{
              colors: [theme.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [18, 19, 31, 8, 16, 37, 12, 33],
            }}
          />
        </Grid>
      </Grid>

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
            title="VALOR DO CONTRATO"
            percent={100}
            total="R$ 65.000,00"
            color="primary"
            icon={<Iconify icon={"solar:diploma-verified-bold-duotone" as any} width={32} />}
            chart={{
              categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
              series: [100, 100, 100, 100, 100, 100, 100, 100],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="VALOR TOTAL PAGO"
            percent={+((summary.totalInflow / 65000) * 100)}
            total={`R$ ${summary.totalInflow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            color="success"
            icon={<Iconify icon={"solar:wad-of-money-bold-duotone" as any} width={32} />}
            chart={{
              categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
              series: [22, 33, 54, 12, 12, 43, 33, 20],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="SALDO PARA QUITAÇÃO"
            percent={-(((65000 - summary.totalInflow) / 65000) * 100)}
            total={`R$ ${(65000 - summary.totalInflow).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            color="info"
            icon={<Iconify icon={"solar:calculator-minimalistic-bold-duotone" as any} width={32} />}
            chart={{
              categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
              series: [80, 70, 60, 50, 45, 40, 35, 30],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="REGRAS DO CONTRATO"
            percent={0}
            total="DIA 20 | 1%"
            color="warning"
            icon={<Iconify icon={"solar:document-text-bold-duotone" as any} width={32} />}
            chart={{
              categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
              series: [20, 20, 20, 20, 20, 20, 20, 20],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Fluxo de Quitação Mensal"
            subheader="Evolução da amortização do contrato de 65k"
            chart={{
              categories: monthlyTrend.map((m: any) => m.month),
              series: [
                {
                  name: 'Amortização Realizada',
                  data: monthlyTrend.map((m: any) => m.total),
                },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Divisão de Custos do Contrato"
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
