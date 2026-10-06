import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';
import type { IChatParticipant, IChatConversations } from 'src/types/chat';

import { toast } from 'sonner';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import InputAdornment from '@mui/material/InputAdornment';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { today } from 'src/utils/format-time';

import { createConversation } from 'src/actions/chat';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useUserProfile } from 'src/auth/facades';

import { ToggleButton } from './styles';
import { ChatNavItem } from './chat-nav-item';
import { ChatNavAccount } from './chat-nav-account';
import { ChatNavItemSkeleton } from './chat-skeleton';
import { ChatNavSearchResults } from './chat-nav-search-results';
import { initialConversation } from './utils/initial-conversation';

// ----------------------------------------------------------------------

const NAV_WIDTH = 380;
const NAV_COLLAPSE_WIDTH = 96;

type Props = {
  loading: boolean;
  selectedConversationId: string;
  contacts: IChatParticipant[];
  collapseNav: UseNavCollapseReturn;
  conversations: IChatConversations;
};

export function ChatNav({
  loading,
  contacts,
  collapseNav,
  conversations,
  selectedConversationId,
}: Props) {
  const router = useRouter();

  const user = useUserProfile();

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const {
    openMobile,
    onOpenMobile,
    onCloseMobile,
    onCloseDesktop,
    collapseDesktop,
    onCollapseDesktop,
  } = collapseNav;

  const [searchContacts, setSearchContacts] = useState<{
    query: string;
    results: IChatParticipant[];
  }>({ query: '', results: [] });

  const [currentTab, setCurrentTab] = useState<string>('all');

  const myContact: IChatParticipant = useMemo(
    () => ({
      id: `${user?.id}`,
      role: `${user?.role}`,
      email: `${user?.displayEmail}`,
      address: `${user?.address}`,
      name: `${user?.displayName}`,
      lastActivity: today(),
      avatarUrl: `${user?.photoURL}`,
      phoneNumber: `${user?.phoneNumber}`,
      status: 'online',
    }),
    [user]
  );

  useEffect(() => {
    if (!mdUp) {
      onCloseDesktop();
    }
  }, [onCloseDesktop, mdUp]);

  const handleToggleNav = useCallback(() => {
    if (mdUp) {
      onCollapseDesktop();
    } else {
      onCloseMobile();
    }
  }, [mdUp, onCloseMobile, onCollapseDesktop]);

  const handleClickCompose = useCallback(() => {
    toast.info('Recurso em implantação. A criação de novos chats será liberada em breve.');
  }, []);

  const handleSearchContacts = useCallback(
    (inputValue: string) => {
      setSearchContacts((prevState) => ({ ...prevState, query: inputValue }));

      if (inputValue) {
        const results = contacts.filter((contact) =>
          contact.name.toLowerCase().includes(inputValue.toLowerCase())
        );

        setSearchContacts((prevState) => ({ ...prevState, results }));
      }
    },
    [contacts]
  );

  const handleClickAwaySearch = useCallback(() => {
    setSearchContacts({ query: '', results: [] });
  }, []);

  const handleClickResult = useCallback(
    async (result: IChatParticipant) => {
      handleClickAwaySearch();

      const linkTo = (id: string) => router.push(`${paths.dashboard.chat}?id=${id}`);

      try {
        // Check if the conversation already exists
        if (conversations.allIds.includes(result.id)) {
          linkTo(result.id);
          return;
        }

        // Find the recipient in contacts
        const recipient = contacts.find((contact) => contact.id === result.id);
        if (!recipient) {
          console.error('Recipient not found');
          return;
        }

        // Prepare conversation data
        const { conversationData } = initialConversation({
          recipients: [recipient],
          me: myContact,
        });

        // Create a new conversation
        const res = await createConversation(conversationData);

        if (!res || !res.conversation) {
          console.error('Failed to create conversation');
        }

        // Navigate to the new conversation
        linkTo(res.conversation.id);
      } catch (error) {
        console.error('Error handling click result:', error);
      }
    },
    [contacts, conversations.allIds, handleClickAwaySearch, myContact, router]
  );

  const renderLoading = () => <ChatNavItemSkeleton />;

  const filteredConversationIds = useMemo(
    () =>
      conversations.allIds.filter((id) => {
        if (currentTab === 'all') return true;
        const category = conversations.byId[id]?.chatCategory;
        return category === currentTab;
      }),
    [conversations.allIds, conversations.byId, currentTab]
  );

  const renderList = () => (
    <nav>
      <Box component="ul">
        {filteredConversationIds.map((conversationId) => (
          <ChatNavItem
            key={conversationId}
            collapse={collapseDesktop}
            conversation={conversations.byId[conversationId]}
            selected={conversationId === selectedConversationId}
            onCloseMobile={onCloseMobile}
          />
        ))}
      </Box>
    </nav>
  );

  const renderListResults = () => (
    <ChatNavSearchResults
      query={searchContacts.query}
      results={searchContacts.results}
      onClickResult={handleClickResult}
    />
  );

  const renderSearchInput = () => (
    <ClickAwayListener onClickAway={handleClickAwaySearch}>
      <TextField
        fullWidth
        value={searchContacts.query}
        onChange={(event) => handleSearchContacts(event.target.value)}
        placeholder="Pesquisar contatos ou mensagens..."
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          mt: 2.5,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.65),
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.45)}`,
            boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.05)',
            transition: (theme) => theme.transitions.create(['background-color', 'border-color', 'box-shadow']),
            '&:hover': {
              borderColor: 'primary.light',
            },
            '&.Mui-focused': {
              bgcolor: (theme) => alpha(theme.palette.background.paper, 0.90),
              borderColor: 'primary.main',
              boxShadow: (theme) => `0 0 0 3px ${alpha(theme.palette.primary.main, 0.20)}`,
            },
            ...((theme: any) => theme.applyStyles('dark', {
              bgcolor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&.Mui-focused': {
                bgcolor: 'rgba(255, 255, 255, 0.07)',
                borderColor: 'primary.main',
                boxShadow: '0 0 0 3px rgba(0, 167, 111, 0.25)',
              },
            })),
          },
        }}
      />
    </ClickAwayListener>
  );

  const TABS = [
    { value: 'all', label: 'Todos', icon: 'solar:chat-round-dots-bold' },
    { value: 'ai', label: 'IA', icon: 'solar:magic-stick-3-bold' },
    { value: 'ticket', label: 'Suporte', icon: 'solar:ticket-bold' },
    { value: 'p2p', label: 'P2P', icon: 'solar:shield-keyhole-bold' },
    { value: 'dao', label: 'DAO', icon: 'solar:users-group-two-rounded-bold' },
    { value: 'system', label: 'Sistema', icon: 'solar:bell-bing-bold' },
  ];

  const renderFilterDropdown = () => (
    <Box sx={{ px: 2.5, pb: 2, flexShrink: 0, borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}` }}>
      {!collapseDesktop && (
        <Select
          fullWidth
          size="small"
          value={currentTab}
          onChange={(e) => setCurrentTab(e.target.value as string)}
          displayEmpty
          renderValue={(selected) => {
            const selectedTab = TABS.find((tab) => tab.value === selected);
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon={(selectedTab?.icon as any) || 'solar:hashtag-bold'} width={18} sx={{ color: 'text.disabled' }} />
                <Typography variant="body2" sx={{ fontWeight: 'fontWeightMedium' }}>
                  {selectedTab?.label || 'Filtrar por...'}
                </Typography>
              </Box>
            );
          }}
          sx={{
            borderRadius: 2,
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.65),
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.45)}`,
            boxShadow: (theme) => [
              `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.8)}`,
              '0 2px 6px -1px rgba(15, 23, 42, 0.04)',
            ].join(', '),
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&:hover': {
              borderColor: 'primary.light',
            },
            ...((theme) => theme.applyStyles('dark', {
              bgcolor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.10)',
            })),
          }}
        >
          {TABS.map((tab) => (
            <MenuItem key={tab.value} value={tab.value}>
              <Iconify icon={tab.icon as any} width={20} sx={{ mr: 1.5, color: 'text.secondary' }} />
              {tab.label}
            </MenuItem>
          ))}
        </Select>
      )}
    </Box>
  );

  const renderContent = () => (
    <>
      <Box
        sx={{
          pt: 2.5,
          px: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          flexShrink: 0,
        }}
      >
        {!collapseDesktop && (
          <>
            <ChatNavAccount />
            <Box sx={{ flexGrow: 1 }} />
          </>
        )}

        <IconButton 
          onClick={handleToggleNav}
          sx={{
            borderRadius: '10px',
            transition: 'all 0.2s',
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.6)}`,
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.4),
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.action.hover, 0.8),
              transform: 'translateY(-1px)',
            },
          }}
        >
          <Iconify
            icon={collapseDesktop ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'}
          />
        </IconButton>

        {!collapseDesktop && (
          <IconButton 
            onClick={handleClickCompose}
            sx={{
              borderRadius: '10px',
              transition: 'all 0.2s',
              color: 'primary.main',
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              boxShadow: (theme) => `0 2px 8px -2px ${alpha(theme.palette.primary.main, 0.2)}`,
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                transform: 'translateY(-1px)',
                boxShadow: (theme) => `0 4px 12px -2px ${alpha(theme.palette.primary.main, 0.35)}`,
              },
            }}
          >
            <Iconify width={20} icon="solar:user-plus-bold" />
          </IconButton>
        )}
      </Box>

      <Box sx={{ p: 2.5, pt: 0, flexShrink: 0 }}>{!collapseDesktop && renderSearchInput()}</Box>

      {renderFilterDropdown()}

      {loading ? (
        renderLoading()
      ) : (
        <Scrollbar sx={{ pb: 1, flex: '1 1 0', minHeight: 0, height: 1 }}>
          {searchContacts.query && !!conversations.allIds.length
            ? renderListResults()
            : renderList()}
        </Scrollbar>
      )}
    </>
  );

  return (
    <>
      <ToggleButton onClick={onOpenMobile} sx={{ display: { md: 'none' } }}>
        <Iconify width={16} icon="solar:users-group-rounded-bold" />
      </ToggleButton>

      <Box
        sx={[
          (theme) => ({
            minHeight: 0,
            height: 1,
            flex: '1 1 auto',
            width: NAV_WIDTH,
            flexDirection: 'column',
            display: { xs: 'none', md: 'flex' },
            overflow: 'hidden',
            borderRight: `solid 1px ${theme.vars.palette.divider}`,
            transition: theme.transitions.create(['width'], {
              duration: theme.transitions.duration.shorter,
            }),
            ...(collapseDesktop && { width: NAV_COLLAPSE_WIDTH }),
          }),
        ]}
      >
        {renderContent()}
      </Box>

      <Drawer
        open={openMobile}
        onClose={onCloseMobile}
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: NAV_WIDTH } },
        }}
      >
        {renderContent()}
      </Drawer>
    </>
  );
}
