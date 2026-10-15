import ButtonBase from '@mui/material/ButtonBase';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

import { EDGER_TOKENS } from './edger-tokens';
import type { EdgerButtonProps } from './types';

// ----------------------------------------------------------------------
// EDGER Micro Action Button: "Sharp Edges, Tactile Feedback"
// ----------------------------------------------------------------------

export function EdgerButton({
  children,
  variant = 'sky',
  size = 'medium',
  icon,
  iconPosition = 'start',
  onClick,
  disabled = false,
  fullWidth = false,
  sx,
}: EdgerButtonProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const token = EDGER_TOKENS[variant];

  // Size scales
  const sizeStyles = {
    small: {
      py: 0.6,
      px: 1.4,
      fontSize: '0.78rem',
      borderRadius: '8px',
      iconSize: 15,
      gap: 0.8,
    },
    medium: {
      py: 0.85,
      px: 1.8,
      fontSize: '0.85rem',
      borderRadius: '10px',
      iconSize: 18,
      gap: 1,
    },
    large: {
      py: 1.1,
      px: 2.2,
      fontSize: '0.92rem',
      borderRadius: '12px',
      iconSize: 20,
      gap: 1.2,
    },
  }[size];

  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      sx={{
        width: fullWidth ? 1 : 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 650,
        fontFamily: theme.typography.fontFamily,
        letterSpacing: '0.01em',
        py: sizeStyles.py,
        px: sizeStyles.px,
        fontSize: sizeStyles.fontSize,
        borderRadius: sizeStyles.borderRadius,
        gap: sizeStyles.gap,
        color: isDark ? token.textDark : token.text,
        bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.75)',
        border: `1.5px solid ${isDark ? token.borderDark : token.border}`,
        boxShadow: isDark
          ? `0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)`
          : `0 2px 5px rgba(0, 0, 0, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.9)`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        userSelect: 'none',

        // Micro-interatividade no Hover
        '&:hover:not(:disabled)': {
          transform: 'translateY(-1.5px)',
          bgcolor: isDark ? 'rgba(255, 255, 255, 0.09)' : '#FFFFFF',
          borderColor: isDark ? token.accent : token.accent,
          boxShadow: isDark
            ? `0 6px 14px ${token.shadow}, inset 0 1px 1px rgba(255, 255, 255, 0.2)`
            : `0 5px 12px ${token.shadow}, inset 0 1px 1.5px rgba(255, 255, 255, 1)`,
        },

        // Feedback de Clique (Tactile Press)
        '&:active:not(:disabled)': {
          transform: 'translateY(1px) scale(0.98)',
          boxShadow: isDark
            ? `0 1px 3px rgba(0, 0, 0, 0.5)`
            : `0 1px 2px rgba(0, 0, 0, 0.08)`,
        },

        ...sx,
      }}
    >
      {icon && iconPosition === 'start' && (
        typeof icon === 'string' ? (
          <Iconify icon={icon as any} width={sizeStyles.iconSize} sx={{ color: isDark ? token.accent : token.accent }} />
        ) : (
          icon
        )
      )}

      {children}

      {icon && iconPosition === 'end' && (
        typeof icon === 'string' ? (
          <Iconify icon={icon as any} width={sizeStyles.iconSize} sx={{ color: isDark ? token.accent : token.accent }} />
        ) : (
          icon
        )
      )}
    </ButtonBase>
  );
}
