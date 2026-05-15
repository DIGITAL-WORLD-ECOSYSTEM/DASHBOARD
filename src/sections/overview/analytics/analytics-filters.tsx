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
        p: 2.5,
        gap: 3,
        mb: 5,
        display: 'flex',
        borderRadius: 2,
        flexDirection: 'column',
        bgcolor: 'background.paper',
        boxShadow: (theme) => theme.vars.customShadows.z1,
        border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
      }}
      {...other}
    >
      <Tabs
        value={selectedYear}
        onChange={(e, newValue) => onSelectYear(newValue)}
        sx={{
          minHeight: 40,
          '& .MuiTabs-indicator': {
            display: 'none',
          },
          '& .MuiTab-root': {
            minHeight: 40,
            borderRadius: 1,
            mr: 1,
            color: 'text.secondary',
            typography: 'subtitle2',
            '&.Mui-selected': {
              bgcolor: 'grey.900',
              color: 'common.white',
            },
          },
        }}
      >
        <Tab key="Todos" label="Todos" value="Todos" disableRipple />
        {years.map((year) => (
          <Tab key={year} label={year} value={year} disableRipple />
        ))}
      </Tabs>

      <TextField
        fullWidth
        placeholder="Pesquisar por favorecido ou banco..."
        onChange={(e) => onSearch(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: 'grey.50',
            borderRadius: 1.5,
            '& fieldset': {
              borderColor: 'grey.200',
            },
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
