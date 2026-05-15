import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  years: string[];
  selectedYear: string;
  onSelectYear: (year: string) => void;
  onSearch: (value: string) => void;
  searchQuery: string;
};

export function AnalyticsFilters({ 
  years, 
  selectedYear, 
  onSelectYear, 
  onSearch, 
  searchQuery,
  ...other 
}: Props) {
  const hasSearch = !!searchQuery;

  return (
    <Box
      sx={{
        mb: 5,
        display: 'flex',
        borderRadius: 2,
        overflow: 'hidden',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        boxShadow: (theme) => theme.vars.customShadows.z1,
        border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
      }}
      {...other}
    >
      {/* Header do Perfil Selecionado */}
      {hasSearch && (
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'rgba(0, 167, 111, 0.08)',
            borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}`,
          }}
        >
          <Avatar
            sx={{
              width: 56,
              height: 56,
              mr: 2,
              bgcolor: 'primary.main',
              fontWeight: 'bold',
              fontSize: 20,
            }}
          >
            {searchQuery.charAt(0).toUpperCase()}
            {searchQuery.split(' ')[1]?.charAt(0).toUpperCase() || searchQuery.charAt(1)?.toLowerCase()}
          </Avatar>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Label
                variant="soft"
                color="primary"
                startIcon={<Iconify icon="eva:checkmark-fill" />}
                sx={{ textTransform: 'uppercase', height: 22, fontSize: 10 }}
              >
                Perfil Selecionado
              </Label>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {searchQuery}
            </Typography>
          </Box>
        </Box>
      )}

      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                bgcolor: 'primary.main',
                color: 'common.white',
              },
            },
          }}
        >
          {years.map((year) => (
            <Tab key={year} label={year} value={year} disableRipple />
          ))}
        </Tabs>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            fullWidth
            value={searchQuery}
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

          {hasSearch && (
            <IconButton 
              onClick={() => onSearch('')}
              sx={{ 
                bgcolor: 'rgba(0, 167, 111, 0.08)',
                color: 'primary.main',
                '&:hover': { bgcolor: 'rgba(0, 167, 111, 0.16)' }
              }}
            >
              <Iconify icon="mingcute:close-line" />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
}
