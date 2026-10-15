import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

import { EDGER_TOKENS } from './edger-tokens';
import type { EdgerSquircleBadgeProps } from './types';

// ----------------------------------------------------------------------
// EDGER Squircle Badge: "Glass-Squircle com Anel Interno de Luz"
// ----------------------------------------------------------------------

export function EdgerSquircleBadge({
  icon,
  variant = 'sky',
  size = 46,
  pulse = false,
  sx,
}: EdgerSquircleBadgeProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const token = EDGER_TOKENS[variant];

  return (
    <Box
      sx={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: `${Math.round(size * 0.36)}px`, // Geometria Squircle Apple-style
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark ? token.badgeBgDark : token.badgeBg,
        border: `1.5px solid ${isDark ? token.borderDark : token.border}`,
        color: isDark ? token.textDark : token.accent,
        boxShadow: isDark
          ? `inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 4px 12px ${token.shadow}`
          : `inset 0 1px 1.5px rgba(255, 255, 255, 0.9), 0 4px 10px ${token.shadow}`,
        position: 'relative',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: isDark
            ? `inset 0 1px 2px rgba(255, 255, 255, 0.25), 0 6px 16px ${token.shadow}`
            : `inset 0 1px 2px rgba(255, 255, 255, 1), 0 6px 14px ${token.shadow}`,
        },
        ...(pulse && {
          animation: 'edgerPulse 2.4s infinite ease-in-out',
          '@keyframes edgerPulse': {
            '0%': { transform: 'scale(1)', boxShadow: `0 0 0 0 ${token.shadow}` },
            '50%': { transform: 'scale(1.04)', boxShadow: `0 0 0 8px rgba(0,0,0,0)` },
            '100%': { transform: 'scale(1)', boxShadow: `0 0 0 0 rgba(0,0,0,0)` },
          },
        }),
        ...sx,
      }}
    >
      {typeof icon === 'string' ? (
        <Iconify icon={icon as any} width={Math.round(size * 0.52)} />
      ) : (
        icon
      )}
    </Box>
  );
}
