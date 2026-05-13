import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  years: string[];
  selectedYear: string;
  onSearch: (value: string) => void;
  onSelectYear: (year: string) => void;
};

export function AnalyticsFilters({ years, selectedYear, onSelectYear, onSearch }: Props) {
  return (
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { md: 'center' },
        justifyContent: 'space-between',
        mb: { xs: 3, md: 5 },
      }}
    >
      <Tabs
        value={selectedYear}
        onChange={(e, value) => onSelectYear(value)}
        sx={{
          px: 1,
          bgcolor: 'background.neutral',
          borderRadius: 1.5,
          '& .MuiTabs-indicator': {
            height: '80%',
            bottom: '10%',
            borderRadius: 1,
            bgcolor: 'primary.main',
          },
          '& .MuiTab-root': {
            minHeight: 48,
            zIndex: 1,
            color: 'text.secondary',
            '&.Mui-selected': {
              color: 'common.white',
            },
          },
        }}
      >
        {years.map((year) => (
          <Tab key={year} label={year} value={year} disableRipple />
        ))}
      </Tabs>

      <TextField
        placeholder="Search favored or institution..."
        onChange={(e) => onSearch(e.target.value)}
        sx={{
          maxWidth: { md: 440 },
          width: 1,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.paper',
            borderRadius: 10,
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={"eva:search-fill" as any} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
}
