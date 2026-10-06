import type { IChatConversation } from 'src/types/chat';

import { useCallback, startTransition } from 'react';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListItemButton from '@mui/material/ListItemButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fToNow } from 'src/utils/format-time';

import { clickConversation } from 'src/actions/chat';

import { Iconify } from 'src/components/iconify';

import { useUserProfile } from 'src/auth/facades';
import { IdentityAvatar } from 'src/auth/components';

import { getNavItem } from './utils/get-nav-item';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  collapse: boolean;
  onCloseMobile: () => void;
  conversation: IChatConversation;
};

export function ChatNavItem({ selected, collapse, conversation, onCloseMobile }: Props) {
  const user = useUserProfile();

  const router = useRouter();

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const { group, displayName, displayText, participants, lastActivity, hasOnlineInGroup } =
    getNavItem({ conversation, currentUserId: `${user?.id}` });

  const singleParticipant = participants[0];

  const handleClickConversation = useCallback(async () => {
    try {
      if (!mdUp) {
        onCloseMobile();
      }

      await clickConversation(conversation.id);

      const redirectPath = `${paths.dashboard.chat}?id=${conversation.id}`;

      startTransition(() => {
        router.push(redirectPath);
      });
    } catch (error) {
      console.error(error);
    }
  }, [conversation.id, mdUp, onCloseMobile, router]);

  const renderGroup = () => (
    <Badge variant={hasOnlineInGroup ? 'online' : 'invisible'} badgeContent=" ">
      <AvatarGroup variant="compact" sx={{ width: 48, height: 48 }}>
        {participants.slice(0, 2).map((participant) => (
          <IdentityAvatar 
            key={participant.id} 
            user={{ displayName: participant.name, displayEmail: '', photoURL: participant.avatarUrl, isWeb3Account: false }} 
            size="md" 
          />
        ))}
      </AvatarGroup>
    </Badge>
  );

  const renderSingle = () => (
    <IdentityAvatar
      user={{ displayName: singleParticipant?.name || '', displayEmail: '', photoURL: singleParticipant?.avatarUrl, isWeb3Account: false }}
      status={singleParticipant?.status as any}
      sx={{ width: 48, height: 48 }}
    />
  );

  return (
    <Box component="li" sx={{ display: 'flex', px: 1.5, my: 0.25 }}>
      <ListItemButton
        onClick={handleClickConversation}
        sx={{
          py: 1.5,
          px: 2,
          gap: 2,
          borderRadius: 2,
          position: 'relative',
          transition: (theme) => theme.transitions.create(['all']),
          ...(selected && { 
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.10),
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: (theme) => `solid 1px ${alpha(theme.palette.primary.main, 0.35)}`,
            boxShadow: (theme) => [
              `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.6)}`,
              `0 4px 14px -2px ${alpha(theme.palette.primary.main, 0.20)}`,
            ].join(', '),
            transform: 'translateY(-1px)',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: '15%',
              height: '70%',
              width: 3.5,
              borderRadius: '0 4px 4px 0',
              bgcolor: 'primary.main',
              boxShadow: (theme) => `0 0 10px ${theme.palette.primary.main}`,
            },
            ...((theme) => theme.applyStyles('dark', {
              bgcolor: alpha(theme.palette.primary.main, 0.16),
              border: `solid 1px ${alpha(theme.palette.primary.main, 0.4)}`,
              boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 4px 14px -2px rgba(0, 0, 0, 0.5)`,
            })),
          }),
          ...(!selected && {
            border: 'solid 1px transparent',
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.action.hover, 0.8),
              border: (theme) => `solid 1px ${alpha(theme.palette.divider, 0.5)}`,
              transform: 'translateY(-1px)',
            },
          }),
        }}
      >
        <Badge
          color="error"
          overlap="circular"
          badgeContent={collapse ? conversation.unreadCount : 0}
        >
          {group ? renderGroup() : renderSingle()}
        </Badge>

        {!collapse && (
          <Box sx={{ flexGrow: 1, minWidth: 0, overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="subtitle2" noWrap sx={{ flexGrow: 1, fontWeight: selected ? 700 : 600, ...(selected && { color: 'primary.main' }) }}>
                {displayName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Iconify icon={"solar:pin-bold" as any} width={13} sx={{ color: 'text.disabled' }} />
                <Typography variant="caption" sx={{ color: conversation.unreadCount ? 'primary.main' : 'text.disabled', fontWeight: conversation.unreadCount ? 700 : 500 }}>
                  {fToNow(lastActivity)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Typography
                variant="body2"
                noWrap
                sx={{
                  color: conversation.unreadCount ? 'text.primary' : 'text.secondary',
                  fontWeight: conversation.unreadCount ? 'fontWeightBold' : 'fontWeightRegular',
                }}
              >
                {displayText}
              </Typography>

              {!!conversation.unreadCount && (
                <Box
                  component="span"
                  sx={{
                    flexShrink: 0,
                    minWidth: 20,
                    height: 20,
                    px: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    fontSize: 10,
                    fontWeight: 'bold',
                    boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.primary.main, 0.5)}`,
                  }}
                >
                  {conversation.unreadCount}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </ListItemButton>
    </Box>
  );
}
