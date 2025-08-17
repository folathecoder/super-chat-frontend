import apiClient from '@/lib/clients/apiClient';
import { User } from '@/types/api/user';

export async function getUser(): Promise<User> {
  const response = await apiClient.get<User>(`/users/me`);
  return response.data;
}
