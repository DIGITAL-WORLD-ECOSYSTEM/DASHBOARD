import { useState, useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

import { MOCK_AUDIT_TRAIL, type AuditEventItem } from '../../mock-data';

// ----------------------------------------------------------------------

export function AuditView() {
  const [filterResult, setFilterResult] = useState<'ALL' | 'ALLOWED' | 'FLAGGED' | 'DENIED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(
    () =>
      MOCK_AUDIT_TRAIL.filter((evt) => {
        const matchesFilter = filterResult === 'ALL' || evt.result === filterResult;
        const matchesSearch =
          !searchQuery ||
          evt.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          evt.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          evt.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
          evt.details.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      }),
    [filterResult, searchQuery]
  );

  const getResultColor = (res: AuditEventItem['result']) => {
    switch (res) {
      case 'ALLOWED':
        return '#10B981';
      case 'FLAGGED':
        return '#F59E0B';
      case 'DENIED':
        return '#EF4444';
      default:
        return '#94A3B8';
    }
  };

  return (
    <Stack spacing={3}>
      {/* 1. HEADER */}
      <Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#F8FAFC' }}>
            Append-Only Audit Trail
          </Typography>
          <Chip
            label="READ ONLY LOGS"
            size="small"
            sx={{
              bgcolor: 'rgba(16, 185, 129, 0.15)',
              color: '#10B981',
              fontWeight: 700,
              fontSize: '0.68rem',
            }}
          />
        </Stack>
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          Trilha determinística de auditoria de operações privilegiadas do Control Plane. Emulada em memória (zero persistência D1 nesta etapa - INV-012).
        </Typography>
      </Box>

      {/* 2. FILTER & SEARCH CONTROLS */}
      <Card
        sx={{
          p: 2.5,
          bgcolor: '#0F172A',
          border: '1px solid #1E293B',
          borderRadius: 2,
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between' }}
        >
          {/* Results Filter Buttons */}
          <Stack direction="row" spacing={1} sx={{ bgcolor: '#0B0F17', p: 0.5, borderRadius: 1.5 }}>
            {(['ALL', 'ALLOWED', 'FLAGGED', 'DENIED'] as const).map((res) => (
              <Button
                key={res}
                size="small"
                onClick={() => setFilterResult(res)}
                sx={{
                  px: 2,
                  py: 0.5,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderRadius: 1,
                  color: filterResult === res ? '#F8FAFC' : '#64748B',
                  bgcolor: filterResult === res ? '#1E293B' : 'transparent',
                  textTransform: 'none',
                }}
              >
                {res}
              </Button>
            ))}
          </Stack>

          {/* Search Box */}
          <TextField
            size="small"
            placeholder="Pesquisar por evento, ator, recurso..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: { xs: '100%', md: 340 },
              '& .MuiInputBase-root': {
                bgcolor: '#0B0F17',
                color: '#F1F5F9',
                fontSize: '0.8rem',
                height: 36,
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
      </Card>

      {/* 3. AUDIT EVENTS STREAM */}
      <Stack spacing={1.5}>
        {filteredEvents.map((evt) => (
          <Card
            key={evt.id}
            sx={{
              p: 2.5,
              bgcolor: '#0F172A',
              border: '1px solid #1E293B',
              borderLeft: `4px solid ${getResultColor(evt.result)}`,
              borderRadius: 1.5,
              transition: 'all 0.15s ease',
              '&:hover': { bgcolor: '#111C35' },
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              sx={{ alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between' }}
            >
              {/* Event Type & Actor */}
              <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5, flexWrap: 'wrap' }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#F1F5F9', fontFamily: 'monospace' }}>
                    {evt.eventType}
                  </Typography>

                  <Chip
                    label={evt.result}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      bgcolor: `${getResultColor(evt.result)}20`,
                      color: getResultColor(evt.result),
                      border: `1px solid ${getResultColor(evt.result)}40`,
                    }}
                  />

                  <Chip
                    label={evt.signatureVerified ? 'SIG_VALID (MOCK)' : 'SIG_UNVERIFIED'}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.62rem',
                      fontFamily: 'monospace',
                      bgcolor: evt.signatureVerified ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: evt.signatureVerified ? '#10B981' : '#EF4444',
                    }}
                  />
                </Stack>

                <Typography variant="caption" sx={{ color: '#38BDF8', fontFamily: 'monospace', display: 'block' }}>
                  Actor: {evt.actor} • Resource: {evt.resource}
                </Typography>

                <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem', mt: 0.5 }}>
                  {evt.details}
                </Typography>
              </Box>

              {/* Timestamp & Event ID */}
              <Box sx={{ textAlign: { xs: 'left', md: 'right' }, minWidth: 160 }}>
                <Typography variant="caption" sx={{ color: '#F1F5F9', fontFamily: 'monospace', display: 'block', fontWeight: 600 }}>
                  {evt.timestamp}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontFamily: 'monospace' }}>
                  ID: {evt.id}
                </Typography>
              </Box>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
