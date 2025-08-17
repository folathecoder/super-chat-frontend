'use client';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useParams } from 'next/navigation';
import {
  Message,
  Conversation,
  Conversations,
  ConversationDetail,
} from '@/types/api/conversation';
import {
  getConversations,
  getConversation,
} from '@/services/conversation.service';
import socket from '@/lib/clients/socketClient';
import SOCKET_EVENTS from '@/utils/constants/socketEvents';

export interface ConversationContextType {
  conversations: Conversations;
  conversation?: ConversationDetail;
  error?: string;
  loadingConversations: boolean;
  loadingConversation: boolean;
  conversationId?: string;
  fetchConversations: () => Promise<void>;
  fetchConversation: (id: string) => Promise<void>;
  setConversation: React.Dispatch<
    React.SetStateAction<ConversationDetail | undefined>
  >;
  setConversations: React.Dispatch<React.SetStateAction<Conversations>>;
  chatMessage: string;
  setChatMessage: React.Dispatch<React.SetStateAction<string>>;
  addMessageToConversation: (
    currentConversation: ConversationDetail,
    newMessage: Message | undefined
  ) => void;
}

export const ConversationContext =
  createContext<ConversationContextType | null>(null);

export const ConversationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const params = useParams();
  const conversationId = params.conversationId as string;

  const [conversations, setConversations] = useState<Conversations>([]);
  const [conversation, setConversation] = useState<ConversationDetail>();
  const [error, setError] = useState<string>();
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const loadingConversationsRef = useRef(false);
  const loadingConversationRef = useRef(false);

  const fetchConversations = useCallback(async () => {
    if (loadingConversationsRef.current) return;
    loadingConversationsRef.current = true;
    setLoadingConversations(true);
    setError(undefined);
    try {
      const conversationsData = await getConversations();
      const sortedConversations = [...conversationsData].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setConversations(sortedConversations);
    } catch (err) {
      setError(
        `Failed to load conversations. Please try again; ${String(err)}`
      );
    } finally {
      setLoadingConversations(false);
      loadingConversationsRef.current = false;
    }
  }, []);

  const fetchConversation = useCallback(async (id: string) => {
    if (!id || loadingConversationRef.current) return;
    loadingConversationRef.current = true;
    setLoadingConversation(true);
    setError(undefined);
    try {
      const data = await getConversation(id);
      setConversation(data);
    } catch (err) {
      setError(
        `Failed to load conversation: ${String(err)} for conversationId: ${id}`
      );
    } finally {
      setLoadingConversation(false);
      loadingConversationRef.current = false;
    }
  }, []);

  const addMessageToConversation = useCallback(
    (
      currentConversation: ConversationDetail,
      newMessage: Message | undefined
    ) => {
      if (!currentConversation || !newMessage) return;

      setConversation((previousConversation) => {
        if (!previousConversation) return previousConversation;

        const existingMessageIndex = previousConversation.messages.findIndex(
          (message) => message.id === newMessage.id
        );

        const updatedMessages =
          existingMessageIndex !== -1
            ? previousConversation.messages.map((message, index) =>
                index === existingMessageIndex ? newMessage : message
              )
            : [...previousConversation.messages, newMessage];

        return { ...previousConversation, messages: updatedMessages };
      });
    },
    [setConversation]
  );

  const updateConversationTitleInList = useCallback(
    (
      currentConversation: ConversationDetail,
      allConversations: Conversations,
      updatedConversationTitle: string
    ) => {
      if (
        !currentConversation ||
        !updatedConversationTitle ||
        !allConversations
      )
        return;

      setConversation((previousConversation) =>
        previousConversation
          ? { ...previousConversation, title: updatedConversationTitle }
          : previousConversation
      );

      setConversations((previousConversations) =>
        previousConversations.map((existingConversation) =>
          existingConversation.id === conversationId
            ? { ...existingConversation, title: updatedConversationTitle }
            : existingConversation
        )
      );
    },
    [setConversation, setConversations, conversationId]
  );

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (conversationId) {
      fetchConversation(conversationId);
    } else {
      setConversation(undefined);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId || !conversation || !conversations) return;

    socket.emit('join_room', { conversation_id: conversationId });

    const handleAIMessageReceived = (receivedMessage: Message) =>
      addMessageToConversation(conversation, receivedMessage);

    const handleUserMessageCreated = (receivedMessage: Message) =>
      addMessageToConversation(conversation, receivedMessage);

    const handleConversationTitleCreated = (
      updatedConversation: Conversation
    ) => {
      fetchConversations();
      updateConversationTitleInList(
        conversation,
        conversations,
        updatedConversation.title
      );
    };

    socket.on(SOCKET_EVENTS.CHAT_AI_MESSAGE, handleAIMessageReceived);
    socket.on(SOCKET_EVENTS.CHAT_USER_CREATE, handleUserMessageCreated);
    socket.on(SOCKET_EVENTS.CHAT_TITLE_CREATE, handleConversationTitleCreated);

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_AI_MESSAGE, handleAIMessageReceived);
      socket.off(SOCKET_EVENTS.CHAT_USER_CREATE, handleUserMessageCreated);
      socket.off(
        SOCKET_EVENTS.CHAT_TITLE_CREATE,
        handleConversationTitleCreated
      );
    };
  }, [
    conversationId,
    conversation,
    conversations,
    addMessageToConversation,
    updateConversationTitleInList,
  ]);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        conversation,
        error,
        loadingConversations,
        loadingConversation,
        conversationId,
        fetchConversations,
        fetchConversation,
        setConversation,
        setConversations,
        chatMessage,
        setChatMessage,
        addMessageToConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = (): ConversationContextType => {
  const context = useContext(ConversationContext);

  if (!context) {
    throw new Error(
      'useConversation must be used within a ConversationProvider'
    );
  }
  return context;
};

export default ConversationProvider;
