import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Step from '@mui/material/Step';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import Badge from '@mui/material/Badge';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Stepper from '@mui/material/Stepper';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Skeleton from '@mui/material/Skeleton';
import MenuItem from '@mui/material/MenuItem';
import StepLabel from '@mui/material/StepLabel';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AlertTitle from '@mui/material/AlertTitle';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import Pagination from '@mui/material/Pagination';
import CardContent from '@mui/material/CardContent';
import AvatarGroup from '@mui/material/AvatarGroup';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';

import { themeConfig } from 'src/theme/theme-config';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Editor } from 'src/components/editor';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { FlagIcon } from 'src/components/flag-icon';
import { CyberCard } from 'src/components/cyber-card';
import { Chart, useChart } from 'src/components/chart';
import { PhoneInput } from 'src/components/phone-input';
import { NumberInput } from 'src/components/number-input';
import { CyberButton } from 'src/components/cyber-button';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { FileThumbnail } from 'src/components/file-thumbnail';
import { CountrySelect } from 'src/components/country-select';
import { SearchNotFound } from 'src/components/search-not-found';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ColorPicker, ColorPreview } from 'src/components/color-utils';
import { Upload, UploadBox, UploadAvatar } from 'src/components/upload';
import { TableSkeleton, TableHeadCustom, TablePaginationCustom } from 'src/components/table';
import { EdgerInlineNotification, EdgerCard, EdgerButton, EdgerSquircleBadge } from 'src/components/edger-lights';

// ----------------------------------------------------------------------

type TabValue =
  | 'colors'
  | 'buttons'
  | 'inputs'
  | 'advanced-inputs'
  | 'cards'
  | 'data'
  | 'media-upload'
  | 'charts'
  | 'feedback'
  | 'navigation-utils';

const COLOR_TOKENS = [
  { name: 'Primary (Cyber Green)', color: '#00A76F', role: 'Ações primárias, links ativos, destaques' },
  { name: 'Secondary (Cosmic Purple)', color: '#8E33FF', role: 'Destaques secundários, governança' },
  { name: 'Info (Cyan Blue)', color: '#00B8D9', role: 'Métricas, informativos e telecomunicações' },
  { name: 'Success (Matrix Green)', color: '#22C55E', role: 'Sucesso, saldo positivo, status online' },
  { name: 'Warning (Amber Gold)', color: '#FFAB00', role: 'Alertas de tesouraria, confirmações pendentes' },
  { name: 'Error (Crimson Neon)', color: '#FF5630', role: 'Falhas críticas, liquidações, bloqueios' },
];

const GREY_TOKENS = [
  { label: '50', color: '#FCFDFD' },
  { label: '100', color: '#F9FAFB' },
  { label: '200', color: '#F4F6F8' },
  { label: '300', color: '#DFE3E8' },
  { label: '400', color: '#C4CDD5' },
  { label: '500', color: '#919EAB' },
  { label: '600', color: '#637381' },
  { label: '700', color: '#454F5B' },
  { label: '800', color: '#212B36' },
  { label: '900', color: '#161C24' },
];

const TABLE_HEAD = [
  { id: 'nome', label: 'Nome / ID' },
  { id: 'funcao', label: 'Função / Módulo' },
  { id: 'status', label: 'Status' },
  { id: 'saldo', label: 'Saldo (DAO)' },
  { id: 'acoes', label: 'Ações', align: 'right' as const },
];

// ----------------------------------------------------------------------

export function DesignSystemView() {
  const [currentTab, setCurrentTab] = useState<TabValue>('colors');

  // Estados de formulários e seletores
  const [switchChecked, setSwitchChecked] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [radioValue, setRadioValue] = useState('opcao1');
  const [sliderValue, setSliderValue] = useState<number>(65);
  const [ratingValue, setRatingValue] = useState<number | null>(4);
  const [countryValue, setCountryValue] = useState('Brazil');
  const [phoneValue, setPhoneValue] = useState('+5511988887777');
  const [numberValue, setNumberValue] = useState<number | null>(10);
  const [colorValue, setColorValue] = useState('#00A76F');
  const [autocompleteValue, setAutocompleteValue] = useState<string | null>('Solana');
  const [editorContent, setEditorContent] = useState(
    '<h4>Protocolo DAO — Diretriz de Design</h4><p>Este texto é renderizado diretamente pelo componente <strong>Editor</strong> com suporte a formatação avançada.</p>'
  );

  // Estados de tabelas e paginação
  const [tablePage, setTablePage] = useState(0);
  const [tableRowsPerPage, setTableRowsPerPage] = useState(5);
  const [isTableDense, setIsTableDense] = useState(false);
  const [showTableSkeleton, setShowTableSkeleton] = useState(false);

  // Estados de modais e popovers
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);

  // Estado de Stepper
  const [activeStep, setActiveStep] = useState(1);
  const steps = ['Planejamento', 'Design System', 'Homologação', 'Deploy'];

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: TabValue) => {
    setCurrentTab(newValue);
  }, []);

  // Gráficos configurados via useChart
  const areaChartOptions = useChart({
    colors: ['#00A76F', '#8E33FF'],
    xaxis: { categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'] },
    stroke: { curve: 'smooth', width: 2 },
    tooltip: { y: { formatter: (val: number) => `${val} mil` } },
  });

  const barChartOptions = useChart({
    colors: ['#00B8D9'],
    stroke: { width: 0 },
    xaxis: { categories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] },
    plotOptions: { bar: { columnWidth: '45%', borderRadius: 4 } },
  });

  const donutChartOptions = useChart({
    colors: ['#00A76F', '#8E33FF', '#00B8D9', '#FFAB00'],
    labels: ['Membros Ativos', 'Governança', 'Tesouro', 'Staking'],
    stroke: { width: 0 },
  });

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Catálogo do Design System"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Design System', href: paths.dashboard.designSystem },
          { name: 'Showcase Interativo' },
        ]}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon={'solar:refresh-circle-bold' as any} />}
            onClick={() => toast.info('Design System sincronizado com os tokens ativos!')}
          >
            Sincronizar Tema
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: 4, p: 2 }}>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<Iconify icon={'solar:palette-round-bold-duotone' as any} />}
            iconPosition="start"
            label="1. Cores & Tipografia"
            value="colors"
          />
          <Tab
            icon={<Iconify icon={'solar:cursor-bold-duotone' as any} />}
            iconPosition="start"
            label="2. Botões & Ações"
            value="buttons"
          />
          <Tab
            icon={<Iconify icon={'solar:pen-new-square-bold-duotone' as any} />}
            iconPosition="start"
            label="3. Formulários Básicos"
            value="inputs"
          />
          <Tab
            icon={<Iconify icon={'solar:slider-vertical-bold-duotone' as any} />}
            iconPosition="start"
            label="4. Seletores Avançados"
            value="advanced-inputs"
          />
          <Tab
            icon={<Iconify icon={'solar:widget-5-bold-duotone' as any} />}
            iconPosition="start"
            label="5. Cards & Superfícies"
            value="cards"
          />
          <Tab
            icon={<Iconify icon={'solar:list-bold-duotone' as any} />}
            iconPosition="start"
            label="6. Tabelas, Badges & Paginação"
            value="data"
          />
          <Tab
            icon={<Iconify icon={'solar:cloud-upload-bold-duotone' as any} />}
            iconPosition="start"
            label="7. Upload & Mídia"
            value="media-upload"
          />
          <Tab
            icon={<Iconify icon={'solar:chart-2-bold-duotone' as any} />}
            iconPosition="start"
            label="8. Gráficos & Métricas"
            value="charts"
          />
          <Tab
            icon={<Iconify icon={'solar:danger-triangle-bold-duotone' as any} />}
            iconPosition="start"
            label="9. Alertas, Feedback & Modais"
            value="feedback"
          />
          <Tab
            icon={<Iconify icon={'solar:compass-bold-duotone' as any} />}
            iconPosition="start"
            label="10. Navegação & Utilidades"
            value="navigation-utils"
          />
        </Tabs>
      </Card>

      {/* ABA 1: CORES E TIPOGRAFIA */}
      {currentTab === 'colors' && (
        <Stack spacing={4}>
          <Card>
            <CardHeader
              title="Paleta Temática Principal"
              subheader="Tokens semânticos utilizados na interface do WebApp"
            />
            <CardContent>
              <Grid container spacing={2}>
                {COLOR_TOKENS.map((token) => (
                  <Grid key={token.name} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderRadius: 2,
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-2px)' },
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 1.5,
                          bgcolor: token.color,
                          boxShadow: (theme) => `0 4px 12px ${token.color}40`,
                        }}
                      />
                      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          {token.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          HEX: {token.color}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                          {token.role}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Escala de Neutros (Grey Tokens)" subheader="Superfícies, bordas e contraste" />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {GREY_TOKENS.map((grey) => (
                  <Box
                    key={grey.label}
                    sx={{
                      flex: '1 1 80px',
                      p: 1.5,
                      textAlign: 'center',
                      borderRadius: 1.5,
                      bgcolor: grey.color,
                      border: '1px solid',
                      borderColor: 'divider',
                      color: parseInt(grey.label, 10) > 400 ? '#FFFFFF' : '#161C24',
                    }}
                  >
                    <Typography variant="subtitle2">{grey.label}</Typography>
                    <Typography variant="caption" sx={{ fontSize: 10, display: 'block' }}>
                      {grey.color}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Escala Tipográfica & Fontes"
              subheader={`Fonte Secundária / Cyber: ${themeConfig.fontFamily.secondary} | Fonte Primária: ${themeConfig.fontFamily.primary}`}
            />
            <CardContent>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="h1" sx={{ fontFamily: 'var(--font-orbitron), "Orbitron", sans-serif' }}>
                    h1. Orbitron Cyber Title (32px / 40px)
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="h2" sx={{ fontFamily: 'var(--font-orbitron), "Orbitron", sans-serif' }}>
                    h2. Orbitron Subtitle Header (28px / 36px)
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="h3">h3. Título de Seção DM Sans (24px)</Typography>
                  <Typography variant="h4">h4. Título de Cartão DM Sans (20px)</Typography>
                  <Typography variant="h5">h5. Subtítulo Médio DM Sans (18px)</Typography>
                  <Typography variant="h6">h6. Subtítulo Pequeno DM Sans (16px)</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>body1:</strong> O ASPPIBRA WebApp foi concebido com uma arquitetura desacoplada,
                    oferecendo alta performance, confiabilidade e governança descentralizada.
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <strong>body2:</strong> Texto secundário de suporte e descrições detalhadas para leitura
                    confortável em qualquer dispositivo.
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 0.5 }}>
                    <strong>caption:</strong> Rótulos de metadados, carimbos de data/hora e identificadores de hash.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* ABA 2: BOTÕES E AÇÕES */}
      {currentTab === 'buttons' && (
        <Stack spacing={4}>
          <Card>
            <CardHeader title="Variantes de Botões MUI" subheader="Contained, Soft, Outlined e Text" />
            <CardContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                    Variante Contained (Preenchido)
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <Button variant="contained" color="primary">Primary</Button>
                    <Button variant="contained" color="secondary">Secondary</Button>
                    <Button variant="contained" color="info">Info</Button>
                    <Button variant="contained" color="success">Success</Button>
                    <Button variant="contained" color="warning">Warning</Button>
                    <Button variant="contained" color="error">Error</Button>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                    Variante Soft (Fundo Translúcido com Alta Legibilidade)
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <Button variant="soft" color="primary">Primary Soft</Button>
                    <Button variant="soft" color="secondary">Secondary Soft</Button>
                    <Button variant="soft" color="info">Info Soft</Button>
                    <Button variant="soft" color="success">Success Soft</Button>
                    <Button variant="soft" color="warning">Warning Soft</Button>
                    <Button variant="soft" color="error">Error Soft</Button>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                    Variante Outlined (Contorno)
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <Button variant="outlined" color="primary">Primary</Button>
                    <Button variant="outlined" color="secondary">Secondary</Button>
                    <Button variant="outlined" color="info">Info</Button>
                    <Button variant="outlined" color="success">Success</Button>
                    <Button variant="outlined" color="warning">Warning</Button>
                    <Button variant="outlined" color="error">Error</Button>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Tamanhos de Botão & Floating Action Button (FAB)" subheader="Hierarquia de escala" />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 3 }}>
                <Button variant="contained" size="small" color="primary">Small</Button>
                <Button variant="contained" size="medium" color="primary">Medium</Button>
                <Button variant="contained" size="large" color="primary">Large</Button>
                <Button variant="contained" size="xLarge" color="primary">Extra Large</Button>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                Floating Action Buttons (FAB) & IconButtons
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Fab color="primary" size="small">
                  <Iconify icon={'solar:add-circle-bold' as any} />
                </Fab>
                <Fab color="secondary" size="medium">
                  <Iconify icon={'solar:star-bold' as any} />
                </Fab>
                <Fab color="primary" variant="extended">
                  <Iconify icon={'solar:check-read-bold' as any} sx={{ mr: 1 }} />
                  Ação Estendida
                </Fab>
                <IconButton color="primary">
                  <Iconify icon={'solar:settings-bold-duotone' as any} />
                </IconButton>
                <IconButton color="info">
                  <Iconify icon={'solar:bell-bold-duotone' as any} />
                </IconButton>
                <IconButton color="error">
                  <Iconify icon={'solar:trash-bin-trash-bold-duotone' as any} />
                </IconButton>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="CyberButton Customizado"
              subheader="Botão temático com visual cibernético, neon e cantos chanfrados"
            />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <CyberButton variant="contained" color="primary" glowColor="primary">
                  Cyber Primary Glow
                </CyberButton>
                <CyberButton variant="outlined" color="primary">
                  Cyber Primary Outlined
                </CyberButton>
                <CyberButton variant="contained" color="secondary" glowColor="secondary">
                  Cyber Secondary Glow
                </CyberButton>
                <CyberButton variant="outlined" color="secondary">
                  Cyber Secondary Outlined
                </CyberButton>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* ABA 3: FORMULÁRIOS BÁSICOS */}
      {currentTab === 'inputs' && (
        <Stack spacing={4}>
          <Card>
            <CardHeader title="Campos de Texto (TextField)" subheader="Variações de estado, adornments e validação" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField fullWidth label="Padrão Outlined" placeholder="Digite seu nome..." />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Com Ícone Inicial"
                    defaultValue="sandro_ceo@asppibra.com.br"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon={'solar:letter-bold-duotone' as any} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Com Ícone Final"
                    placeholder="Chave pública..."
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Iconify icon={'solar:key-minimalistic-bold-duotone' as any} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    error
                    label="Estado de Erro"
                    defaultValue="valor_invalido_123"
                    helperText="Este campo possui uma inconsistência"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField fullWidth disabled label="Desabilitado" defaultValue="Campo não editável" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    select
                    label="Seleção Simples"
                    defaultValue="governance"
                    slotProps={{ select: { native: true } }}
                  >
                    <option value="governance">Governança DAO</option>
                    <option value="treasury">Tesouraria Ativa</option>
                    <option value="infrastructure">Infraestrutura DevOps</option>
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Controles de Seleção & Alternância" subheader="Switches, Checkboxes, Radios, Sliders e Ratings" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Switches & Checkboxes</Typography>
                  <Stack spacing={1}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={switchChecked}
                          onChange={(e) => setSwitchChecked(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Notificações em Tempo Real"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkboxChecked}
                          onChange={(e) => setCheckboxChecked(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Concordo com os Termos DAO"
                    />
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Grupos de Rádio</Typography>
                  <FormControl>
                    <RadioGroup value={radioValue} onChange={(e) => setRadioValue(e.target.value)}>
                      <FormControlLabel value="opcao1" control={<Radio color="primary" />} label="Transações Rápidas" />
                      <FormControlLabel value="opcao2" control={<Radio color="secondary" />} label="Transações Seguras" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Avaliação (Rating)</Typography>
                  <Rating
                    value={ratingValue}
                    onChange={(e, val) => setRatingValue(val)}
                    size="large"
                  />
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}>
                    Valor selecionado: {ratingValue} estrelas
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Slider de Graduação (Valor: {sliderValue}%)
                  </Typography>
                  <Slider
                    value={sliderValue}
                    onChange={(e, val) => setSliderValue(val as number)}
                    valueLabelDisplay="auto"
                    color="primary"
                    sx={{ maxWidth: 400 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* ABA 4: SELETORES AVANÇADOS */}
      {currentTab === 'advanced-inputs' && (
        <Stack spacing={4}>
          <Card>
            <CardHeader
              title="Entradas Especializadas do Sistema"
              subheader="CountrySelect, PhoneInput, NumberInput, ColorPicker e Autocomplete"
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    CountrySelect (Seletor Internacional com Bandeiras)
                  </Typography>
                  <CountrySelect
                    label="País de Domicílio"
                    value={countryValue}
                    onChange={(event, val) => setCountryValue(val as string)}
                    placeholder="Selecione um país"
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                    Selecionado: {countryValue}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    PhoneInput (Telefone com Máscara e DDI)
                  </Typography>
                  <PhoneInput
                    label="Telefone Corporativo"
                    value={phoneValue}
                    onChange={(val) => setPhoneValue(val || '')}
                    defaultCountry="BR"
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                    Número normalizado: {phoneValue}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    NumberInput (Contador Numérico)
                  </Typography>
                  <NumberInput
                    value={numberValue}
                    onChange={(event, val) => setNumberValue(val)}
                    min={1}
                    max={100}
                    helperText="Ajuste a quantidade de nós de validação (1 a 100)"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Autocomplete (Busca com Tags)
                  </Typography>
                  <Autocomplete
                    options={['Solana', 'Ethereum', 'Bitcoin', 'Polygon', 'Avalanche', 'Cosmos']}
                    value={autocompleteValue}
                    onChange={(event, val) => setAutocompleteValue(val)}
                    renderInput={(params) => <TextField {...params} label="Rede Blockchain" />}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                    ColorPicker & ColorPreview (Seleção de Cores da Paleta)
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                    <ColorPicker
                      value={colorValue}
                      onChange={(val) => setColorValue(val as string)}
                      options={['#00A76F', '#8E33FF', '#00B8D9', '#22C55E', '#FFAB00', '#FF5630', '#212B36']}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Preview em conjunto:
                      </Typography>
                      <ColorPreview colors={['#00A76F', '#8E33FF', '#00B8D9', '#FFAB00']} />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Editor de Texto Rico (WYSIWYG)"
              subheader="Componente Editor baseado em Tiptap integrado ao tema"
            />
            <CardContent>
              <Editor
                value={editorContent}
                onChange={(val) => setEditorContent(val)}
                placeholder="Escreva algo formatado..."
              />
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* ABA 5: CARDS E SUPERFÍCIES */}
      {currentTab === 'cards' && (
        <Stack spacing={4}>
          {/* 1. MODELOS ESTRUTURAIS DE PRODUÇÃO (DASHBOARD CORE) */}
          <Box>
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                1. Modelos Estruturais em Produção (Dashboard Core)
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Cards de conteúdo padrão, indicadores executivos e contêineres de dados utilizados nas telas principais.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Modelo A: Card Esculpido 3D Padrão */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
                      <Iconify icon={'solar:cube-bold-duotone' as any} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Card Esculpido 3D</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Superfície MuiCard Padrão</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, flexGrow: 1 }}>
                    Superfície sólida com gradiente suave, elevação física, cantos arredondados de 20px e chanfro interno de luz superior.
                  </Typography>
                  <Button variant="soft" color="primary" fullWidth>
                    Ver Detalhes
                  </Button>
                </Card>
              </Grid>

              {/* Modelo B: Card de Indicadores / KPI Summary */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        Volume Transacionado
                      </Typography>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: 'success.lighter', color: 'success.main' }}>
                        <Iconify icon={'solar:wallet-money-bold' as any} width={20} />
                      </Avatar>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                      R$ 1.845.200
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, pt: 1, borderTop: '1px dashed', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main', typography: 'subtitle2' }}>
                      <Iconify icon={'solar:double-alt-arrow-up-bold-duotone' as any} width={18} sx={{ mr: 0.25 }} />
                      +14.8%
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      vs mês anterior no livro-razão
                    </Typography>
                  </Box>
                </Card>
              </Grid>

              {/* Modelo C: Card Contêiner com Header & Ações */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardHeader
                    title="Contêiner Operacional"
                    subheader="Relatórios & Tabelas"
                    action={
                      <IconButton size="small">
                        <Iconify icon={'solar:menu-dots-bold' as any} />
                      </IconButton>
                    }
                    sx={{ pb: 1 }}
                  />
                  <CardContent sx={{ pt: 1, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                      Estrutura padrão com cabeçalho delimitado, área flexível de dados e rodapé de comando rápido.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined" color="inherit" fullWidth>
                        Filtrar
                      </Button>
                      <Button size="small" variant="contained" color="primary" fullWidth>
                        Acessar
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* 2. MODELOS TRANSLÚCIDOS E EXPERIMENTAIS */}
          <Box>
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                2. Modelos Translúcidos & Experimentais
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Superfícies de vidro escuro (Obsidian) e estética temática de alta densidade (CyberCard).
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Obsidian Glass */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    backdropFilter: 'blur(16px)',
                    backgroundColor: (theme) => `${theme.vars.palette.background.paper}B3`,
                    border: '1px solid',
                    borderColor: (theme) => `${theme.vars.palette.primary.main}33`,
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.lighter', color: 'secondary.main' }}>
                      <Iconify icon={'solar:ghost-bold-duotone' as any} />
                    </Avatar>
                    <Typography variant="h6">Obsidian Glass</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Vidro translúcido com desfoque de fundo (backdrop-filter) e reflexo de borda ciano/violeta para painéis noturnos.
                  </Typography>
                  <Button variant="soft" color="secondary" fullWidth>
                    Explorar Vidro
                  </Button>
                </Paper>
              </Grid>

              {/* CyberCard Futurista */}
              <Grid size={{ xs: 12, md: 6 }}>
                <CyberCard
                  variant="default"
                  glow
                  sx={{ height: '100%', p: 3 }}
                >
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    CyberCard Futurista
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Card temático de alta densidade com cantos chanfrados e estética neon para módulos de inteligência e tesouraria.
                  </Typography>
                  <CyberButton variant="contained" color="primary" fullWidth glowColor="primary">
                    Executar Operação
                  </CyberButton>
                </CyberCard>
              </Grid>
            </Grid>
          </Box>

          {/* 3. COLEÇÃO EDGER LIGHTS — BLOCO VERTICAL */}
          <Box>
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                3. Coleção EDGER Lights — Bloco Vertical (EdgerCard)
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Cartões verticais em formato de bloco clássico com destaque tátil 3D lateral e bottom.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <EdgerCard
                  variant="rose"
                  edgeStyle="lateral"
                  title="Alerta de Liquidez Crítica"
                  description="Pool de liquidez da tesouraria atingiu limiar mínimo configurado para rebalanceamento."
                  icon="solar:shield-warning-bold"
                  actionText="Rebalancear"
                  onAction={() => alert('Ação: Rebalancear Pool')}
                  unread
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <EdgerCard
                  variant="emerald"
                  edgeStyle="bottom"
                  title="Rendimento de Staking Ativo"
                  description="Ciclo #14 encerrado com taxa de rendimento de 12.8% a.a. distribuída aos associados."
                  icon="solar:cup-star-bold"
                  actionText="Ver Extrato"
                  onAction={() => alert('Ação: Ver Extrato de Staking')}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ======================================================== */}
          {/* EDGER LIGHTS UI — INLINE NOTIFICATION                    */}
          {/* ======================================================== */}
          <Box sx={{ my: 1 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                EDGER Lights UI — Inline Notification
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Modelo oficial de avisos em linha táteis com borda lateral e efeito de vidro 3D.
              </Typography>
            </Box>

            <Stack spacing={2.2}>
              {/* 1. Vermelho / Rose — Segurança & Erro Crítico */}
              <EdgerInlineNotification
                variant="rose"
                edgeStyle="lateral"
                title="Manutenção Programada"
                description="O sistema de saques Pix ficará indisponível no sábado das 02h às 04h."
                icon="solar:danger-bold"
                actionText="Marcar Lida"
                onAction={() => alert('Ação: Marcar Lida (Rose)')}
              />

              {/* 2. Âmbar / Amber — Atenção & Avisos Operacionais */}
              <EdgerInlineNotification
                variant="amber"
                edgeStyle="lateral"
                title="Assembleia Extraordinária"
                description="Faltam apenas 2 dias para o fechamento de pautas da próxima assembleia."
                icon="solar:danger-triangle-bold"
                actionText="Marcar Lida"
                onAction={() => alert('Ação: Marcar Lida (Amber)')}
              />

              {/* 3. Verde / Emerald — Sucesso & Confirmações On-Chain */}
              <EdgerInlineNotification
                variant="emerald"
                edgeStyle="lateral"
                title="Liquidação Concluída com Sucesso"
                description="Contrato #8492 aprovado pelo conselho e liquidado on-chain. Recibo criptográfico assinado."
                icon="solar:check-circle-bold"
                actionText="Marcar Lida"
                onAction={() => alert('Ação: Marcar Lida (Emerald)')}
              />

              {/* 4. Azul / Sky — Governança & Informação Institucional */}
              <EdgerInlineNotification
                variant="sky"
                edgeStyle="lateral"
                title="Proposta de Governança Aberta"
                description="Votação aberta para a proposta #27 da DAO: Expansão do programa de associados institucionais."
                icon="solar:users-group-two-rounded-bold"
                actionText="Marcar Lida"
                onAction={() => alert('Ação: Marcar Lida (Sky)')}
              />

              {/* 5. Roxo / Purple — Identidade Digital, Protocolo VIP & DID */}
              <EdgerInlineNotification
                variant="purple"
                edgeStyle="lateral"
                title="Identidade Digital Vinculada"
                description="Sua credencial de membro pleno foi vinculada ao DID. Acesso aos canais estratégicos concedido."
                icon="solar:crown-star-bold"
                actionText="Marcar Lida"
                onAction={() => alert('Ação: Marcar Lida (Purple)')}
              />

              {/* 6. Grafite / Slate — Auditoria, Infraestrutura & Livro-Razão */}
              <EdgerInlineNotification
                variant="slate"
                edgeStyle="lateral"
                title="Backup do Livro-Razão Concluído"
                description="Snapshot diário contábil gerado com sucesso. Hash de integridade validado na trilha de auditoria."
                icon="solar:database-bold"
                actionText="Marcar Lida"
                onAction={() => alert('Ação: Marcar Lida (Slate)')}
              />
            </Stack>
          </Box>

          <Card>
            <CardHeader title="Sanfona Expansível (Accordion)" subheader="Superfícies colapsáveis para dados densos" />
            <CardContent>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<Iconify icon={'solar:alt-arrow-down-bold' as any} />}>
                  <Typography variant="subtitle1">Estrutura de Governança Descentralizada</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    A governança é exercida pelos detentores de tokens através de votações transparentes
                    registradas em contratos inteligentes com timelock de segurança.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<Iconify icon={'solar:alt-arrow-down-bold' as any} />}>
                  <Typography variant="subtitle1">Políticas de Segurança e Auditoria Criptográfica</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Todas as transações exigem aprovação multi-assinatura e registros imutáveis em log de auditoria.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* ABA 6: TABELAS, BADGES E PAGINAÇÃO */}
      {currentTab === 'data' && (
        <Stack spacing={4}>
          <Card>
            <CardHeader title="Badges de Status (Label)" subheader="Variantes Soft, Filled e Outlined" />
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                    Variante Soft
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Label variant="soft" color="default">Default</Label>
                    <Label variant="soft" color="primary">Primary</Label>
                    <Label variant="soft" color="secondary">Secondary</Label>
                    <Label variant="soft" color="info">Info</Label>
                    <Label variant="soft" color="success">Success</Label>
                    <Label variant="soft" color="warning">Warning</Label>
                    <Label variant="soft" color="error">Error</Label>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                    Variante Filled
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Label variant="filled" color="primary">Ativo</Label>
                    <Label variant="filled" color="secondary">Pendente</Label>
                    <Label variant="filled" color="success">Concluído</Label>
                    <Label variant="filled" color="error">Revogado</Label>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Avatares & Grupos (AvatarGroup)" subheader="Componentes de perfil e usuários empilhados" />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>SC</Avatar>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>DAO</Avatar>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <Iconify icon={'solar:user-bold' as any} />
                </Avatar>
                <Divider orientation="vertical" flexItem />
                <AvatarGroup max={4}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>B</Avatar>
                  <Avatar sx={{ bgcolor: 'info.main' }}>C</Avatar>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>D</Avatar>
                  <Avatar sx={{ bgcolor: 'error.main' }}>E</Avatar>
                </AvatarGroup>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Tabela de Dados Interativa"
              subheader="Demonstração com TableHeadCustom, linhas estilizadas e paginação personalizada"
              action={
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setShowTableSkeleton(!showTableSkeleton)}
                >
                  {showTableSkeleton ? 'Mostrar Dados' : 'Ver Skeleton'}
                </Button>
              }
            />
            <TableContainer sx={{ position: 'relative' }}>
              <Table size={isTableDense ? 'small' : 'medium'}>
                <TableHeadCustom headCells={TABLE_HEAD} />
                <TableBody>
                  {showTableSkeleton ? (
                    <TableSkeleton rowCount={3} cellCount={5} />
                  ) : (
                    <>
                      <TableRow hover>
                        <TableCell>
                          <Typography variant="subtitle2">Sandro Silva</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>sandro@asppibra.com.br</Typography>
                        </TableCell>
                        <TableCell>CEO / Administrador</TableCell>
                        <TableCell><Label variant="soft" color="success">Online</Label></TableCell>
                        <TableCell><Typography variant="subtitle2">145.200 DAO</Typography></TableCell>
                        <TableCell align="right">
                          <IconButton size="small"><Iconify icon={'solar:menu-dots-bold' as any} /></IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell>
                          <Typography variant="subtitle2">Contrato de Tesouraria</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>0x87a...4b12</Typography>
                        </TableCell>
                        <TableCell>Smart Contract</TableCell>
                        <TableCell><Label variant="soft" color="primary">Ativo</Label></TableCell>
                        <TableCell><Typography variant="subtitle2">1.250.000 DAO</Typography></TableCell>
                        <TableCell align="right">
                          <IconButton size="small"><Iconify icon={'solar:menu-dots-bold' as any} /></IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell>
                          <Typography variant="subtitle2">Nó Validador #04</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>192.168.1.104</Typography>
                        </TableCell>
                        <TableCell>Infraestrutura</TableCell>
                        <TableCell><Label variant="soft" color="warning">Sincronizando</Label></TableCell>
                        <TableCell><Typography variant="subtitle2">50.000 DAO</Typography></TableCell>
                        <TableCell align="right">
                          <IconButton size="small"><Iconify icon={'solar:menu-dots-bold' as any} /></IconButton>
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePaginationCustom
              count={25}
              page={tablePage}
              rowsPerPage={tableRowsPerPage}
              dense={isTableDense}
              onChangeDense={(e) => setIsTableDense(e.target.checked)}
              onPageChange={(e, newPage) => setTablePage(newPage)}
              onRowsPerPageChange={(e) => setTableRowsPerPage(parseInt(e.target.value, 10))}
            />
          </Card>

          <Card>
            <CardHeader title="Paginação Numérica MUI" subheader="Alternativa de paginação com links diretos" />
            <CardContent>
              <Pagination count={10} color="primary" />
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* ABA 7: UPLOAD E MÍDIA */}
      {currentTab === 'media-upload' && (
        <Stack spacing={4}>
          <Card>
            <CardHeader
              title="Miniaturas de Arquivos (FileThumbnail)"
              subheader="Ícones semânticos para cada extensão de arquivo reconhecida"
            />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <FileThumbnail file="relatorio-financeiro.pdf" sx={{ width: 56, height: 56, mx: 'auto' }} />
                  <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>PDF</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <FileThumbnail file="planilha-tesouraria.xlsx" sx={{ width: 56, height: 56, mx: 'auto' }} />
                  <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>Excel</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <FileThumbnail file="backup-dados.zip" sx={{ width: 56, height: 56, mx: 'auto' }} />
                  <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>Arquivo ZIP</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <FileThumbnail file="registro-audio.mp3" sx={{ width: 56, height: 56, mx: 'auto' }} />
                  <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>Áudio</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <FileThumbnail file="documento-texto.txt" sx={{ width: 56, height: 56, mx: 'auto' }} />
                  <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>Texto</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Bandeiras Internacionais (FlagIcon)"
              subheader="Renderização vetorial rápida por código ISO"
            />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FlagIcon code="BR" sx={{ width: 32, height: 22, borderRadius: 0.5 }} />
                  <Typography variant="body2">Brasil (BR)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FlagIcon code="US" sx={{ width: 32, height: 22, borderRadius: 0.5 }} />
                  <Typography variant="body2">Estados Unidos (US)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FlagIcon code="PT" sx={{ width: 32, height: 22, borderRadius: 0.5 }} />
                  <Typography variant="body2">Portugal (PT)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FlagIcon code="DE" sx={{ width: 32, height: 22, borderRadius: 0.5 }} />
                  <Typography variant="body2">Alemanha (DE)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FlagIcon code="JP" sx={{ width: 32, height: 22, borderRadius: 0.5 }} />
                  <Typography variant="body2">Japão (JP)</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Uploads & Dropzone"
              subheader="Upload de Avatar, Caixa Compacta (UploadBox) e Dropzone Completa (Upload)"
            />
            <CardContent>
              <Grid container spacing={4} sx={{ alignItems: 'center' }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center' }}>
                    Upload de Avatar
                  </Typography>
                  <UploadAvatar
                    helperText={
                      <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center', color: 'text.secondary' }}>
                        Clique ou arraste sua foto (PNG / JPG)
                      </Typography>
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Caixa Compacta (UploadBox)
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <UploadBox />
                    <UploadBox />
                  </Box>

                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Dropzone de Arquivo Único / Múltiplo
                  </Typography>
                  <Upload
                    multiple
                    helperText={
                      <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
                        Arraste arquivos ou clique para procurar em seu dispositivo
                      </Typography>
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* ABA 8: GRÁFICOS E MÉTRICAS */}
      {currentTab === 'charts' && (
        <Stack spacing={4}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card>
                <CardHeader
                  title="Gráfico de Tendência (Área / Linha)"
                  subheader="Desempenho histórico de operações e volume"
                />
                <CardContent>
                  <Chart
                    type="area"
                    series={[
                      { name: 'Volume Transacionado', data: [12, 18, 14, 25, 32, 28, 45, 52] },
                      { name: 'Recompensas de Staking', data: [5, 8, 7, 12, 15, 14, 20, 24] },
                    ]}
                    options={areaChartOptions}
                    sx={{ height: 320 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  title="Distribuição do Tesouro"
                  subheader="Divisão percentual por alocação"
                />
                <CardContent>
                  <Chart
                    type="donut"
                    series={[40, 25, 20, 15]}
                    options={donutChartOptions}
                    sx={{ height: 300 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Card>
                <CardHeader
                  title="Gráfico de Barras Semanais"
                  subheader="Fluxo diário de solicitações no cluster"
                />
                <CardContent>
                  <Chart
                    type="bar"
                    series={[{ name: 'Requisições', data: [450, 620, 580, 890, 710, 420, 310] }]}
                    options={barChartOptions}
                    sx={{ height: 280 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      )}

      {/* ABA 9: ALERTAS, FEEDBACK E MODAIS */}
      {currentTab === 'feedback' && (
        <Stack spacing={4}>
          <Card>
            <CardHeader title="Banners de Severidade (Alert Soft)" subheader="Feedback visual contextual" />
            <CardContent>
              <Stack spacing={2}>
                <Alert severity="info" variant={'soft' as any}>
                  <AlertTitle>Informativo</AlertTitle>
                  O ciclo de governança #42 está aberto para envio de novas propostas comunitárias.
                </Alert>
                <Alert severity="success" variant={'soft' as any}>
                  <AlertTitle>Sucesso</AlertTitle>
                  A transação multi-assinatura foi confirmada e liquidada na blockchain.
                </Alert>
                <Alert severity="warning" variant={'soft' as any}>
                  <AlertTitle>Atenção</AlertTitle>
                  O saldo de reserva da tesouraria atingiu o limite operacional mínimo recomendado.
                </Alert>
                <Alert severity="error" variant={'soft' as any}>
                  <AlertTitle>Erro Crítico</AlertTitle>
                  O nó validador secundário perdeu sincronização com a rede principal.
                </Alert>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Indicadores de Carregamento & Skeletons" subheader="Barras de progresso e simulação de loading" />
            <CardContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Barras de Progresso Linear
                  </Typography>
                  <LinearProgress variant="determinate" value={72} color="primary" sx={{ mb: 1.5, height: 8, borderRadius: 1 }} />
                  <LinearProgress color="secondary" sx={{ height: 8, borderRadius: 1 }} />
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                    Skeletons Animados (Placeholders de Carregamento)
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack spacing={1}>
                        <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '60%' }} />
                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '90%' }} />
                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '80%' }} />
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Skeleton variant="circular" width={56} height={56} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Skeleton variant="rectangular" height={24} sx={{ borderRadius: 1, mb: 1 }} />
                          <Skeleton variant="rectangular" height={16} width="50%" sx={{ borderRadius: 1 }} />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="Estado de Conteúdo Vazio (EmptyContent)" />
                <CardContent>
                  <EmptyContent
                    title="Nenhum registro ativo"
                    description="Não existem dados vinculados aos filtros aplicados neste momento."
                    action={
                      <Button variant="contained" color="primary" size="small" sx={{ mt: 2 }}>
                        Cadastrar Registro
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="Pesquisa Sem Resultados (SearchNotFound)" />
                <CardContent sx={{ pt: 4 }}>
                  <SearchNotFound query="TermoInexistenteNoBanco" />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card>
            <CardHeader title="Diálogos Interativos & Notificações Sonner" subheader="Testes de confirmação e disparo de toasts" />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>
                  Abrir Diálogo Regular
                </Button>
                <Button variant="contained" color="error" onClick={() => setConfirmOpen(true)}>
                  Abrir ConfirmDialog
                </Button>
                <Button
                  variant="soft"
                  color="success"
                  onClick={() => toast.success('Operação executada com total sucesso!')}
                >
                  Toast Sucesso
                </Button>
                <Button
                  variant="soft"
                  color="warning"
                  onClick={() => toast.warning('Aviso: Verifique os parâmetros!')}
                >
                  Toast Aviso
                </Button>
                <Button
                  variant="soft"
                  color="error"
                  onClick={() => toast.error('Erro ao conectar ao cluster remoto!')}
                >
                  Toast Erro
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* ABA 10: NAVEGAÇÃO E UTILIDADES */}
      {currentTab === 'navigation-utils' && (
        <Stack spacing={4}>
          <Card>
            <CardHeader title="Fluxo de Passos Sequenciais (Stepper)" subheader="Controle de etapas de onboarding ou formulários" />
            <CardContent>
              <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => prev - 1)}
                >
                  Voltar
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep((prev) => prev + 1)}
                >
                  Avançar
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Popovers Ancorados (CustomPopover)" subheader="Menu suspenso com setas posicionadas" />
            <CardContent>
              <Button
                variant="contained"
                color="secondary"
                endIcon={<Iconify icon={'solar:alt-arrow-down-bold' as any} />}
                onClick={(e) => setPopoverAnchor(e.currentTarget)}
              >
                Opções da Conta
              </Button>

              <CustomPopover
                open={Boolean(popoverAnchor)}
                anchorEl={popoverAnchor}
                onClose={() => setPopoverAnchor(null)}
                slotProps={{ arrow: { placement: 'top-left' } }}
              >
                <Box sx={{ p: 1.5, width: 220 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Opções Avançadas</Typography>
                  <MenuItem onClick={() => setPopoverAnchor(null)}>
                    <Iconify icon={'solar:user-bold' as any} sx={{ mr: 1 }} />
                    Perfil do Membro
                  </MenuItem>
                  <MenuItem onClick={() => setPopoverAnchor(null)}>
                    <Iconify icon={'solar:shield-check-bold' as any} sx={{ mr: 1 }} />
                    Segurança 2FA
                  </MenuItem>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem onClick={() => setPopoverAnchor(null)} sx={{ color: 'error.main' }}>
                    <Iconify icon={'solar:logout-bold' as any} sx={{ mr: 1 }} />
                    Encerrar Sessão
                  </MenuItem>
                </Box>
              </CustomPopover>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Dicas Flutuantes (Tooltips) & Contadores (Badges)" subheader="Auxiliares visuais discretos" />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                <Tooltip title="Exemplo de dica informativa superior (Tooltip)" placement="top">
                  <Button variant="outlined">Passe o mouse (Top)</Button>
                </Tooltip>
                <Tooltip title="Informação de segurança confidencial" placement="bottom">
                  <IconButton color="primary">
                    <Iconify icon={'solar:shield-keyhole-bold-duotone' as any} />
                  </IconButton>
                </Tooltip>
                <Divider orientation="vertical" flexItem />
                <Badge badgeContent={4} color="error">
                  <Iconify icon={'solar:bell-bing-bold-duotone' as any} width={32} />
                </Badge>
                <Badge badgeContent={99} color="primary">
                  <Iconify icon={'solar:inbox-bold-duotone' as any} width={32} />
                </Badge>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* DIÁLOGO REGULAR */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon={'solar:shield-warning-bold' as any} sx={{ color: 'primary.main' }} />
          Diálogo Padrão do Sistema
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Esta janela modal utiliza a estilização nativa do tema, respeitando o modo claro/escuro e os raios de curvatura estabelecidos.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Pode ser acoplado com formulários de entrada, visualizadores ou termos de consentimento da DAO.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={() => setDialogOpen(false)}>
            Fechar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setDialogOpen(false);
              toast.success('Ação do modal confirmada!');
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirmar Ação Crítica"
        content="Você tem certeza de que deseja executar esta ação? Esta operação será registrada no log de auditoria permanente."
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setConfirmOpen(false);
              toast.error('Ação confirmada e registrada no log!');
            }}
          >
            Confirmar e Prosseguir
          </Button>
        }
      />
    </DashboardContent>
  );
}
