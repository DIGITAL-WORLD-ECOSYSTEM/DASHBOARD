import type { IChatMessage, IChatParticipant } from 'src/types/chat';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { useUserProfile } from 'src/auth/facades';
import { IdentityAvatar } from 'src/auth/components';

import { getMessage } from './utils/get-message';

// ----------------------------------------------------------------------

type Props = {
  message: IChatMessage;
  participants: IChatParticipant[];
  onOpenLightbox: (value: string) => void;
};

export function ChatMessageItem({ message, participants, onOpenLightbox }: Props) {
  const user = useUserProfile();

  const { me, senderDetails, hasImage } = getMessage({
    message,
    participants,
    currentUserId: `${user?.id}`,
  });

  const { firstName, avatarUrl } = senderDetails;

  const { body, createdAt } = message;

  const renderInfo = () => (
    <Typography
      noWrap
      variant="caption"
      sx={{ mb: 1, color: 'text.disabled', ...(!me && { mr: 'auto' }) }}
    >
      {!me && `${firstName}, `}
      {fToNow(createdAt)}
    </Typography>
  );

  const renderReadReceipt = () => {
    if (!me || !message.readReceipt) return null;

    let icon = 'solar:check-read-linear';
    let color = 'text.disabled';

    if (message.readReceipt === 'sent') {
      icon = 'solar:check-circle-linear';
    } else if (message.readReceipt === 'delivered') {
      icon = 'solar:check-read-linear';
    } else if (message.readReceipt === 'read') {
      icon = 'solar:check-read-linear';
      color = 'info.main';
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
        <Iconify icon={icon as any} width={14} sx={{ color }} />
      </Box>
    );
  };

  const renderBody = () => (
    <Stack
      sx={{
        p: 1.75,
        minWidth: 48,
        maxWidth: 360,
        borderRadius: me ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        typography: 'body2',
        lineHeight: 1.55,
        position: 'relative',
        transition: (theme) => theme.transitions.create(['box-shadow', 'transform']),
        // 💬 BOLHA DO USUÁRIO (ME) - ESMERALDA 3D VOLUMÉTRICA
        ...(me && {
          color: '#ffffff',
          background: 'linear-gradient(135deg, #00A76F 0%, #007850 100%)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: [
            'inset 0 1.5px 0 rgba(255, 255, 255, 0.45)',
            'inset 0 -1px 0 rgba(0, 0, 0, 0.25)',
            '0 6px 18px -4px rgba(0, 167, 111, 0.40)',
          ].join(', '),
        }),
        // 💬 BOLHA RECEBIDA - VIDRO FOSCO REFRATIVO 3D
        ...(!me && {
          color: 'text.primary',
          background: (theme) => alpha(theme.palette.background.paper, 0.75),
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.6)}`,
          boxShadow: (theme) => [
            `inset 0 1.5px 0 ${alpha(theme.palette.common.white, 0.85)}`,
            '0 4px 14px -3px rgba(15, 23, 42, 0.08)',
          ].join(', '),
          ...((theme) => theme.applyStyles('dark', {
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 4px 14px -3px rgba(0, 0, 0, 0.5)',
          })),
        }),
        ...(hasImage && { p: 0, bgcolor: 'transparent', boxShadow: 'none', border: 'none' }),
      }}
    >
      {hasImage ? (
        <Box
          component="img"
          alt="Attachment"
          src={body}
          onClick={() => onOpenLightbox(body)}
          sx={{
            width: 400,
            height: 'auto',
            borderRadius: 2,
            cursor: 'pointer',
            objectFit: 'cover',
            aspectRatio: '16/11',
            boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.15)',
            transition: 'all 0.2s',
            '&:hover': { opacity: 0.95, transform: 'scale(1.01)' },
          }}
        />
      ) : message.messageType === 'invoice' ? (
        <Stack spacing={1.5} sx={{ minWidth: 240, color: 'text.primary' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon="solar:bill-list-bold" sx={{ color: 'warning.main' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Invoice Recebida</Typography>
          </Box>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Typography variant="body2">{body}</Typography>
          {message.systemData && (
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800 }}>
              {message.systemData.amount} {message.systemData.currency}
            </Typography>
          )}
          <Button 
            variant="contained" 
            color="primary" 
            size="small" 
            fullWidth
            sx={{
              borderRadius: 1.5,
              boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.35)}`,
            }}
          >
            Pagar Agora
          </Button>
        </Stack>
      ) : message.messageType === 'proposal' ? (
        <Stack spacing={1.5} sx={{ minWidth: 240, color: 'text.primary' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon={'solar:document-text-bold' as any} sx={{ color: 'info.main' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Proposta #{message.systemData?.proposalId}</Typography>
          </Box>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Typography variant="body2">{body}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {message.systemData?.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="soft" color="success" size="small" fullWidth sx={{ borderRadius: 1.5 }}>
              Aprovar
            </Button>
            <Button variant="soft" color="error" size="small" fullWidth sx={{ borderRadius: 1.5 }}>
              Rejeitar
            </Button>
          </Box>
        </Stack>
      ) : (
        body
      )}
    </Stack>
  );

  const renderSystemMessage = () => (
    <Box sx={{ width: 1, display: 'flex', justifyContent: 'center', my: 2.5 }}>
      <Stack
        spacing={1}
        sx={{
          alignItems: 'center',
          p: 2,
          background: (theme) => alpha(theme.palette.background.paper, 0.65),
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 2.5,
          border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          boxShadow: (theme) => [
            `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.8)}`,
            '0 6px 20px -4px rgba(15, 23, 42, 0.06)',
          ].join(', '),
          minWidth: 320,
          ...((theme) => theme.applyStyles('dark', {
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.10), 0 6px 20px -4px rgba(0, 0, 0, 0.4)',
          })),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:info-circle-bold" sx={{ color: 'text.secondary' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{body}</Typography>
        </Box>
        {message.systemData && (
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: message.systemData.action === 'pix_in' ? 'success.main' : 'text.primary' }}
          >
            + R$ {message.systemData.amount.toFixed(2)}
          </Typography>
        )}
        <Button variant="outlined" size="small" sx={{ mt: 1, borderRadius: 1.5 }}>
          Ver Transação
        </Button>
      </Stack>
    </Box>
  );

  const renderActions = () => (
    <Box
      className="message-actions"
      sx={(theme) => ({
        pt: 0.5,
        left: 0,
        opacity: 0,
        top: '100%',
        display: 'flex',
        position: 'absolute',
        transition: theme.transitions.create(['opacity'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(me && { right: 0, left: 'unset' }),
      })}
    >
      <IconButton size="small">
        <Iconify icon="solar:reply-bold" width={16} />
      </IconButton>

      <IconButton size="small">
        <Iconify icon="eva:smiling-face-fill" width={16} />
      </IconButton>

      <IconButton size="small">
        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
      </IconButton>
    </Box>
  );

  if (!message.body) {
    return null;
  }

  if (message.messageType === 'system') {
    return renderSystemMessage();
  }

  return (
    <Box sx={{ mb: 5, display: 'flex', justifyContent: me ? 'flex-end' : 'unset' }}>
      {!me && <IdentityAvatar user={{ displayName: firstName || '', displayEmail: '', photoURL: avatarUrl, isWeb3Account: false }} size="sm" sx={{ mr: 2 }} />}

      <Stack sx={{ alignItems: me ? 'flex-end' : 'flex-start' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderInfo()}
          {renderReadReceipt()}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            '&:hover': { '& .message-actions': { opacity: 1 } },
          }}
        >
          {renderBody()}
          {renderActions()}
        </Box>
      </Stack>
    </Box>
  );
}
