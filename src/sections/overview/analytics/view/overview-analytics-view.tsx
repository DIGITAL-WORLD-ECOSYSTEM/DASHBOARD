import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetTreasuryAnalytics } from 'src/actions/treasury';

import { Iconify } from 'src/components/iconify';

import { AnalyticsTable } from '../analytics-table';
import { AnalyticsFilters } from '../analytics-filters';
import { AnalyticsAIInsights } from '../analytics-ai-insights';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const [selectedYear, setSelectedYear] = useState('All');
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
            Financial Intelligence for Andressa de Lima Ferreira
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Iconify icon={"eva:file-text-fill" as any} />}
          sx={{ borderRadius: 1.5 }}
        >
          Export PDF
        </Button>
      </Box>

      <AnalyticsFilters
        years={availableYears}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        onSearch={setSearchQuery}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="TOTAL INFLOW"
            percent={+2.6}
            total={`R$ ${summary.totalInflow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            color="success"
            icon={<Iconify icon={"solar:round-arrow-right-up-bold-duotone" as any} width={32} />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 33, 54, 12, 12, 43, 33, 20],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="TOP RECIPIENT"
            percent={0.1}
            total={summary.topRecipient}
            color="primary"
            icon={<Iconify icon={"solar:user-bold-duotone" as any} width={32} />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="TICKET MEDIUM"
            percent={2.8}
            total={`R$ ${summary.avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            color="info"
            icon={<Iconify icon={"solar:ticket-bold-duotone" as any} width={32} />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="FREQUENCY"
            percent={3.6}
            total={`${summary.count} txs`}
            color="success"
            icon={<Iconify icon={"solar:chart-2-bold-duotone" as any} width={32} />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Monthly Trend (BRL)"
            chart={{
              categories: monthlyTrend.map((m: any) => m.month),
              series: [
                {
                  name: 'Flow',
                  data: monthlyTrend.map((m: any) => m.total),
                },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Recipient Distribution"
            chart={{
              series: distribution,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <AnalyticsTable title="Digital Receipt Ledger" tableData={dataFiltered} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <AnalyticsAIInsights />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
