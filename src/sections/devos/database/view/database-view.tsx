import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { Iconify } from 'src/components/iconify';

import {
  MOCK_D1_TABLES,
  MOCK_D1_METRICS,
  MOCK_D1_MIGRATIONS,
  type D1TableMeta,
} from '../../mock-data';

// ----------------------------------------------------------------------

export function DatabaseView() {
  const [currentTab, setCurrentTab] = useState<'tables' | 'migrations'>('tables');
  const [selectedTable, setSelectedTable] = useState<D1TableMeta>(MOCK_D1_TABLES[0]);

  return (
    <Stack spacing={3}>
      {/* 1. HEADER */}
      <Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#F8FAFC' }}>
            Cloudflare D1 Database Studio
          </Typography>
          <Chip
            label="READ ONLY + MOCK"
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
          Inspeção determinística de metadados de tabelas e histórico de migrations. Nenhuma chamada SQL ou escrita direta no banco (INV-001).
        </Typography>
      </Box>

      {/* 2. D1 METRICS HERO CARD */}
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
          spacing={3}
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          {/* Health Score */}
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 2,
                bgcolor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10B981',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                100
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                D1 Engine Health
              </Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>
                {MOCK_D1_METRICS.status}
              </Typography>
            </Box>
          </Stack>

          {/* Storage & Ops */}
          <Stack direction="row" spacing={4} sx={{ flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                STORAGE ALLOCATION
              </Typography>
              <Typography variant="h6" sx={{ color: '#F1F5F9', fontWeight: 700, fontFamily: 'monospace' }}>
                {MOCK_D1_METRICS.sizeMB} MB <Typography component="span" variant="caption" sx={{ color: '#64748B' }}>/ 10 GB</Typography>
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                READS (24H)
              </Typography>
              <Typography variant="h6" sx={{ color: '#F1F5F9', fontWeight: 700, fontFamily: 'monospace' }}>
                {MOCK_D1_METRICS.reads24h}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                WRITES (24H)
              </Typography>
              <Typography variant="h6" sx={{ color: '#F1F5F9', fontWeight: 700, fontFamily: 'monospace' }}>
                {MOCK_D1_METRICS.writes24h}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                QUERY LATENCY
              </Typography>
              <Typography variant="h6" sx={{ color: '#10B981', fontWeight: 700, fontFamily: 'monospace' }}>
                {MOCK_D1_METRICS.latencyMs}ms
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Card>

      {/* 3. SUB-NAVIGATION TABS */}
      <Tabs
        value={currentTab}
        onChange={(_, val) => setCurrentTab(val)}
        sx={{
          bgcolor: '#0F172A',
          p: 0.5,
          borderRadius: 1.5,
          border: '1px solid #1E293B',
          minHeight: 44,
          '& .MuiTab-root': {
            minHeight: 36,
            py: 0.8,
            px: 2,
            color: '#94A3B8',
            fontSize: '0.82rem',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 1,
            '&.Mui-selected': {
              color: '#38BDF8',
              bgcolor: 'rgba(56, 189, 248, 0.12)',
            },
          },
          '& .MuiTabs-indicator': { display: 'none' },
        }}
      >
        <Tab
          value="tables"
          label={
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Iconify icon={'solar:database-bold' as any} width={16} />
              <span>Tabelas & Schema Explorer</span>
            </Stack>
          }
        />
        <Tab
          value="migrations"
          label={
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Iconify icon={'solar:history-bold' as any} width={16} />
              <span>Timeline de Migrations ({MOCK_D1_MIGRATIONS.length})</span>
            </Stack>
          }
        />
      </Tabs>

      {/* 4. TAB CONTENT 1: TABLES & SCHEMA EXPLORER */}
      {currentTab === 'tables' && (
        <Card
          sx={{
            bgcolor: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '280px 1fr' }, minHeight: 600 }}>
            {/* Left Sidebar: Tables List */}
            <Box
              sx={{
                p: 2,
                borderRight: { xs: 'none', md: '1px solid #1E293B' },
                borderBottom: { xs: '1px solid #1E293B', md: 'none' },
                bgcolor: '#0B0F17',
              }}
            >
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, mb: 1.5, display: 'block' }}>
                SCHEMAS DETECTADOS ({MOCK_D1_TABLES.length})
              </Typography>

              <Stack spacing={1}>
                {MOCK_D1_TABLES.map((t) => {
                  const isSelected = selectedTable.name === t.name;
                  return (
                    <Box
                      key={t.name}
                      onClick={() => setSelectedTable(t)}
                      sx={{
                        p: 1.5,
                        borderRadius: 1.5,
                        cursor: 'pointer',
                        bgcolor: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                        border: '1px solid',
                        borderColor: isSelected ? 'rgba(56, 189, 248, 0.4)' : 'transparent',
                        transition: 'all 0.15s ease',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.04)' },
                      }}
                    >
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <Iconify
                            icon={'solar:database-outline' as any}
                            width={16}
                            sx={{ color: isSelected ? '#38BDF8' : '#64748B' }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: isSelected ? 700 : 500,
                              color: isSelected ? '#38BDF8' : '#F1F5F9',
                              fontFamily: 'monospace',
                            }}
                          >
                            {t.name}
                          </Typography>
                        </Stack>
                        <Chip
                          label={`${t.rows} rows`}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.62rem',
                            bgcolor: '#1E293B',
                            color: '#94A3B8',
                          }}
                        />
                      </Stack>
                    </Box>
                  );
                })}
              </Stack>
            </Box>

            {/* Right Main: Schema & Sample Data */}
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#F8FAFC', fontFamily: 'monospace' }}>
                    TABLE: {selectedTable.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    Total Estimated Size: {selectedTable.sizeKB} KB • Rows: {selectedTable.rows}
                  </Typography>
                </Box>
                <Chip
                  label="READ-ONLY DATA SAMPLE"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    color: '#10B981',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    fontWeight: 700,
                    fontSize: '0.65rem',
                  }}
                />
              </Stack>

              {/* Schema Definition */}
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, mb: 1 }}>
                COLUMN DEFINITIONS
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  bgcolor: '#0B0F17',
                  border: '1px solid #1E293B',
                  borderRadius: 1.5,
                  mb: 3,
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
                      <TableCell sx={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.72rem' }}>COLUMN</TableCell>
                      <TableCell sx={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.72rem' }}>TYPE</TableCell>
                      <TableCell sx={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.72rem' }}>PRIMARY KEY</TableCell>
                      <TableCell sx={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.72rem' }}>NOT NULL</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedTable.columns.map((col) => (
                      <TableRow key={col.name} sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell sx={{ color: '#38BDF8', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                          {col.name}
                        </TableCell>
                        <TableCell sx={{ color: '#F1F5F9', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                          {col.type}
                        </TableCell>
                        <TableCell sx={{ color: col.primaryKey ? '#F59E0B' : '#64748B', fontSize: '0.75rem' }}>
                          {col.primaryKey ? 'PRIMARY KEY' : '—'}
                        </TableCell>
                        <TableCell sx={{ color: col.notNull ? '#10B981' : '#64748B', fontSize: '0.75rem' }}>
                          {col.notNull ? 'TRUE' : 'FALSE'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Sample Records */}
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, mb: 1 }}>
                DETERMINISTIC DATA PREVIEW (IN-MEMORY MOCK)
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  bgcolor: '#0B0F17',
                  border: '1px solid #1E293B',
                  borderRadius: 1.5,
                  flexGrow: 1,
                  overflowX: 'auto',
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
                      {selectedTable.columns.map((c) => (
                        <TableCell key={c.name} sx={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.72rem' }}>
                          {c.name}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedTable.sampleData.map((row, idx) => (
                      <TableRow key={idx} sx={{ '&:last-child td': { border: 0 } }}>
                        {selectedTable.columns.map((c) => (
                          <TableCell
                            key={c.name}
                            sx={{ color: '#E2E8F0', fontFamily: 'monospace', fontSize: '0.78rem' }}
                          >
                            {String(row[c.name] ?? 'null')}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Card>
      )}

      {/* 5. TAB CONTENT 2: MIGRATIONS TIMELINE */}
      {currentTab === 'migrations' && (
        <Card
          sx={{
            p: 3,
            bgcolor: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 2 }}>
            Applied Migrations History (SHA-256 Verified)
          </Typography>

          <Stack spacing={2}>
            {MOCK_D1_MIGRATIONS.map((mig) => (
              <Box
                key={mig.id}
                sx={{
                  p: 2,
                  bgcolor: '#0B0F17',
                  border: '1px solid #1E293B',
                  borderRadius: 1.5,
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'flex-start', md: 'center' },
                  justifyContent: 'space-between',
                  gap: 1.5,
                }}
              >
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1,
                      bgcolor: 'rgba(16, 185, 129, 0.1)',
                      color: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify icon={'solar:check-circle-bold' as any} width={20} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#F1F5F9', fontFamily: 'monospace' }}>
                      {mig.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', fontFamily: 'monospace' }}>
                      Checksum: {mig.checksumSha256}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                      APPLIED AT
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontFamily: 'monospace' }}>
                      {mig.appliedAt}
                    </Typography>
                  </Box>

                  <Chip
                    label="APPLIED"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(16, 185, 129, 0.15)',
                      color: '#10B981',
                      fontWeight: 800,
                      fontSize: '0.65rem',
                      height: 22,
                    }}
                  />
                </Stack>
              </Box>
            ))}
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
