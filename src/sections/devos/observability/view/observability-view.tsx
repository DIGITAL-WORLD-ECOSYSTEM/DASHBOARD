import { useState, useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

import { MOCK_LOGS, MOCK_TELEMETRY, type LogEntry } from '../../mock-data';

// ----------------------------------------------------------------------

export function ObservabilityView() {
  const [logFilter, setLogFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL');
  const [logSearch, setLogSearch] = useState('');

  const filteredLogs = useMemo(
    () =>
      MOCK_LOGS.filter((log) => {
        const matchesFilter = logFilter === 'ALL' || log.level === logFilter;
        const matchesSearch =
          !logSearch ||
          log.message.toLowerCase().includes(logSearch.toLowerCase()) ||
          log.service.toLowerCase().includes(logSearch.toLowerCase()) ||
          log.traceId.toLowerCase().includes(logSearch.toLowerCase());
        return matchesFilter && matchesSearch;
      }),
    [logFilter, logSearch]
  );

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'INFO':
        return '#38BDF8';
      case 'WARN':
        return '#F59E0B';
      case 'ERROR':
        return '#EF4444';
      default:
        return '#94A3B8';
    }
  };

  return (
    <Stack spacing={3}>
      {/* 1. HEADER SECTION */}
      <Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#F8FAFC' }}>
            Observabilidade & Edge Telemetry
          </Typography>
          <Chip
            label="MOCK ENGINE"
            size="small"
            sx={{
              bgcolor: 'rgba(56, 189, 248, 0.15)',
              color: '#38BDF8',
              fontWeight: 700,
              fontSize: '0.68rem',
            }}
          />
        </Stack>
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          Monitoramento em tempo real simulado de throughput (TPS), latência p50/p99, workers Cloudflare e logs estruturados do Control Plane.
        </Typography>
      </Box>

      {/* 2. TOP METRIC CARDS */}
      <Grid container spacing={2}>
        {/* Metric 1: TPS */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.5,
              bgcolor: '#0F172A',
              border: '1px solid #1E293B',
              borderRadius: 2,
            }}
          >
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  CURRENT THROUGHPUT
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#38BDF8', my: 0.5, fontFamily: 'monospace' }}>
                  {MOCK_TELEMETRY.tps} <Typography component="span" variant="body2" sx={{ color: '#94A3B8' }}>ops/s</Typography>
                </Typography>
                <Typography variant="caption" sx={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Iconify icon={'solar:arrow-up-linear' as any} width={14} /> +4.2% vs baseline
                </Typography>
              </Box>
              <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8' }}>
                <Iconify icon={'solar:bolt-bold' as any} width={22} />
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Metric 2: Latency */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.5,
              bgcolor: '#0F172A',
              border: '1px solid #1E293B',
              borderRadius: 2,
            }}
          >
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  EDGE LATENCY
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981', my: 0.5, fontFamily: 'monospace' }}>
                  {MOCK_TELEMETRY.latencyP50}ms <Typography component="span" variant="body2" sx={{ color: '#94A3B8' }}>p50</Typography>
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  p99 peak: <strong style={{ color: '#F1F5F9' }}>{MOCK_TELEMETRY.latencyP99}ms</strong>
                </Typography>
              </Box>
              <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                <Iconify icon={'solar:stopwatch-bold' as any} width={22} />
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Metric 3: Requests 24h */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.5,
              bgcolor: '#0F172A',
              border: '1px solid #1E293B',
              borderRadius: 2,
            }}
          >
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  REQUESTS (24H)
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#F8FAFC', my: 0.5, fontFamily: 'monospace' }}>
                  1.84M
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Error Rate: <strong style={{ color: '#10B981' }}>{MOCK_TELEMETRY.errorRatePct}%</strong>
                </Typography>
              </Box>
              <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(148, 163, 184, 0.1)', color: '#94A3B8' }}>
                <Iconify icon={'solar:chart-2-bold' as any} width={22} />
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Metric 4: Workers & Bandwidth */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.5,
              bgcolor: '#0F172A',
              border: '1px solid #1E293B',
              borderRadius: 2,
            }}
          >
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  ACTIVE WORKERS
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#A855F7', my: 0.5, fontFamily: 'monospace' }}>
                  {MOCK_TELEMETRY.activeWorkers} Nodes
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Storage: {MOCK_TELEMETRY.bandwidthUsedMB} MB / {MOCK_TELEMETRY.bandwidthLimitGB} GB
                </Typography>
              </Box>
              <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(168, 85, 247, 0.1)', color: '#A855F7' }}>
                <Iconify icon={'solar:server-bold' as any} width={22} />
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* 3. SERVICE HEALTH MOCK STATUS GRID */}
      <Card
        sx={{
          p: 3,
          bgcolor: '#0F172A',
          border: '1px solid #1E293B',
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 2 }}>
          Component Health Matrix (Mock Sandbox)
        </Typography>

        <Grid container spacing={2}>
          {MOCK_TELEMETRY.services.map((svc) => (
            <Grid key={svc.name} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#0B0F17',
                  border: '1px solid #1E293B',
                  borderRadius: 1.5,
                }}
              >
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#F1F5F9' }}>
                    {svc.name}
                  </Typography>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: svc.status.includes('OPERATIONAL') || svc.status.includes('READ-ONLY') ? '#10B981' : '#F59E0B',
                    }}
                  />
                </Stack>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    color: svc.status.includes('OPERATIONAL') || svc.status.includes('READ-ONLY') ? '#10B981' : '#94A3B8',
                  }}
                >
                  {svc.status}
                </Typography>
                <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    Region: {svc.region}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', fontFamily: 'monospace' }}>
                    {svc.latencyMs > 0 ? `${svc.latencyMs}ms` : 'N/A'}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* 4. STRUCTURED REAL-TIME MOCK LOG STREAM */}
      <Card
        sx={{
          p: 3,
          bgcolor: '#0F172A',
          border: '1px solid #1E293B',
          borderRadius: 2,
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', mb: 2.5 }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
              Structured Control Plane Logs (In-Memory)
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Filtro visual de logs operacionais. Zero gravação no D1 ou backend em produção.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Filter Buttons */}
            <Stack direction="row" spacing={0.5} sx={{ bgcolor: '#0B0F17', p: 0.5, borderRadius: 1 }}>
              {(['ALL', 'INFO', 'WARN', 'ERROR'] as const).map((lvl) => (
                <Button
                  key={lvl}
                  size="small"
                  onClick={() => setLogFilter(lvl)}
                  sx={{
                    px: 1.5,
                    py: 0.4,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    borderRadius: 0.8,
                    color: logFilter === lvl ? '#F8FAFC' : '#64748B',
                    bgcolor: logFilter === lvl ? '#1E293B' : 'transparent',
                    textTransform: 'none',
                    minWidth: 48,
                  }}
                >
                  {lvl}
                </Button>
              ))}
            </Stack>

            {/* Search Input */}
            <TextField
              size="small"
              placeholder="Filtrar por mensagem, traceId ou serviço..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              sx={{
                width: { xs: '100%', sm: 280 },
                '& .MuiInputBase-root': {
                  bgcolor: '#0B0F17',
                  color: '#F1F5F9',
                  fontSize: '0.8rem',
                  height: 34,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon={'solar:magnifer-linear' as any} width={16} sx={{ color: '#64748B' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>
        </Stack>

        {/* Log Lines Container */}
        <Box
          sx={{
            bgcolor: '#0B0F17',
            border: '1px solid #1E293B',
            borderRadius: 1.5,
            p: 2,
            fontFamily: 'monospace',
            maxHeight: 420,
            overflowY: 'auto',
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#1E293B', borderRadius: 3 },
          }}
        >
          {filteredLogs.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#64748B', textAlign: 'center', py: 4 }}>
              Nenhum evento registrado para o filtro selecionado.
            </Typography>
          ) : (
            <Stack spacing={1}>
              {filteredLogs.map((log) => (
                <Box
                  key={log.id}
                  sx={{
                    p: 1.2,
                    borderRadius: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                    borderLeft: `3px solid ${getLevelColor(log.level)}`,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'space-between',
                    gap: 1,
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.04)' },
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography variant="caption" sx={{ color: '#64748B', minWidth: 140 }}>
                      {log.timestamp}
                    </Typography>

                    <Chip
                      label={log.level}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        bgcolor: `${getLevelColor(log.level)}20`,
                        color: getLevelColor(log.level),
                        border: `1px solid ${getLevelColor(log.level)}40`,
                      }}
                    />

                    <Typography variant="caption" sx={{ color: '#A855F7', fontWeight: 700 }}>
                      [{log.service}]
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#E2E8F0', fontSize: '0.82rem' }}>
                      {log.message}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    {log.latencyMs && (
                      <Typography variant="caption" sx={{ color: '#10B981' }}>
                        {log.latencyMs}ms
                      </Typography>
                    )}
                    <Typography variant="caption" sx={{ color: '#475569' }}>
                      {log.traceId}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Card>
    </Stack>
  );
}
