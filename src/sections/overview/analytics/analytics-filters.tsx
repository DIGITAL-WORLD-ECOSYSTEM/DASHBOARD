import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

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
            boxShadow: (theme) => `0 12px 24px -4px rgba(0, 167, 111, 0.42)`,
          }}
        >
          {avatarInitials}
        </Avatar>

        <Box sx={{ flexGrow: 1, zIndex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#1c252e', letterSpacing: -1 }}>
              {displayName}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Label
                variant="outlined"
                sx={{
                  height: 22,
                  fontSize: 10,
                  borderColor: 'rgba(0, 167, 111, 0.24)',
                  bgcolor: 'rgba(0, 167, 111, 0.04)',
                  color: '#00a76f',
                  fontWeight: 800,
                  px: 1,
                  borderRadius: 0.75,
                  textTransform: 'uppercase'
                }}
              >
                ASSOCIADO
              </Label>

              <Label
                variant="filled"
                sx={{
                  background: 'linear-gradient(135deg, #00a76f 0%, #007b55 100%)',
                  color: 'common.white',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  px: 1,
                  height: 22,
                  fontSize: 10,
                  borderRadius: 0.75,
                  boxShadow: (theme) => `0 4px 12px 0 rgba(0, 167, 111, 0.32)`,
                }}
              >
                ATIVO
              </Label>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 0.5 }}>
                <Iconify icon={"solar:user-id-bold-duotone" as any} width={16} sx={{ color: 'text.disabled' }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    fontSize: 12,
                    letterSpacing: 0.5
                  }}
                >
                  ID: {searchQuery.match(/^\d+$/) ? `#${searchQuery}` : '#2024001'}
                </Typography>
              </Box>
            </Box>

            {/* Linha de Documentos e Contatos Secundários */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2.5, mt: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Iconify icon={"solar:card-bold-duotone" as any} width={16} sx={{ color: 'text.disabled' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontFamily: 'monospace', letterSpacing: 0.5 }}>123.456.789-00</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Iconify icon={"solar:document-text-bold-duotone" as any} width={16} sx={{ color: 'text.disabled' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontFamily: 'monospace', letterSpacing: 0.5 }}>12.345.678-9</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Iconify icon={"solar:phone-calling-bold-duotone" as any} width={16} sx={{ color: 'text.disabled' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>+55 (11) 98765-4321</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Iconify icon={"solar:letter-bold-duotone" as any} width={16} sx={{ color: 'text.disabled' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>andressa.ferreira@email.com</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Iconify icon={"solar:mention-circle-bold-duotone" as any} width={16} sx={{ color: 'text.disabled' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>@andressa.ferreira</Typography>
              </Box>
            </Box>
          </Box>
      </Box>

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 0 }}>
        <Tabs
          value={selectedYear}
          onChange={(e, newValue) => onSelectYear(newValue)}
          sx={{
            minHeight: 38,
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTab-root': {
              minHeight: 38,
              borderRadius: '20px',
              mr: 1,
              color: 'text.secondary',
              typography: 'caption',
              fontWeight: 700,
              transition: (theme) => theme.transitions.create(['all']),
              '&.Mui-selected': {
                bgcolor: '#00a76f',
                color: 'common.white',
                boxShadow: '0 4px 12px 0 rgba(0, 167, 111, 0.24)',
              },
              '&:hover': {
                bgcolor: 'rgba(0, 167, 111, 0.08)',
              }
            },
          }}
        >
          {years.map((year) => (
            <Tab key={year} label={year} value={year} disableRipple />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
}
