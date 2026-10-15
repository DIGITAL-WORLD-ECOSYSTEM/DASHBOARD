import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

import { EdgerButton } from './edger-button';
import { EDGER_TOKENS } from './edger-tokens';
import { EdgerSquircleBadge } from './edger-badge';
import type { EdgerCardProps } from './types';

// ----------------------------------------------------------------------
// EDGER Lights Card: "Soft Colors. Sharp Edges."
// ----------------------------------------------------------------------

export function EdgerCard({
  title,
  description,
  variant = 'rose',
  timestamp,
  icon,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  onClose,
  unread = false,
  pulse = false,
  elevation3D = true,
  sx,
}: EdgerCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const token = EDGER_TOKENS[variant];

  return (
    <Box
      sx={{
        position: 'relative',
        width: 1,
        borderRadius: '16px',
        bgcolor: isDark ? token.bgDark : token.bg,
        border: `1.5px solid ${isDark ? token.borderDark : token.border}`,
        overflow: 'hidden',
        transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',

        // Camada 3D Deslocada (Layered 3D Offset - Assinatura do Modelo)
        ...(elevation3D && {
          boxShadow: isDark
            ? `0 5px 0 0 ${token.accent}, 0 12px 24px -4px rgba(0, 0, 0, 0.6)`
            : `0 4.5px 0 0 ${token.accent}, 0 10px 20px -3px ${token.shadow}`,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: isDark
              ? `0 7px 0 0 ${token.accent}, 0 16px 28px -4px rgba(0, 0, 0, 0.7)`
              : `0 6.5px 0 0 ${token.accent}, 0 14px 24px -3px ${token.shadow}`,
          },
        }),

        ...sx,
      }}
    >
      {/* Faixa Lateral Luminosa de Destaque (Sharp Accent Strip) */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '5px',
          bgcolor: token.accent,
          boxShadow: `2px 0 8px ${token.accent}`,
        }}
      />

      <Box sx={{ p: { xs: 2.2, sm: 2.8 }, pl: { xs: 2.8, sm: 3.4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* Squircle Badge com Inner Light Bevel */}
          {icon && (
            <EdgerSquircleBadge
              icon={icon}
              variant={variant}
              pulse={pulse}
              size={48}
            />
          )}

          {/* Conteúdo Central */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {/* Header: Título + Badge de Não Lido + Timestamp + Botão Fechar */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                mb: 0.6,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  noWrap
                  sx={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: isDark ? token.textDark : token.text,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {title}
                </Typography>

                {/* Dot Pulsante de Não Lido */}
                {unread && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      minWidth: 8,
                      borderRadius: '50%',
                      bgcolor: token.accent,
                      boxShadow: `0 0 0 3px ${isDark ? token.borderDark : token.border}`,
                    }}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                {timestamp && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: isDark ? token.subtextDark : token.subtext,
                      opacity: 0.85,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {timestamp}
                  </Typography>
                )}

                {onClose && (
                  <IconButton
                    size="small"
                    onClick={onClose}
                    sx={{
                      p: 0.5,
                      color: isDark ? token.subtextDark : token.subtext,
                      opacity: 0.7,
                      '&:hover': {
                        opacity: 1,
                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    <Iconify icon="solar:close-circle-bold" width={18} />
                  </IconButton>
                )}
              </Box>
            </Box>

            {/* Descrição em Tipografia Suave */}
            <Typography
              variant="body2"
              sx={{
                color: isDark ? token.subtextDark : token.subtext,
                fontSize: '0.875rem',
                lineHeight: 1.55,
                mb: actionText ? 2 : 0,
              }}
            >
              {description}
            </Typography>

            {/* Ações Embutidas (EDGER Micro Action Buttons) */}
            {(actionText || secondaryActionText) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mt: 1.8 }}>
                {actionText && onAction && (
                  <EdgerButton
                    variant={variant}
                    size="small"
                    onClick={onAction}
                  >
                    {actionText}
                  </EdgerButton>
                )}

                {secondaryActionText && onSecondaryAction && (
                  <EdgerButton
                    variant="slate"
                    size="small"
                    onClick={onSecondaryAction}
                  >
                    {secondaryActionText}
                  </EdgerButton>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
