import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetTreasuryAnalytics } from 'src/actions/treasury';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { AnalyticsTable } from '../analytics-table';
import { AnalyticsFilters } from '../analytics-filters';
import { AnalyticsAIInsights } from '../analytics-ai-insights';

// ----------------------------------------------------------------------

export function AnalyticsLedgerView() {
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

  const { transactions, availableYears, summary } = analytics || {
    availableYears: ['All'],
    transactions: [],
    summary: { totalInflow: 0, count: 0 },
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

      <AnalyticsFilters
        years={availableYears}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        summary={summary}
      />

      <Grid container spacing={3} sx={{ mt: 2 }}>
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
