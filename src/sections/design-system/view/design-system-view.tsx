import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AlertTitle from '@mui/material/AlertTitle';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import AvatarGroup from '@mui/material/AvatarGroup';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { themeConfig } from 'src/theme/theme-config';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CyberCard } from 'src/components/cyber-card';
import { CyberButton } from 'src/components/cyber-button';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

type TabValue = 'colors' | 'buttons' | 'inputs' | 'cards' | 'data' | 'feedback';

export function DesignSystemView() {
  const [currentTab, setCurrentTab] = useState<TabValue>('colors');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [ratingVal, setRatingVal] = useState<number | null>(4);
  const [sliderVal, setSliderVal] = useState<number>(65);
  const [switchVal, setSwitchVal] = useState(true);

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Catálogo do Design System & Componentes"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Design System', href: paths.dashboard.designSystem },
          { name: 'Catálogo Visual' },
        ]}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon={'solar:refresh-bold' as any} />}
            onClick={() => toast.info('Tema e tokens sincronizados em tempo real!')}
          >
            Sincronizar Tokens
          </Button>
        }
        sx={{ mb: { xs: 2, md: 3 } }}
      />

      {/* BANNER INFORMATIVO */}
      <Alert severity="info" variant={'soft' as any} sx={{ mb: 3 }}>
        <AlertTitle sx={{ fontWeight: 800 }}>Ambiente de Validação & Homologação de Padrões Visuais</AlertTitle>
        Esta página reúne todos os componentes, estados, variantes e tokens tipográficos do WebApp.
        Utilize a engrenagem lateral para alternar entre <strong>Modo Claro</strong> e <strong>Modo Escuro</strong> e testar a resposta das superfícies.
      </Alert>

      {/* ABAS DO CATÁLOGO */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(_, val) => setCurrentTab(val)}
          sx={{
            px: 2,
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': { minHeight: 48, fontWeight: 700 },
          }}
        >
          <Tab
            value="colors"
            icon={<Iconify icon={'solar:palette-bold' as any} width={20} />}
            iconPosition="start"
            label="1. Cores & Tipografia"
          />
          <Tab
            value="buttons"
            icon={<Iconify icon={'solar:cursor-bold' as any} width={20} />}
            iconPosition="start"
            label="2. Botões & Ações"
          />
          <Tab
            value="inputs"
            icon={<Iconify icon={'solar:pen-2-bold' as any} width={20} />}
            iconPosition="start"
            label="3. Formulários & Entradas"
          />
          <Tab
            value="cards"
            icon={<Iconify icon={'solar:widget-2-bold' as any} width={20} />}
            iconPosition="start"
            label="4. Cards & Superfícies"
          />
          <Tab
            value="data"
            icon={<Iconify icon={'solar:database-bold' as any} width={20} />}
            iconPosition="start"
            label="5. Tabelas & Badges"
          />
          <Tab
            value="feedback"
            icon={<Iconify icon={'solar:bell-bold' as any} width={20} />}
            iconPosition="start"
            label="6. Alertas & Feedback"
          />
        </Tabs>
      </Card>

      {/* ABA 1: CORES E TIPOGRAFIA */}
      {currentTab === 'colors' && (
        <Stack spacing={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>
              Paleta Cromática Institucional (Tokens Ativos)
            </Typography>
            <Grid container spacing={2}>
              {[
                { name: 'Primary (Verde Esmeralda)', main: themeConfig.palette.primary.main, lighter: themeConfig.palette.primary.lighter, dark: themeConfig.palette.primary.dark },
                { name: 'Secondary (Roxo)', main: themeConfig.palette.secondary.main, lighter: themeConfig.palette.secondary.lighter, dark: themeConfig.palette.secondary.dark },
                { name: 'Info (Ciano)', main: themeConfig.palette.info.main, lighter: themeConfig.palette.info.lighter, dark: themeConfig.palette.info.dark },
                { name: 'Success (Verde Sucesso)', main: themeConfig.palette.success.main, lighter: themeConfig.palette.success.lighter, dark: themeConfig.palette.success.dark },
                { name: 'Warning (Âmbar)', main: themeConfig.palette.warning.main, lighter: themeConfig.palette.warning.lighter, dark: themeConfig.palette.warning.dark },
                { name: 'Error (Coral)', main: themeConfig.palette.error.main, lighter: themeConfig.palette.error.lighter, dark: themeConfig.palette.error.dark },
              ].map((c) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={c.name}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
                      {c.name}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: c.lighter, border: '1px solid rgba(0,0,0,0.08)' }} />
                      <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: c.main, boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} />
                      <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: c.dark }} />
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      Main: <strong>{c.main}</strong>
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>
              Hierarquia Tipográfica (Escalas Responsivas)
            </Typography>
            <Stack spacing={2} divider={<Divider />}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>h1 (Barlow 800 ExtraBold)</Typography>
                <Typography variant="h1">Título Institucional H1</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>h2 (Barlow 800 ExtraBold)</Typography>
                <Typography variant="h2">Subtítulo Principal H2</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>h3 (Barlow 700 Bold)</Typography>
                <Typography variant="h3">Cabeçalho de Seção H3</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>h4 (Public Sans 700 Bold)</Typography>
                <Typography variant="h4">Bloco de Módulo H4</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>h5 (Public Sans 700 Bold)</Typography>
                <Typography variant="h5">Título de Card H5</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>body1 e body2 (Public Sans 400 Regular)</Typography>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  <strong>Body 1:</strong> Texto corrido encorpado utilizado em descrições e formulários institucionais da organização.
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <strong>Body 2:</strong> Texto secundário utilizado para legendas, metadados e observações complementares.
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Orbitron (Fonte Especial Tecnológica)</Typography>
                <Typography sx={{ fontFamily: 'var(--font-orbitron), sans-serif', fontWeight: 800, letterSpacing: 1.5, fontSize: '1.25rem', color: 'primary.main' }}>
                  DAO IDENTITY · SECURE PROTOCOL · ASPPIBRA
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Stack>
      )}

      {/* ABA 2: BOTÕES E AÇÕES */}
      {currentTab === 'buttons' && (
        <Stack spacing={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>
              Variantes de Botões (MuiButton)
            </Typography>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>1. Contained (Sólidos com Sombra Ativa)</Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  <Button variant="contained" color="primary">Primary</Button>
                  <Button variant="contained" color="secondary">Secondary</Button>
                  <Button variant="contained" color="info">Info</Button>
                  <Button variant="contained" color="success">Success</Button>
                  <Button variant="contained" color="warning">Warning</Button>
                  <Button variant="contained" color="error">Error</Button>
                  <Button variant="contained" disabled>Disabled</Button>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>2. Soft (Variante Exclusiva com Transparência Suave)</Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  <Button variant="soft" color="primary">Primary</Button>
                  <Button variant="soft" color="secondary">Secondary</Button>
                  <Button variant="soft" color="info">Info</Button>
                  <Button variant="soft" color="success">Success</Button>
                  <Button variant="soft" color="warning">Warning</Button>
                  <Button variant="soft" color="error">Error</Button>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>3. Outlined (Bordas Finas)</Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  <Button variant="outlined" color="primary">Primary</Button>
                  <Button variant="outlined" color="secondary">Secondary</Button>
                  <Button variant="outlined" color="info">Info</Button>
                  <Button variant="outlined" color="success">Success</Button>
                  <Button variant="outlined" color="error">Error</Button>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>4. Tamanhos Padronizados (small, medium, large, xLarge)</Typography>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Button variant="contained" size="small" color="primary">Small (30px)</Button>
                  <Button variant="contained" size="medium" color="primary">Medium (36px)</Button>
                  <Button variant="contained" size="large" color="primary">Large (48px)</Button>
                  <Button variant="contained" size="xLarge" color="primary">xLarge (56px)</Button>
                </Box>
              </Box>
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>
              Botões de Ícone & Componentes Especiais
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>IconButton</Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton color="primary"><Iconify icon={'solar:heart-bold' as any} /></IconButton>
                  <IconButton color="secondary"><Iconify icon={'solar:share-bold' as any} /></IconButton>
                  <IconButton color="info"><Iconify icon={'solar:bell-bold' as any} /></IconButton>
                  <IconButton color="error"><Iconify icon={'solar:trash-bin-trash-bold' as any} /></IconButton>
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>CyberButton (DAO Neon Protocol)</Typography>
                <Stack direction="row" spacing={1.5}>
                  <CyberButton glowColor="primary">Confirmar Assinatura</CyberButton>
                  <CyberButton glowColor="info">Consultar Smart Contract</CyberButton>
                </Stack>
              </Box>
            </Box>
          </Card>
        </Stack>
      )}

      {/* ABA 3: FORMULÁRIOS E ENTRADAS */}
      {currentTab === 'inputs' && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 800 }}>
            Campos de Entrada & Controles de Formulário
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Nome Completo"
                placeholder="Ex: João da Silva"
                helperText="Campo de texto padrão"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Valor do Lançamento"
                defaultValue="1500.00"
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  },
                }}
                helperText="Input com Adornment de moeda"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                error
                label="CPF do Membro"
                defaultValue="123.456.789"
                helperText="CPF inválido ou não formatado"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                select
                label="Categoria do Associado"
                defaultValue="efetivo"
                slotProps={{
                  select: { native: true },
                }}
              >
                <option value="efetivo">Membro Efetivo</option>
                <option value="honorario">Membro Honorário</option>
                <option value="fundador">Membro Fundador</option>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Controles de Alternância (Switches & Checkbox)</Typography>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <FormControlLabel
                  control={<Switch checked={switchVal} onChange={(e) => setSwitchVal(e.target.checked)} />}
                  label="Notificações"
                />
                <FormControlLabel control={<Checkbox defaultChecked />} label="Termo Aceito" />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Avaliação & Slider</Typography>
              <Rating value={ratingVal} onChange={(_, val) => setRatingVal(val)} sx={{ mb: 1.5 }} />
              <Slider value={sliderVal} onChange={(_, val) => setSliderVal(val as number)} valueLabelDisplay="auto" />
            </Grid>
          </Grid>
        </Card>
      )}

      {/* ABA 4: CARDS E SUPERFÍCIES */}
      {currentTab === 'cards' && (
        <Stack spacing={4}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardHeader
                  avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>DAO</Avatar>}
                  action={
                    <IconButton><Iconify icon={'solar:menu-dots-bold' as any} /></IconButton>
                  }
                  title="Card Esculpido 3D (MuiCard Padrão)"
                  subheader="Bordas de 20px, Relevo Táctil e Blur de 16px"
                />
                <CardContent>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    Este é o card institucional que hospeda relatórios, gráficos e painéis de dados.
                    No modo claro, possui sombras em relevo esculpido. No modo escuro, converte-se no padrão Obsidian Glass.
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip label="PRODUÇÃO" size="small" color="primary" variant="soft" />
                    <Chip label="AUTENTICADO" size="small" color="success" variant="soft" />
                  </Stack>
                </CardContent>
                <CardActions sx={{ px: 3, pb: 2 }}>
                  <Button size="small" color="primary" variant="contained">Acessar Detalhes</Button>
                  <Button size="small" color="inherit">Exportar</Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <CyberCard variant="hero" color="primary" glow>
                <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800 }}>
                  PROTOCOLO CRIPTOGRÁFICO DE CUSTÓDIA
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, mb: 1.5 }}>
                  Certificado de Chave de Notarização
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
                  Componente de alta fidelidade visual com acento neon, bordas de acrílico translúcido e regras automáticas de impressão A4.
                </Typography>
                <CyberButton glowColor="primary">Validar Integridade da Cadeia</CyberButton>
              </CyberCard>
            </Grid>
          </Grid>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>
              Acordeões Sanfonados (MuiAccordion)
            </Typography>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<Iconify icon={'solar:alt-arrow-down-bold' as any} />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>1. Como funciona a custódia das chaves?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  As credenciais e hashes são preservadas no cofre local criptografado em Argon2id e ChaCha20-Poly1305.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<Iconify icon={'solar:alt-arrow-down-bold' as any} />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>2. Quais são as taxas da rede?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  As taxas de processamento são custeadas pelo caixa operacional da DAO de acordo com a política institucional.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Card>
        </Stack>
      )}

      {/* ABA 5: TABELAS E BADGES */}
      {currentTab === 'data' && (
        <Stack spacing={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>
              Badges Semânticos (Label Component)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
              <Label color="default" variant="soft">Padrão</Label>
              <Label color="primary" variant="soft">Primary</Label>
              <Label color="secondary" variant="soft">Secondary</Label>
              <Label color="info" variant="soft">Info</Label>
              <Label color="success" variant="soft">Ativo / Concluído</Label>
              <Label color="warning" variant="soft">Pendente</Label>
              <Label color="error" variant="soft">Bloqueado / Falha</Label>
            </Box>

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>
              Avatares e Agrupamentos (MuiAvatar)
            </Typography>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>AD</Avatar>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>SC</Avatar>
              <Avatar sx={{ bgcolor: 'info.main' }}>JP</Avatar>
              <AvatarGroup max={4}>
                <Avatar sx={{ bgcolor: 'primary.light' }}>A</Avatar>
                <Avatar sx={{ bgcolor: 'secondary.light' }}>B</Avatar>
                <Avatar sx={{ bgcolor: 'warning.light' }}>C</Avatar>
                <Avatar sx={{ bgcolor: 'error.light' }}>D</Avatar>
                <Avatar sx={{ bgcolor: 'grey.500' }}>E</Avatar>
              </AvatarGroup>
            </Stack>
          </Card>

          <Card>
            <CardHeader title="Tabela de Dados Padrão (MuiTable)" subheader="Cabeçalhos neutros com linhas pontilhadas" />
            <TableContainer sx={{ mt: 1 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Identificador</TableCell>
                    <TableCell>Membro / Associado</TableCell>
                    <TableCell>Data de Registro</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Ação</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { id: 'TX-9021', name: 'Sandro Silveira', date: '14/10/2026', value: 'R$ 12.450,00', status: 'Concluído', color: 'success' },
                    { id: 'TX-9022', name: 'Associação Beneficente', date: '13/10/2026', value: 'R$ 4.200,00', status: 'Em Análise', color: 'warning' },
                    { id: 'TX-9023', name: 'Cooperativa Nacional', date: '12/10/2026', value: 'R$ 28.900,00', status: 'Concluído', color: 'success' },
                    { id: 'TX-9024', name: 'Carlos Eduardo Mendes', date: '11/10/2026', value: 'R$ 850,00', status: 'Cancelado', color: 'error' },
                  ].map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{row.value}</TableCell>
                      <TableCell>
                        <Label color={row.color as any} variant="soft">{row.status}</Label>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small"><Iconify icon={'solar:eye-bold' as any} /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Stack>
      )}

      {/* ABA 6: ALERTAS E FEEDBACK */}
      {currentTab === 'feedback' && (
        <Stack spacing={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 800 }}>
              Caixas de Aviso e Alertas (MuiAlert)
            </Typography>
            <Stack spacing={2}>
              <Alert severity="success" variant={'soft' as any}>
                <AlertTitle>Operação Concluída com Êxito</AlertTitle>
                A transação foi confirmada e protocolada no livro-razão institucional.
              </Alert>
              <Alert severity="info" variant={'soft' as any}>
                <AlertTitle>Atualização da Versão WebApp</AlertTitle>
                Uma nova versão do sistema está disponível para homologação dos membros.
              </Alert>
              <Alert severity="warning" variant={'soft' as any}>
                <AlertTitle>Atenção aos Prazos de Vencimento</AlertTitle>
                Existem 3 contratos aguardando quitação nesta semana.
              </Alert>
              <Alert severity="error" variant={'soft' as any}>
                <AlertTitle>Falha de Autenticação Biométrica</AlertTitle>
                Chave não reconhecida pelo leitor de segurança.
              </Alert>
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 800 }}>
              Indicadores de Carregamento & Notificações Interativas
            </Typography>
            <Grid container spacing={3} sx={{ alignItems: 'center' }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Barras de Progresso</Typography>
                <LinearProgress color="primary" sx={{ mb: 2, height: 8, borderRadius: 1 }} />
                <LinearProgress color="secondary" sx={{ mb: 2, height: 8, borderRadius: 1 }} />
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <CircularProgress size={32} color="primary" />
                  <CircularProgress size={32} color="secondary" />
                  <CircularProgress size={32} color="info" />
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Disparar Notificações (Toast Feedback)</Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  <Button variant="soft" color="success" onClick={() => toast.success('Sucesso: Operação efetuada!')}>
                    Toast Sucesso
                  </Button>
                  <Button variant="soft" color="error" onClick={() => toast.error('Erro: Não foi possível gravar.')}>
                    Toast Erro
                  </Button>
                  <Button variant="soft" color="warning" onClick={() => toast.warning('Aviso: Saldo próximo do limite.')}>
                    Toast Aviso
                  </Button>
                  <Button variant="outlined" color="primary" onClick={() => setConfirmOpen(true)}>
                    Abrir Modal Diálogo
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Card>

          {/* MODAL DIALOG DEMO */}
          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 800 }}>Confirmar Aprovação do Padrão?</DialogTitle>
            <DialogContent>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Ao confirmar, este padrão de tema e componentes servirá de base para a entrega final da versão dos usuários simples.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button color="inherit" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setConfirmOpen(false);
                  toast.success('Padrão homologado com sucesso!');
                }}
              >
                Confirmar Aprovação
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
      )}
    </DashboardContent>
  );
}
