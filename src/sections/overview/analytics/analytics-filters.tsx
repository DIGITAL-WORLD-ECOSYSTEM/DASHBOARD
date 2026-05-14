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
  onSelectYear: (year: string) => void;
  onSearch: (value: string) => void;
};

export function AnalyticsFilters({ years, selectedYear, onSelectYear, onSearch, ...other }: Props) {
  return (
    <Box
      sx={{
        gap: 3,
        mb: 5,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
      }}
      {...other}
    >
      <Tabs
        value={selectedYear}
        onChange={(e, newValue) => onSelectYear(newValue)}
        sx={{
          '& .MuiTabs-indicator': {
            display: 'none',
          },
          '& .MuiTab-root': {
            borderRadius: 1,
            mr: 1,
            typography: 'subtitle2',
            '&.Mui-selected': {
              bgcolor: 'text.primary',
              color: 'background.paper',
            },
          },
        }}
      >
        <Tab key="all" label="Todos os Anos" value="all" disableRipple />
        {years.map((year) => (
          <Tab key={year} label={year} value={year} disableRipple />
        ))}
      </Tabs>

      <TextField
        placeholder="Pesquisar por favorecido ou banco..."
        onChange={(e) => onSearch(e.target.value)}
        sx={{
          maxWidth: { md: 440 },
          width: 1,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.paper',
            borderRadius: 1.5,
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
