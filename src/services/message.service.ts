import apiClient from '@/lib/clients/apiClient';
import { Message } from '@/types/api/conversation';

interface CreateMessagePayload {
  files?: File[];
  content: string;
  author: string;
}

export async function createMessage(
  conversationId: string,
  payload: CreateMessagePayload
): Promise<Message> {
  const formData = new FormData();

  if (payload.files && payload.files.length > 0) {
    payload.files.forEach((file) => {
      formData.append('files', file);
    });
  }

  formData.append('content', payload.content);
  formData.append('author', payload.author);

  const response = await apiClient.post<Message>(
    `/messages/${conversationId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}
