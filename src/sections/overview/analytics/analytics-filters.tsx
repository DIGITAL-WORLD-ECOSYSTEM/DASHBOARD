import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
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
      {/* Header Dark Finance */}
        <Box
          sx={{
            px: { xs: 3, md: 4 },
            py: 3,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#161c24', // Dark mode background
          }}
        >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 88,
              height: 88,
              mr: 3,
              bgcolor: '#00a76f', // Neon green background
              color: 'common.white',
              fontWeight: 800,
              fontSize: 32,
              border: (theme) => `solid 4px ${theme.vars.palette.common.white}`,
              boxShadow: `0 0 24px 0 rgba(0, 167, 111, 0.42)`, // Neon glow
            }}
          >
            AF
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'common.white', letterSpacing: -1 }}>
              {displayName}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Label
                variant="filled"
                sx={{
                  bgcolor: '#00a76f',
                  color: 'common.white',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  px: 1,
                  height: 24,
                  fontSize: 10,
                  borderRadius: 1,
                  boxShadow: `0 4px 12px 0 rgba(0, 167, 111, 0.24)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <Iconify icon={"solar:shield-check-bold-duotone" as any} width={14} />
                ATIVO
              </Label>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2.5, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

        {/* CSS Grid para os Dados */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            rowGap: 4,
            columnGap: 3 
          }}
        >
          {/* Item: Categoria */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={"solar:user-bold" as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>CATEGORIA</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>ASSOCIADO</Typography>
            </Box>
          </Box>

          {/* Item: ID */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={"solar:user-id-bold" as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>ID</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>{searchQuery.match(/^\d+$/) ? `#${searchQuery}` : '#2024001'}</Typography>
            </Box>
          </Box>

          {/* Item: CPF */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={"solar:card-bold" as any} width={24} sx={{ color: '#00a76f' }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>CPF</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>123.456.789-00</Typography>
            </Box>
          </Box>

          {/* Item 2: RG */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={"solar:document-text-bold" as any} width={24} sx={{ color: '#00a76f' }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>RG</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>12.345.678-9</Typography>
            </Box>
          </Box>

          {/* Item: Data de Nascimento */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={"solar:calendar-date-bold" as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>DATA DE NASC.</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>15/08/1990</Typography>
            </Box>
          </Box>

          {/* Item: Gênero */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={"solar:user-rounded-bold" as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>GÊNERO</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>Feminino</Typography>
            </Box>
          </Box>

          {/* Item 3: Nacionalidade */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={"solar:global-bold" as any} width={24} sx={{ color: '#00a76f' }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Nacionalidade</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>Brasileira</Typography>
            </Box>
          </Box>

          {/* Item 4: Estado Civil */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={"solar:users-group-two-rounded-bold" as any} width={24} sx={{ color: '#00a76f' }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Estado Civil</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>Casada</Typography>
            </Box>
          </Box>

          {/* Item: Profissão */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={"solar:case-bold" as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>PROFISSÃO</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>Empresária</Typography>
            </Box>
          </Box>

          {/* Item 5: Telefone */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={"solar:phone-calling-bold" as any} width={24} sx={{ color: '#00a76f' }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Telefone</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>+55 (11) 98765-4321</Typography>
            </Box>
          </Box>

          {/* Item 6: E-mail */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={"solar:letter-bold" as any} width={24} sx={{ color: '#00a76f' }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>E-mail</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>andressa.ferreira@email.com</Typography>
            </Box>
          </Box>

          {/* Item 7: Social */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={"solar:mention-circle-bold" as any} width={24} sx={{ color: '#00a76f' }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Social</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>@andressa.ferreira</Typography>
            </Box>
          </Box>

        </Box>

        {/* --- INICIO SESSAO ENDERECO --- */}
        <Divider sx={{ mt: 5, mb: 4, '&::before, &::after': { borderColor: 'rgba(255, 255, 255, 0.08)' } }}>
          <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.24)', px: 2, letterSpacing: 1.5 }}>
            ENDEREÇO E LOCALIZAÇÃO
          </Typography>
        </Divider>

        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            rowGap: 4,
            columnGap: 3 
          }}
        >
          {/* CEP */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={"solar:mailbox-bold" as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>CEP</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>04538-133</Typography>
            </Box>
          </Box>

          {/* LOGRADOURO */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={"solar:map-point-bold" as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>LOGRADOURO</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>Av. Brigadeiro Faria Lima, 3477</Typography>
            </Box>
          </Box>

          {/* BAIRRO */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={"solar:buildings-2-bold" as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>BAIRRO</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>Itaim Bibi</Typography>
            </Box>
          </Box>

          {/* CIDADE / UF */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={"solar:city-bold" as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>CIDADE / UF</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>São Paulo - SP</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Tabs / Barra Inferior */}
      <Box sx={{ px: { xs: 3, md: 4 }, py: 2, bgcolor: 'common.white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Tabs
          value={selectedYear}
          onChange={(e, newValue) => onSelectYear(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: 32,
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTab-root': {
              minHeight: 32,
              minWidth: 0,
              px: 2.5,
              py: 0.5,
              borderRadius: 32,
              mr: 1.5,
              color: 'text.secondary',
              typography: 'subtitle2',
              fontWeight: 700,
              bgcolor: 'rgba(145, 158, 171, 0.08)', // Fundo cápsula cinza super sutil (inativo)
              transition: (theme) => theme.transitions.create(['all']),
              '&.Mui-selected': {
                bgcolor: '#00a76f',
                color: 'common.white',
                boxShadow: '0 8px 16px 0 rgba(0, 167, 111, 0.24)',
              },
              '&:hover:not(.Mui-selected)': {
                bgcolor: 'rgba(145, 158, 171, 0.16)', // Escurece levemente no hover
              }
            },
          }}
        >
          {years.map((year) => (
            <Tab key={year} label={year} value={year} disableRipple />
          ))}
        </Tabs>

        <Typography 
          variant="overline" 
          sx={{ 
            color: 'text.disabled', 
            letterSpacing: 1,
            display: { xs: 'none', md: 'block' } // Esconder no celular por espaço
          }}
        >
          PERÍODO DE ANÁLISE
        </Typography>
      </Box>
    </Box>
  );
}
