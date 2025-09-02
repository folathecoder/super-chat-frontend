'use client';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Message,
  MessageStatus,
  StreamedMessage,
  StreamedReasoningMessage,
  Conversation,
  Conversations,
  ConversationDetail,
  UpdateMessageFile,
} from '@/types/api/conversation';
import { Author } from '@/types/enums';
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
  streamingMessageId: string;
}

export const ConversationContext =
  createContext<ConversationContextType | null>(null);

export const ConversationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.conversationId as string;

  const [conversations, setConversations] = useState<Conversations>([]);
  const [conversation, setConversation] = useState<ConversationDetail>();
  const [error, setError] = useState<string>();
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [streamingMessageId, setStreamingMessageId] = useState('');

  const loadingConversationsRef = useRef(false);
  const loadingConversationRef = useRef(false);

  // Fetches all conversations and sorts them by the last updated date
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

  // Fetches a specific conversation by ID and updates the state
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

  // Adds a new message to the current conversation or updates an existing one
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

  // Updates the conversation title in both the current conversation and the list of conversations
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

  // Adds streamed tokens to an existing message or creates a new message if it doesn't exist
  const addStreamedTokensToMessage = useCallback(
    (messageId: string, conversationId: string, token: string) => {
      if (!messageId) return;

      setStreamingMessageId(messageId);

      setConversation((prev) => {
        if (!prev || prev.id !== conversationId) return prev;

        const messages = [...prev.messages];
        const idx = messages.findIndex((m) => m.id === messageId);

        if (idx !== -1) {
          messages[idx] = {
            ...messages[idx],
            content: messages[idx].content + token,
          };
        } else {
          messages.push({
            id: messageId,
            conversationId: prev.id,
            content: token,
            reasoning: null,
            timestamp: new Date().toISOString(),
            author: Author.AI,
            status: MessageStatus.LOADING,
          });
        }

        return { ...prev, messages };
      });
    },
    []
  );

  // Adds streamed tokens to an existing reasoning message or creates a new message if it doesn't exist
  const addStreamedTokensToReasoning = useCallback(
    (messageId: string, conversationId: string, token: string) => {
      if (!messageId) return;

      setStreamingMessageId(messageId);

      setConversation((prev) => {
        if (!prev || prev.id !== conversationId) return prev;

        const messages = [...prev.messages];
        const idx = messages.findIndex((m) => m.id === messageId);

        if (idx !== -1) {
          messages[idx] = {
            ...messages[idx],
            reasoning: messages[idx].reasoning + token,
          };
        } else {
          messages.push({
            id: messageId,
            conversationId: prev.id,
            content: '',
            reasoning: null,
            timestamp: new Date().toISOString(),
            author: Author.AI,
            status: MessageStatus.LOADING,
          });
        }

        return { ...prev, messages };
      });
    },
    []
  );

  // Updates the file URL of a specific message in the conversation
  const updateMessageFileUrl = useCallback(
    (
      messageId: string,
      conversationId: string,
      fileUrl: string,
      fileName: string
    ) => {
      if (!messageId || !conversationId || !fileUrl || !fileName) return;

      setConversation((prev) => {
        if (!prev || prev.id !== conversationId) return prev;

        const messages = [...prev.messages];
        const msgIdx = messages.findIndex((m) => m.id === messageId);

        if (msgIdx !== -1) {
          const message = { ...messages[msgIdx] };

          if (message.files && message.files.length > 0) {
            const fileIdx = message.files.findIndex(
              (f) => f.fileName === fileName
            );

            if (fileIdx !== -1) {
              const updatedFiles = [...message.files];
              updatedFiles[fileIdx] = {
                ...updatedFiles[fileIdx],
                fileUrl,
              };

              messages[msgIdx] = {
                ...message,
                files: updatedFiles,
              };
            }
          }
        }

        return {
          ...prev,
          messages,
        };
      });
    },
    []
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

    const handleStreamedAIMessageReceived = (
      receivedMessage: StreamedMessage
    ) =>
      addStreamedTokensToMessage(
        receivedMessage.id,
        receivedMessage.conversation_id,
        receivedMessage.content
      );

    const handleStreamedAIReasoningMessageReceived = (
      receivedMessage: StreamedReasoningMessage
    ) =>
      addStreamedTokensToReasoning(
        receivedMessage.id,
        receivedMessage.conversation_id,
        receivedMessage.reasoning
      );

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

    const handleDeleteConversation = (deletedConversationId: string) => {
      if (deletedConversationId === conversationId) {
        router.push(`/`);
      }

      fetchConversations();
    };

    const handleChatMessageFileUpdate = (
      receivedMessage: UpdateMessageFile
    ) => {
      updateMessageFileUrl(
        receivedMessage.message_id,
        receivedMessage.conversation_id,
        receivedMessage.file_url,
        receivedMessage.file_name
      );
    };

    socket.on(SOCKET_EVENTS.CHAT_AI_MESSAGE, handleAIMessageReceived);
    socket.on(SOCKET_EVENTS.CHAT_AI_STREAM, handleStreamedAIMessageReceived);
    socket.on(
      SOCKET_EVENTS.CHAT_AI_REASONING_STREAM,
      handleStreamedAIReasoningMessageReceived
    );
    socket.on(SOCKET_EVENTS.CHAT_USER_CREATE, handleUserMessageCreated);
    socket.on(SOCKET_EVENTS.CHAT_TITLE_CREATE, handleConversationTitleCreated);
    socket.on(SOCKET_EVENTS.CHAT_DELETE_CONVERSATION, handleDeleteConversation);
    socket.on(
      SOCKET_EVENTS.CHAT_MESSAGE_FILE_UPDATE,
      handleChatMessageFileUpdate
    );

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_AI_MESSAGE, handleAIMessageReceived);
      socket.off(SOCKET_EVENTS.CHAT_AI_STREAM, handleStreamedAIMessageReceived);
      socket.off(
        SOCKET_EVENTS.CHAT_AI_REASONING_STREAM,
        handleStreamedAIReasoningMessageReceived
      );
      socket.off(SOCKET_EVENTS.CHAT_USER_CREATE, handleUserMessageCreated);
      socket.off(
        SOCKET_EVENTS.CHAT_TITLE_CREATE,
        handleConversationTitleCreated
      );
      socket.off(
        SOCKET_EVENTS.CHAT_DELETE_CONVERSATION,
        handleDeleteConversation
      );
      socket.off(
        SOCKET_EVENTS.CHAT_MESSAGE_FILE_UPDATE,
        handleChatMessageFileUpdate
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
        streamingMessageId,
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
