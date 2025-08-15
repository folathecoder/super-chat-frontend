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
import { Conversations, ConversationDetail } from '@/types/api/conversation';
import {
  getConversations,
  getConversation,
} from '@/services/conversation.service';

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
