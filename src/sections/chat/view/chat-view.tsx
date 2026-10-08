import type { IChatParticipant } from 'src/types/chat';

import { useState, useEffect, useCallback, startTransition } from 'react';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useChatRealtime } from 'src/contexts/chat-realtime-context';
import { useGetContacts, useGetConversation, useGetConversations } from 'src/actions/chat';

import { EmptyContent } from 'src/components/empty-content';

import { useUserProfile } from 'src/auth/facades';

import { ChatNav } from '../chat-nav';
import { ChatLayout } from '../layout';
import { ChatRoom } from '../chat-room';
import { ChatKpiBar } from '../chat-kpi-bar';
import { ChatDashboard } from '../chat-dashboard';
import { ChatMessageList } from '../chat-message-list';
import { ChatMessageInput } from '../chat-message-input';
import { useCollapseNav } from '../hooks/use-collapse-nav';
import { ChatHeaderCompose } from '../chat-header-compose';
import { ChatHeaderDetails } from '../chat-header-details';

// ----------------------------------------------------------------------

export function ChatView() {
  const router = useRouter();

  const user = useUserProfile();

  const { contacts } = useGetContacts();

  const searchParams = useSearchParams();
  const selectedConversationId = searchParams.get('id') || '';

  const { conversations, conversationsLoading } = useGetConversations();
  const { conversation, conversationError, conversationLoading } =
    useGetConversation(selectedConversationId);

  const roomNav = useCollapseNav();
  const conversationsNav = useCollapseNav();

  const [recipients, setRecipients] = useState<IChatParticipant[]>([]);

  useEffect(() => {
    if (!selectedConversationId) {
      startTransition(() => {
        router.push(paths.dashboard.chat);
      });
    }
  }, [conversationError, router, selectedConversationId]);

  const { connect, disconnect, connectionState } = useChatRealtime();

  useEffect(() => {
    if (selectedConversationId) {
      connect(selectedConversationId);
    } else {
      disconnect();
    }
  }, [selectedConversationId, connect, disconnect]);

  const handleAddRecipients = useCallback((selected: IChatParticipant[]) => {
    setRecipients(selected);
  }, []);

  const filteredParticipants: IChatParticipant[] = conversation
    ? conversation.participants.filter(
      (participant: IChatParticipant) => participant.id !== `${user?.id}`
    )
    : [];

  return (
    <DashboardContent
      maxWidth={false}
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        height: { xs: 'calc(100dvh - 64px)', md: 'calc(100vh - 72px)' },
        maxHeight: { xs: 'calc(100dvh - 64px)', md: 'calc(100vh - 72px)' },
        overflow: 'hidden',
        pt: { xs: 1, md: 1.5 },
        pb: { xs: 1.5, md: 2 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 1.5, md: 2 }, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
            Chat & Comunicação
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.25,
              py: 0.4,
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              bgcolor: (theme) => alpha(connectionState === 'DISCONNECTED' ? theme.palette.error.main : theme.palette.success.main, 0.12),
              color: connectionState === 'DISCONNECTED' ? 'error.main' : 'success.main',
              border: (theme) => `1px solid ${alpha(connectionState === 'DISCONNECTED' ? theme.palette.error.main : theme.palette.success.main, 0.25)}`,
              boxShadow: (theme) => `0 2px 8px ${alpha(connectionState === 'DISCONNECTED' ? theme.palette.error.main : theme.palette.success.main, 0.2)}`,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: connectionState === 'DISCONNECTED' ? 'error.main' : 'success.main',
                boxShadow: (theme) => `0 0 6px ${connectionState === 'DISCONNECTED' ? theme.palette.error.main : theme.palette.success.main}`,
              }}
            />
            {connectionState === 'DISCONNECTED' ? 'Desconectado' : 'Tempo Real Ativo'}
          </Box>
        </Box>
      </Box>

      <ChatLayout
        sx={{
          flex: '1 1 0',
          minHeight: 0,
          height: 1,
        }}
        slots={{
          kpiBar: <ChatKpiBar />,
          header: selectedConversationId ? (
            <ChatHeaderDetails
              collapseNav={roomNav}
              participants={filteredParticipants}
              loading={conversationLoading}
              conversation={conversation}
            />
          ) : recipients.length > 0 ? (
            <ChatHeaderCompose contacts={contacts} onAddRecipients={handleAddRecipients} />
          ) : null,
          nav: (
            <ChatNav
              contacts={contacts}
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              collapseNav={conversationsNav}
              loading={conversationsLoading}
            />
          ),
          main: (
            <>
              {selectedConversationId ? (
                conversationError ? (
                  <EmptyContent
                    title={conversationError.message}
                    imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-chat-empty.svg`}
                  />
                ) : (
                  <ChatMessageList
                    messages={conversation?.messages ?? []}
                    participants={filteredParticipants}
                    loading={conversationLoading}
                  />
                )
              ) : recipients.length > 0 ? (
                <ChatMessageList
                  messages={[]}
                  participants={recipients}
                  loading={false}
                />
              ) : (
                <ChatDashboard />
              )}

              {(!!selectedConversationId || !!recipients.length) && (
                <ChatMessageInput
                  recipients={recipients}
                  onAddRecipients={handleAddRecipients}
                  selectedConversationId={selectedConversationId}
                  disabled={!recipients.length && !selectedConversationId}
                />
              )}
            </>
          ),
          details: conversation && selectedConversationId ? (
            <ChatRoom
              collapseNav={roomNav}
              participants={filteredParticipants}
              loading={conversationLoading}
              messages={conversation?.messages ?? []}
              conversation={conversation}
            />
          ) : null,
        }}
      />
    </DashboardContent>
  );
}
