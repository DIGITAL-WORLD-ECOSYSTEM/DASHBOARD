import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { MOCK_SAFE_ASSETS, MOCK_SAFE_SIGNERS } from '../../mock-data';
import { LiquidityPoolsCard, NativeTokenMonitorCard } from '../components';

// ----------------------------------------------------------------------

const USD_TO_BRL_RATE = 5.5;

const ASSET_COLORS: Record<string, string> = {
  BTC: '#F7931A',
  ASPPBR: '#00A76F',
  USDT: '#0284C7',
  BRL: '#10B981',
};

export function TreasuryView() {
  // Cálculos consolidados da Tesouraria ASPPIBRA
  const totalUsdValuation = MOCK_SAFE_ASSETS.reduce((acc, curr) => acc + curr.valueUsd, 0);
  const totalBrlValuation = totalUsdValuation * USD_TO_BRL_RATE;

  const assetDistributions = MOCK_SAFE_ASSETS.map((asset) => {
    const percent = totalUsdValuation > 0 ? (asset.valueUsd / totalUsdValuation) * 100 : 0;
    return {
      ...asset,
      percent: Number(percent.toFixed(1)),
      color: ASSET_COLORS[asset.symbol] || '#64748B',
    };
  });

  return (
    <Stack spacing={2.5}>
      {/* 1. MONITORAMENTO DO TOKEN NATIVO ASPPBR (PRICE & VOLUME CHART) */}
      <NativeTokenMonitorCard />

      {/* 2. VALORAÇÃO TOTAL CONSOLIDADA E ALOCAÇÃO DE RESERVAS (SLIM & THEME-AWARE) */}
      <Card
        sx={{
          p: 2.5,
          bgcolor: 'background.paper',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        {/* TOP ROW: VALORAÇÃO EM DESTAQUE */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2 }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}
            >
              Valoração Total Consolidada
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'baseline', mt: 0.25, flexWrap: 'wrap' }}>
              <Typography
                variant="h4"
                sx={{ color: 'success.main', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '-0.5px' }}
              >
                ${totalUsdValuation.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                <Typography component="span" variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  USD
                </Typography>
              </Typography>
              <Typography variant="subtitle1" sx={{ color: 'info.main', fontWeight: 700, fontFamily: 'monospace' }}>
                ≈ R$ {totalBrlValuation.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}{' '}
                <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                  BRL
                </Typography>
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 0.25 }}>
              Reserva Multi-Ativo Conciliada (Câmbio Base PTAX / D1)
            </Typography>
          </Box>

          <Chip
            label="100% Auditada em Partidas Dobradas"
            size="small"
            color="success"
            variant="soft"
            icon={<Iconify icon={'solar:shield-check-bold' as any} width={15} />}
            sx={{ fontWeight: 700, fontSize: '0.72rem' }}
          />
        </Stack>

        {/* DIVIDER */}
        <Divider sx={{ mb: 2, borderColor: 'divider' }} />

        {/* BOTTOM ROW: COMPOSIÇÃO PERCENTUAL SLIM */}
        <Box>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}
            >
              Composição Percentual da Reserva
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace' }}>
              4 Ativos em Custódia
            </Typography>
          </Stack>

          {/* Barra Visual Segmentada Slim */}
          <Box
            sx={{
              display: 'flex',
              height: 8,
              borderRadius: 1,
              overflow: 'hidden',
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16),
              mb: 1.25,
            }}
          >
            {assetDistributions.map((asset) => (
              <Tooltip
                key={asset.symbol}
                title={`${asset.name} (${asset.symbol}): ${asset.percent}% • $${asset.valueUsd.toLocaleString()} USD`}
              >
                <Box
                  sx={{
                    width: `${asset.percent}%`,
                    bgcolor: asset.color,
                    transition: 'width 0.3s ease',
                  }}
                />
              </Tooltip>
            ))}
          </Box>

          {/* Legenda dos Ativos Slim */}
          <Grid container spacing={1.5}>
            {assetDistributions.map((asset) => (
              <Grid key={asset.symbol} size={{ xs: 6, sm: 3 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: asset.color, flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap' }}>
                    {asset.symbol} ({asset.percent}%)
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '0.7rem', whiteSpace: 'nowrap' }}
                  >
                    ≈ ${asset.valueUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>

      {/* 3. ASSET BALANCES ROW (SLIM, EQUAL-HEIGHT, THEME-AWARE) */}
      <Grid container spacing={2}>
        {MOCK_SAFE_ASSETS.map((asset) => (
          <Grid key={asset.symbol} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                p: 2.25,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                bgcolor: 'background.paper',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Box>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {asset.name}
                  </Typography>
                  <Chip
                    label={asset.symbol}
                    size="small"
                    variant="soft"
                    sx={{
                      height: 20,
                      fontSize: '0.68rem',
                      fontWeight: 800,
                    }}
                  />
                </Stack>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: 'text.primary',
                    fontFamily: 'monospace',
                    letterSpacing: '-0.5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {asset.balance}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'success.main', fontWeight: 600, fontFamily: 'monospace', display: 'block', mt: 0.25 }}
                >
                  ≈ ${asset.valueUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </Typography>
              </Box>

              {asset.role && (
                <Box sx={{ mt: 1.5, pt: 1, borderTop: (theme) => `1px dashed ${theme.palette.divider}` }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.72rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={asset.role}
                  >
                    {asset.role}
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 4. DUAL COLUMN: LIQUIDITY POOLS & SIGNERS MATRIX */}
      <Grid container spacing={2.5}>
        {/* Liquidity Pools Column */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <LiquidityPoolsCard />
        </Grid>

        {/* Signers Matrix Column */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card
            sx={{
              p: 2.5,
              bgcolor: 'background.paper',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              height: '100%',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
              Authorized Signers Matrix ({MOCK_SAFE_SIGNERS.length})
            </Typography>

            <Stack spacing={1.25}>
              {MOCK_SAFE_SIGNERS.map((signer) => (
                <Box
                  key={signer.address}
                  sx={{
                    p: 1.5,
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 1.5,
                  }}
                >
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {signer.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                        {signer.address} • {signer.role}
                      </Typography>
                    </Box>

                    <Chip
                      label={signer.status}
                      size="small"
                      variant="soft"
                      color={
                        signer.status === 'CONFIRMED'
                          ? 'success'
                          : signer.status === 'PENDING'
                            ? 'warning'
                            : 'default'
                      }
                      sx={{
                        height: 20,
                        fontSize: '0.62rem',
                        fontWeight: 800,
                      }}
                    />
                  </Stack>
                </Box>
              ))}
            </Stack>

            <Box sx={{ mt: 2, p: 1.25, bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04), borderRadius: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Note: Signer EVM identities are separated from Operator Ed25519 device identities (INV-010).
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
