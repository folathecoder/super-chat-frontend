import apiClient from '@/lib/clients/apiClient';
import {
  Conversations,
  Conversation,
  ConversationDetail,
} from '@/types/api/conversation';

export async function getConversations(): Promise<Conversations> {
  const response = await apiClient.get<Conversations>('/conversations');
  return response.data;
}

export async function startConversation(): Promise<Conversation> {
  const response = await apiClient.post<Conversation>('/conversations');
  return response.data;
}

export async function getConversation(
  conversationId: string
): Promise<ConversationDetail> {
  const response = await apiClient.get<ConversationDetail>(
    `/conversations/${conversationId}`
  );
  return response.data;
}

export async function deleteConversation(
  conversationId: string
): Promise<void> {
  await apiClient.delete<ConversationDetail>(
    `/conversations/${conversationId}`
  );
}
