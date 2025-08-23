import { Author } from '../enums';

export interface Conversation {
  userId: string;
  title: string;
  hasGeneratedTitle: boolean;
  hasFilesUploaded: boolean;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type Conversations = Conversation[];

export enum MessageStatus {
  SUCCESS = 'success',
  LOADING = 'loading',
  FAILED = 'failed',
}

export interface Message {
  conversationId: string;
  content: string;
  timestamp: string;
  author: Author;
  status: MessageStatus;
  id: string;
}

export interface StreamedMessage {
  content: string;
  id: string;
  conversation_id: string;
}

export interface ConversationDetail {
  userId: string;
  title: string;
  hasGeneratedTitle: boolean;
  hasFilesUploaded: boolean;
  id: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}
