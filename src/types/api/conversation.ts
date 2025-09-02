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
  reasoning: string | null;
  timestamp: string;
  author: Author;
  status: MessageStatus;
  id: string;
  files?: MessageFile[];
}

export interface MessageFile {
  fileName: string;
  fileExtension: string;
  mimeType: string;
  fileUrl: string | null;
}

export interface UpdateMessageFile {
  conversation_id: string;
  message_id: string;
  file_name: string;
  file_url: string;
}

export interface StreamedMessage {
  content: string;
  id: string;
  conversation_id: string;
}

export interface StreamedReasoningMessage {
  reasoning: string;
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
