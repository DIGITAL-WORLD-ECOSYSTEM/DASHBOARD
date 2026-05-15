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
  summary: {
    totalInflow: number;
    count: number;
  };
};

export function AnalyticsFilters({ 
  years, 
  selectedYear, 
  onSelectYear, 
  onSearch, 
  searchQuery,
  summary,
  ...other 
}: Props) {
  const displayName = searchQuery || 'Andressa de Lima Ferreira';
  const avatarInitials = searchQuery 
    ? (searchQuery.charAt(0).toUpperCase() + (searchQuery.split(' ')[1]?.charAt(0).toUpperCase() || searchQuery.charAt(1)?.toLowerCase()))
    : 'Ad';

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
      {/* Header do Perfil Selecionado (Sempre Visível) */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          position: 'relative',
          alignItems: 'center',
          bgcolor: '#e6f7f1',
          borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}`,
          overflow: 'hidden',
        }}
      >
        {/* Silhueta decorativa de fundo */}
        <Iconify
          icon={"solar:user-bold-duotone" as any}
          sx={{
            position: 'absolute',
            right: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 140,
            height: 140,
            opacity: 0.05,
            color: 'primary.main',
          }}
        />

        <Avatar
          sx={{
            width: 88,
            height: 88,
            mr: 3,
            bgcolor: '#00a76f',
            fontWeight: 800,
            fontSize: 32,
            border: (theme) => `solid 4px ${theme.vars.palette.common.white}`,
            boxShadow: (theme) => theme.vars.customShadows.z12,
          }}
        >
          {avatarInitials}
        </Avatar>

        <Box sx={{ flexGrow: 1, zIndex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Label
                variant="soft"
                sx={{ 
                  height: 20, 
                  fontSize: 10,
                  bgcolor: '#c8fad6',
                  color: '#007b55',
                  fontWeight: 900,
                  px: 1,
                  borderRadius: 0.5,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase'
                }}
              >
                Associado Vincit
              </Label>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#1c252e', letterSpacing: -1 }}>
                {displayName}
              </Typography>

              <Label
                variant="filled"
                sx={{
                  bgcolor: '#00a76f',
                  color: 'common.white',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  px: 1.5,
                  height: 24,
                  fontSize: 11,
                  borderRadius: 1,
                  boxShadow: (theme) => `0 8px 16px 0 rgba(0, 167, 111, 0.24)`,
                }}
              >
                CONTA ATIVA
              </Label>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
              <Iconify icon={"solar:user-id-bold-duotone" as any} width={18} sx={{ color: 'text.disabled' }} />
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: 'text.secondary', 
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  fontSize: 13,
                  letterSpacing: 1
                }}
              >
                ID: {searchQuery.match(/^\d+$/) ? `#${searchQuery}` : '#2024001'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, mt: 2.5 }}>
            <Box
              sx={{
                py: 0.75,
                px: 1.5,
                display: 'flex',
                borderRadius: 1.25,
                bgcolor: 'common.white',
                alignItems: 'center',
                border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
                boxShadow: (theme) => theme.vars.customShadows.z1,
              }}
            >
              <Iconify icon={"solar:playlist-2-bold-duotone" as any} width={22} sx={{ mr: 1, color: '#00a76f' }} />
              <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 800 }}>
                {summary.count} transações
              </Typography>
            </Box>

            <Box
              sx={{
                py: 0.75,
                px: 1.5,
                display: 'flex',
                borderRadius: 1.25,
                bgcolor: 'common.white',
                alignItems: 'center',
                border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
                boxShadow: (theme) => theme.vars.customShadows.z1,
              }}
            >
              <Iconify icon={"solar:dollar-minimalistic-bold-duotone" as any} width={22} sx={{ mr: 1, color: '#00a76f' }} />
              <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 800 }}>
                R$ {summary.totalInflow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

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
                bgcolor: '#00a76f',
                color: 'common.white',
              },
            },
          }}
        >
          {years.map((year) => (
            <Tab key={year} label={year} value={year} disableRipple />
          ))}
        </Tabs>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            fullWidth
            value={searchQuery}
            placeholder="Pesquisar por favorecido ou banco..."
            onChange={(e) => onSearch(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'common.white',
                borderRadius: 1.5,
                border: 'solid 1px #e0e0e0',
                '& fieldset': {
                  border: 'none',
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

          <IconButton 
            onClick={() => onSearch('')}
            sx={{ 
              width: 48,
              height: 48,
              borderRadius: 1.5,
              bgcolor: '#e6f7f1',
              color: '#00a76f',
              '&:hover': { bgcolor: '#c8fad6' }
            }}
          >
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
