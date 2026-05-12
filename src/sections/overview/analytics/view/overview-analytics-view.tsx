import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { AnalyticsTable } from '../analytics-table';
import { AnalyticsFilters } from '../analytics-filters';
import { AnalyticsAIInsights } from '../analytics-ai-insights';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

const MOCK_TABLE_DATA = [
  { id: '1', date: '15/08/2023', favored: 'Paulo Roberto', value: 5000, institution: 'Itaú', insight: 'recurring', receipt: true },
  { id: '2', date: '05/09/2023', favored: 'Sandro Alves', value: 1200, institution: 'Bradesco', insight: 'change', receipt: true },
  { id: '3', date: '12/10/2023', favored: 'ASPPIBRA', value: 350, institution: 'Mercado Pago', insight: 'alert', receipt: true },
  { id: '4', date: '20/11/2023', favored: 'Paulo Roberto', value: 800, institution: 'Itaú', insight: 'recurring', receipt: true },
  { id: '5', date: '10/12/2023', favored: 'Sandro Alves', value: 1200, institution: 'Bradesco', insight: 'change', receipt: true },
];

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: { xs: 3, md: 5 }, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'primary.darker', fontWeight: 'fontWeightBold' }}>
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
        years={['All', '2023', '2024', '2025']}
        selectedYear="All"
        onSelectYear={(year) => console.log(year)}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="TOTAL OUTFLOW"
            percent={-2.6}
            total="R$ 13.600,00"
            color="error"
            icon={<Iconify icon={"solar:round-arrow-left-down-bold-duotone" as any} width={32} />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="TOP RECIPIENT"
            percent={0.1}
            total="Paulo Roberto"
            color="primary"
            icon={<Iconify icon={"solar:user-bold-duotone" as any} width={32} />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="TICKET MEDIUM"
            percent={2.8}
            total="R$ 1.133,33"
            color="info"
            icon={<Iconify icon={"solar:ticket-bold-duotone" as any} width={32} />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="FREQUENCY"
            percent={3.6}
            total="12 txs"
            color="success"
            icon={<Iconify icon={"solar:chart-2-bold-duotone" as any} width={32} />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Monthly Trend (BRL)"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              series: [
                { name: 'Outflow', data: [1500, 1900, 1200, 1100, 1400, 1700, 1000, 4300, 1800, 1100, 1300, 1600] },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Recipient Distribution"
            chart={{
              series: [
                { label: 'Paulo Roberto', value: 3500 },
                { label: 'Sandro Alves', value: 2500 },
                { label: 'ASPPIBRA', value: 1500 },
                { label: 'Nubank', value: 500 },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <AnalyticsTable
            title="Digital Receipt Ledger"
            tableData={MOCK_TABLE_DATA}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <AnalyticsAIInsights />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
