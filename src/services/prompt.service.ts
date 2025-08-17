import apiClient from '@/lib/clients/apiClient';
import { UserPrompts } from '@/types/api/prompt';

export async function getUserPrompts(): Promise<UserPrompts> {
  const response = await apiClient.get<UserPrompts>(`/prompts`);
  return response.data;
}
