import type { SWRConfiguration } from 'swr';
import type { IChatMessage, IChatParticipant, IChatConversation } from 'src/types/chat';

import useSWR from 'swr';
import { useMemo } from 'react';
import { keyBy } from 'es-toolkit';

import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const CHAT_ENDPOINT = endpoints.chat;

const swrOptions: SWRConfiguration = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

// ----------------------------------------------------------------------

export const MOCK_PARTICIPANTS: IChatParticipant[] = [
  {
    id: 'user-nexus-ai',
    name: 'Nexus AI (Assistente)',
    role: 'Inteligência Artificial DAO',
    email: 'nexus@asppibra.org.br',
    address: 'Rede Neural DAO Node-01',
    avatarUrl: '',
    phoneNumber: '+55 11 98888-0001',
    lastActivity: new Date().toISOString(),
    status: 'online',
  },
  {
    id: 'user-ricardo',
    name: 'Ricardo Almeida (Suporte)',
    role: 'Analista de Suporte',
    email: 'ricardo.suporte@asppibra.org.br',
    address: 'Brasília - DF',
    avatarUrl: '',
    phoneNumber: '+55 61 99123-4567',
    lastActivity: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    status: 'online',
  },
  {
    id: 'user-carlos-p2p',
    name: 'Carlos Mendes',
    role: 'Membro Associado P2P',
    email: 'carlos.mendes@email.com',
    address: 'São Paulo - SP',
    avatarUrl: '',
    phoneNumber: '+55 11 97654-3210',
    lastActivity: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'busy',
  },
  {
    id: 'user-governanca',
    name: 'Conselho Consultivo DAO',
    role: 'Comitê de Governança',
    email: 'governanca@asppibra.org.br',
    address: 'DAO Smart Contracts',
    avatarUrl: '',
    phoneNumber: '+55 61 3333-0000',
    lastActivity: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    status: 'online',
  },
  {
    id: 'user-sistema',
    name: 'Sistema ASPPIBRA',
    role: 'Notificações Institucionais',
    email: 'sistema@asppibra.org.br',
    address: 'Servidor Central',
    avatarUrl: '',
    phoneNumber: '',
    lastActivity: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    status: 'online',
  },
];

export const MOCK_CONVERSATIONS: IChatConversation[] = [
  {
    id: 'c-nexus-ai',
    type: 'ONE_TO_ONE',
    unreadCount: 0,
    chatCategory: 'ai',
    participants: [MOCK_PARTICIPANTS[0]],
    messages: [
      {
        id: 'm-ai-1',
        body: 'Olá! Sou o assistente Nexus da ASPPIBRA. Como posso auxiliar na gestão e operações hoje?',
        senderId: 'user-nexus-ai',
        contentType: 'text',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        attachments: [],
        messageType: 'text',
        readReceipt: 'read',
      },
      {
        id: 'm-ai-2',
        body: 'Nexus, por favor consulte o status das propostas ativas da tesouraria.',
        senderId: 'mock-user-id',
        contentType: 'text',
        createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        attachments: [],
        messageType: 'text',
        readReceipt: 'read',
      },
      {
        id: 'm-ai-3',
        body: 'Consultei os contratos inteligentes: temos 3 propostas ativas no momento, com 94% de aprovação e quorum atingido!',
        senderId: 'user-nexus-ai',
        contentType: 'text',
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        attachments: [],
        messageType: 'text',
        readReceipt: 'read',
      },
    ],
  },
  {
    id: 'c-suporte-ticket',
    type: 'ONE_TO_ONE',
    unreadCount: 2,
    chatCategory: 'ticket',
    ticketSla: '2h',
    ticketStatus: 'Em Atendimento',
    participants: [MOCK_PARTICIPANTS[1]],
    messages: [
      {
        id: 'm-tk-1',
        body: 'Olá administrador, abri o chamado #1024 referente à atualização cadastral do membro.',
        senderId: 'user-ricardo',
        contentType: 'text',
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        attachments: [],
        messageType: 'text',
        readReceipt: 'read',
      },
      {
        id: 'm-tk-2',
        body: 'Documentação validada com sucesso pelo módulo de auditoria.',
        senderId: 'user-ricardo',
        contentType: 'text',
        createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        attachments: [],
        messageType: 'text',
        readReceipt: 'sent',
      },
    ],
  },
  {
    id: 'c-p2p-carlos',
    type: 'ONE_TO_ONE',
    unreadCount: 1,
    chatCategory: 'p2p',
    participants: [MOCK_PARTICIPANTS[2]],
    messages: [
      {
        id: 'm-p2p-1',
        body: 'Transferência Pix liquidada com sucesso.',
        senderId: 'user-carlos-p2p',
        contentType: 'text',
        createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        attachments: [],
        messageType: 'system',
        systemData: { action: 'pix_in', amount: 850.00 },
      },
      {
        id: 'm-p2p-2',
        body: 'Confirmando o recebimento da liquidação P2P. Muito obrigado!',
        senderId: 'user-carlos-p2p',
        contentType: 'text',
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        attachments: [],
        messageType: 'text',
        readReceipt: 'delivered',
      },
    ],
  },
  {
    id: 'c-dao-governanca',
    type: 'GROUP',
    unreadCount: 3,
    chatCategory: 'dao',
    participants: [MOCK_PARTICIPANTS[3], MOCK_PARTICIPANTS[1], MOCK_PARTICIPANTS[2]],
    messages: [
      {
        id: 'm-dao-1',
        body: 'Nova Proposta #042 submetida para alocação do fundo de reserva institucional.',
        senderId: 'user-governanca',
        contentType: 'text',
        createdAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
        attachments: [],
        messageType: 'proposal',
        systemData: { proposalId: '042', title: 'Alocação de Fundo de Reserva Q4 - ASPPIBRA' },
      },
    ],
  },
  {
    id: 'c-sistema-notificacoes',
    type: 'ONE_TO_ONE',
    unreadCount: 0,
    chatCategory: 'system',
    participants: [MOCK_PARTICIPANTS[4]],
    messages: [
      {
        id: 'm-sys-1',
        body: 'Backup de chaves DID e certificados emitido com sucesso na rede descentralizada.',
        senderId: 'user-sistema',
        contentType: 'text',
        createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        attachments: [],
        messageType: 'system',
      },
    ],
  },
];

// ----------------------------------------------------------------------

type ContactsData = {
  contacts: IChatParticipant[];
};

export function useGetContacts() {
  const url = [CHAT_ENDPOINT, { params: { endpoint: 'contacts' } }];

  const { data, isLoading, error, isValidating } = useSWR<ContactsData>(url, fetcher, {
    ...swrOptions,
  });

  const memoizedValue = useMemo(() => {
    const dataSource = data?.contacts && data.contacts.length ? data.contacts : MOCK_PARTICIPANTS;
    return {
      contacts: dataSource,
      contactsLoading: isLoading,
      contactsError: error,
      contactsValidating: isValidating,
      contactsEmpty: !dataSource.length,
    };
  }, [data?.contacts, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

type ConversationsData = {
  conversations: IChatConversation[];
};

export function useGetConversations() {
  const url = `${CHAT_ENDPOINT}/conversations`;

  const { data, isLoading, error, isValidating } = useSWR<ConversationsData>(url, fetcher, {
    ...swrOptions,
  });

  const memoizedValue = useMemo(() => {
    const dataSource = data?.conversations && data.conversations.length ? data.conversations : MOCK_CONVERSATIONS;
    const byId = dataSource.length ? keyBy(dataSource, (option) => option.id) : {};
    const allIds = Object.keys(byId);

    return {
      conversations: { byId, allIds },
      conversationsLoading: isLoading,
      conversationsError: error,
      conversationsValidating: isValidating,
      conversationsEmpty: !allIds.length,
    };
  }, [data?.conversations, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

type ConversationData = {
  conversation: IChatConversation;
};

export function useGetConversation(conversationId: string) {
  const url = conversationId
    ? `${CHAT_ENDPOINT}/conversations/${conversationId}/messages`
    : '';

  const { data, isLoading, error, isValidating } = useSWR<ConversationData>(url, fetcher, {
    ...swrOptions,
  });

  const memoizedValue = useMemo(() => {
    const fallback = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
    const dataSource = data?.conversation || fallback;

    return {
      conversation: dataSource,
      conversationLoading: isLoading && !fallback,
      conversationError: error && !fallback ? error : null,
      conversationValidating: isValidating,
      conversationEmpty: !dataSource,
    };
  }, [data?.conversation, error, isLoading, isValidating, conversationId]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function sendMessage(conversationId: string, messageData: IChatMessage) {
  const data = { conversationId, messageData };
  try {
    await axios.post(`${CHAT_ENDPOINT}/conversations/${conversationId}/messages`, data);
  } catch (e) {
    console.info('Mock sent message locally:', messageData);
  }
}

// ----------------------------------------------------------------------

export async function createConversation(conversationData: IChatConversation) {
  const data = { conversationData };
  try {
    const res = await axios.post(`${CHAT_ENDPOINT}/conversations`, data);
    return res.data;
  } catch (e) {
    return { conversation: conversationData };
  }
}

// ----------------------------------------------------------------------

export async function clickConversation(conversationId: string) {
  try {
    await axios.post(`${CHAT_ENDPOINT}/conversations/${conversationId}/read`);
  } catch (e) {
    // Mock read
  }
}
