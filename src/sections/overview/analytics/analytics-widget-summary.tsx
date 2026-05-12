import type { CardProps } from '@mui/material/Card';
import type { PaletteColorKey } from 'src/theme/core';
import type { ChartOptions } from 'src/components/chart';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { fNumber, fPercent, fShortenNumber } from 'src/utils/format-number';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title: string;
  total: string | number;
  percent: number;
  color?: PaletteColorKey;
  icon: React.ReactNode;
  chart?: {
    series: number[];
    categories: string[];
    options?: ChartOptions;
  };
};

export function AnalyticsWidgetSummary({
  sx,
  icon,
  title,
  total,
  chart,
  percent,
  color = 'primary',
  ...other
}: Props) {
  const theme = useTheme();

  const chartColors = [theme.palette[color].main];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    xaxis: { categories: chart?.categories },
    grid: {
      padding: {
        top: 6,
        left: 6,
        right: 6,
        bottom: 6,
      },
    },
    tooltip: {
      y: { formatter: (value: number) => value.toString(), title: { formatter: () => '' } },
    },
    markers: {
      strokeWidth: 0,
    },
    ...chart?.options,
  });

  const renderTrending = () => (
    <Box
      sx={{
        gap: 0.5,
        display: 'flex',
        alignItems: 'center',
        color: percent < 0 ? 'error.main' : 'success.main',
      }}
    >
      <Iconify
        width={16}
        icon={percent < 0 ? 'solar:double-alt-arrow-down-bold-duotone' : 'solar:double-alt-arrow-up-bold-duotone'}
      />
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {percent > 0 && '+'}
        {fPercent(percent)}
      </Box>
    </Box>
  );

  return (
    <Card
      sx={[
        () => ({
          p: 2.5,
          boxShadow: theme.customShadows.card,
          position: 'relative',
          backgroundColor: 'common.white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          flexShrink: 0,
          display: 'flex',
          borderRadius: 1.5,
          alignItems: 'center',
          justifyContent: 'center',
          color: `${color}.main`,
          bgcolor: varAlpha(theme.vars.palette[color].mainChannel, 0.08),
        }}
      >
        {icon}
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ typography: 'subtitle2', color: 'text.secondary', mb: 0.5 }}>{title}</Box>
        <Box sx={{ typography: 'h5', fontWeight: 'fontWeightBold' }}>{typeof total === 'number' ? fShortenNumber(total) : total}</Box>
        {renderTrending()}
      </Box>

      {chart && (
        <Chart
          type="line"
          series={[{ data: chart.series }]}
          options={chartOptions}
          sx={{ width: 60, height: 40 }}
        />
      )}
    </Card>
  );
}
