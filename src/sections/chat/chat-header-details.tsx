import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';
import type { IChatParticipant, IChatConversation } from 'src/types/chat';

import { useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { IdentityAvatar } from 'src/auth/components';

import { ChatHeaderSkeleton } from './chat-skeleton';

// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  participants: IChatParticipant[];
  collapseNav: UseNavCollapseReturn;
  conversation?: IChatConversation;
};

export function ChatHeaderDetails({ collapseNav, participants, loading, conversation }: Props) {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const menuActions = usePopover();

  const isGroup = participants.length > 1;

  const singleParticipant = participants[0];

  const { collapseDesktop, onCollapseDesktop, onOpenMobile } = collapseNav;

  const handleToggleNav = useCallback(() => {
    if (lgUp) {
      onCollapseDesktop();
    } else {
      onOpenMobile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lgUp]);

  const renderGroup = () => (
    <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
      <Badge variant="online" badgeContent=" ">
        <AvatarGroup
          max={3}
          sx={{
            [`& .${avatarGroupClasses.avatar}`]: {
              width: 32,
              height: 32,
            },
          }}
        >
          {participants.map((participant) => (
            <IdentityAvatar key={participant.id} user={{ displayName: participant.name, displayEmail: '', photoURL: participant.avatarUrl, isWeb3Account: false }} size="sm" />
          ))}
        </AvatarGroup>
      </Badge>

      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'fontWeightBold' }}>
              Grupo
            </Typography>
          </Box>
        }
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, typography: 'caption', color: 'text.secondary', fontWeight: 'fontWeightMedium' }}>
            <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main' }} />
            Online • {participants.length} membros - TI
          </Box>
        }
      />
    </Box>
  );

  const renderSingle = () => (
    <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
      <IdentityAvatar
        user={{ displayName: singleParticipant?.name || '', displayEmail: '', photoURL: singleParticipant?.avatarUrl, isWeb3Account: false }}
        status={(singleParticipant?.status as any) || 'online'}
        size="md"
      />

      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'fontWeightBold' }}>{singleParticipant?.name}</Typography>
            {conversation?.chatCategory === 'ticket' && (
              <Box component="span" sx={{ px: 1, py: 0.25, borderRadius: 1, typography: 'overline', bgcolor: 'warning.lighter', color: 'warning.dark' }}>
                Suporte
              </Box>
            )}
          </Box>
        }
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, typography: 'caption', color: 'text.secondary', fontWeight: 'fontWeightMedium' }}>
            <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: singleParticipant?.status === 'offline' ? 'text.disabled' : 'success.main' }} />
            {singleParticipant?.status === 'offline' ? 'Offline' : 'Online'} • Administrador - ASPPIBRA
          </Box>
        }
      />
    </Box>
  );

  if (loading) {
    return <ChatHeaderSkeleton />;
  }

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
    >
      <MenuList>
        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:bell-off-bold" />
          Hide notifications
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:forbidden-circle-bold" />
          Block
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:danger-triangle-bold" />
          Report
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={() => menuActions.onClose()} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const renderContextBar = () => {
    if (!conversation?.chatCategory) return null;

    let icon = '';
    let text = '';
    let color = 'text.secondary';
    let bgcolor = 'background.neutral';

    switch (conversation.chatCategory) {
      case 'ticket':
        icon = 'solar:ticket-bold';
        text = `Ticket ${conversation.id} • SLA: ${conversation.ticketSla || '24h'} • Status: ${conversation.ticketStatus || 'Aberto'}`;
        color = 'warning.main';
        bgcolor = 'warning.lighter';
        break;
      case 'p2p':
        icon = 'solar:shield-keyhole-bold';
        text = 'Comunicação End-to-End Criptografada (Seguro)';
        color = 'success.main';
        bgcolor = 'success.lighter';
        break;
      case 'dao':
        icon = 'solar:users-group-two-rounded-bold';
        text = 'Canal #governança • 3 Propostas Ativas';
        color = 'info.main';
        bgcolor = 'info.lighter';
        break;
      case 'system':
        icon = 'solar:bell-bing-bold';
        text = 'Notificações Institucionais do Sistema';
        color = 'text.secondary';
        break;
      case 'ai':
        icon = 'solar:magic-stick-3-bold';
        text = 'Assistente Operacional da DAO';
        color = 'primary.main';
        bgcolor = 'primary.lighter';
        break;
      default:
        break;
    }

    if (!text) return null;

    return (
      <Box
        sx={{
          px: 2.5,
          py: 0.85,
          bgcolor,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.2,
          borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.4)}`,
        }}
      >
        <Box
          sx={{
            width: 22,
            height: 22,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: (theme) => alpha(theme.palette.common.white, 0.6),
            ...((theme) => theme.applyStyles('dark', {
              bgcolor: 'rgba(255, 255, 255, 0.08)',
            })),
          }}
        >
          <Iconify icon={icon as any} width={14} sx={{ color }} />
        </Box>
        <Box sx={{ typography: 'caption', color, fontWeight: 700, letterSpacing: 0.2 }}>{text}</Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 1, width: 1 }}>
        {isGroup ? renderGroup() : renderSingle()}

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <IconButton
            sx={{
              borderRadius: '10px',
              border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              bgcolor: (theme) => alpha(theme.palette.background.paper, 0.4),
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.action.hover, 0.8),
                transform: 'translateY(-1px)',
              },
            }}
          >
            <Iconify icon="eva:search-fill" width={20} />
          </IconButton>

          <IconButton
            sx={{
              borderRadius: '10px',
              border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              bgcolor: (theme) => alpha(theme.palette.background.paper, 0.4),
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.action.hover, 0.8),
                transform: 'translateY(-1px)',
              },
            }}
          >
            <Iconify icon="solar:phone-bold" width={20} />
          </IconButton>

          <IconButton
            sx={{
              borderRadius: '10px',
              border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              bgcolor: (theme) => alpha(theme.palette.background.paper, 0.4),
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.action.hover, 0.8),
                transform: 'translateY(-1px)',
              },
            }}
          >
            <Iconify icon="solar:videocamera-record-bold" width={20} />
          </IconButton>
          
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 24, my: 'auto' }} />

          <IconButton 
            onClick={handleToggleNav}
            sx={{
              borderRadius: '10px',
              transition: 'all 0.2s',
              color: !collapseDesktop ? 'primary.main' : 'text.secondary',
              border: (theme) => !collapseDesktop ? `1px solid ${alpha(theme.palette.primary.main, 0.4)}` : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              bgcolor: (theme) => !collapseDesktop ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.background.paper, 0.4),
              boxShadow: (theme) => !collapseDesktop ? `0 2px 8px ${alpha(theme.palette.primary.main, 0.25)}` : 'none',
              '&:hover': {
                bgcolor: (theme) => !collapseDesktop ? alpha(theme.palette.primary.main, 0.20) : alpha(theme.palette.action.hover, 0.8),
                transform: 'translateY(-1px)',
              }
            }}
          >
            <Iconify icon="solar:info-circle-bold" width={20} />
          </IconButton>
        </Box>
      </Box>

      {renderContextBar()}
      {renderMenuActions()}
    </Box>
  );
}
