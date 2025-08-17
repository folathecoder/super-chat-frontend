import axios, { AxiosInstance } from 'axios';

export const VERSION = 'v1';
export const BASE_URL = 'http://127.0.0.1:8000';

const apiClient: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/${VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
