'use client';

import React, { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { Author } from '@/types/enums';
import { Alert } from 'antd';
import ReactMarkdown from 'react-markdown';
import {
  Message as MessageType,
  MessageStatus,
} from '@/types/api/conversation';
import AIMessage from './aiMessage';
import UserMessage from './userMessage';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import CodeBlock from '@/components/molecules/codeBlock';

interface MessageProps {
  message: MessageType;
  isStreaming?: boolean;
}

interface MessageContentProps {
  author: Author;
  message: string;
  isStreaming: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
  children?: React.ReactNode;
}

const Message = ({ message, isStreaming = false }: MessageProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isMessageLoading =
    !message.content && message.status !== MessageStatus.FAILED;

  useEffect(() => {
    if (isStreaming && message.content && contentRef.current) {
      const chatContainer = contentRef.current.closest('[data-chat-container]');
      if (chatContainer) {
        const isScrolledToBottom =
          chatContainer.scrollTop + chatContainer.clientHeight >=
          chatContainer.scrollHeight - 100;

        if (isScrolledToBottom) {
          requestAnimationFrame(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
          });
        }
      }
    }
  }, [message.content, isStreaming]);

  return (
    <MessageContainer
      key={message.id}
      ref={messageRef}
      $author={message.author as Author}
      $isLoading={isMessageLoading}
      $isStreaming={isStreaming}
    >
      {message.author === Author.AI && (
        <AIMessage
          message={message}
          isMessageLoading={isMessageLoading}
          isStreaming={isStreaming}
          contentRef={contentRef}
        />
      )}
      {message.author === Author.USER && (
        <UserMessage
          message={message}
          isMessageLoading={isMessageLoading}
          isStreaming={isStreaming}
          contentRef={contentRef}
        />
      )}
    </MessageContainer>
  );
};

export const MessageContent = ({
  author,
  message,
  isStreaming,
  ref,
  children,
}: MessageContentProps) => {
  return (
    <Content ref={ref} $author={author} $isStreaming={isStreaming}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          code: CodeBlock,
        }}
      >
        {message}
      </ReactMarkdown>
      {children}
    </Content>
  );
};

const MessageContainer = styled.div<{
  $author: Author;
  $isLoading: boolean;
  $isStreaming: boolean;
}>`
  display: flex;
  width: 100%;
  min-height: fit-content;

  ${({ $author }) =>
    $author === Author.AI
      ? css`
          justify-content: flex-start;
        `
      : css`
          justify-content: flex-end;
        `}

  ${({ $isLoading }) =>
    $isLoading &&
    css`
      align-items: center;
      gap: var(--gap-4);
    `}

  ${({ $isStreaming }) =>
    $isStreaming &&
    css`
      contain: layout;
    `}
`;

export const Content = styled.div<{
  $author: Author;
  $isStreaming: boolean;
}>`
  padding: var(--gap-3);
  border-radius: var(--border-radius-large);
  font-family: var(--font-family-1);
  font-size: var(--font-size-body);
  line-height: var(--line-height-body);
  color: var(--text-primary);
  word-break: break-word;
  position: relative;

  ${({ $isStreaming }) =>
    $isStreaming &&
    css`
      will-change: auto;
      transform: translateZ(0);
    `}

  p {
    margin: 0 0 var(--spacing) 0;
  }

  p:last-child {
    margin-bottom: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-regular);
    margin: var(--gap-6) 0 var(--gap-3);
    color: var(--text-primary);
  }
  h1 {
    font-size: var(--font-size-large);
  }
  h2 {
    font-size: var(--font-size-medium);
  }
  h3 {
    font-size: var(--font-size-regular);
  }
  h4,
  h5,
  h6 {
    font-size: var(--font-size-small);
    font-weight: var(--font-weight-semi-bold);
  }

  a {
    color: var(--accent-tertiary);
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color 0.2s ease;
  }
  a:hover {
    color: var(--accent-tertiary);
    opacity: 0.7;
  }

  ul,
  ol {
    margin: 0 0 var(--gap-4) var(--gap-6);
    padding: 0;
  }
  li {
    margin-bottom: var(--gap-1);
    display: list-item;
    list-style-position: outside;
    list-style-type: disc;
  }
  ul li::marker {
    color: var(--accent-secondary);
  }
  ol li::marker {
    color: var(--accent-primary);
    font-weight: var(--font-weight-semi-bold);
  }

  blockquote {
    border-left: 4px solid var(--accent-secondary);
    padding: var(--gap-2) var(--gap-4);
    margin: var(--gap-4) 0;
    background-color: var(--bg-tertiary);
    color: var(--text-secondary);
    font-style: italic;
  }

  code {
    font-family: var(--font-family-2);
    background-color: var(--bg-secondary);
    padding: var(--gap-0) var(--gap-1);
    border-radius: 4px;
    font-size: 0.95em;
    color: var(--accent-tertiary);
  }

  pre {
    font-family: var(--font-family-2);
    background-color: var(--bg-secondary);
    padding: var(--gap-4);
    border-radius: var(--border-radius-medium);
    overflow-x: auto;
    margin: var(--gap-4) 0;
    font-size: 0.95em;
    line-height: 1.5;
    border: 1px solid var(--border-secondary);
  }
  pre code {
    background: none;
    padding: 0;
    color: var(--text-primary);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: var(--gap-4) 0;
    font-size: var(--font-size-small);
  }
  th,
  td {
    border: 1px solid var(--border-secondary);
    padding: var(--gap-2);
    text-align: left;
  }
  th {
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
    font-weight: var(--font-weight-semi-bold);
  }
  tr:nth-child(even) {
    background-color: var(--bg-secondary);
  }

  hr {
    border: none;
    border-top: 1px solid var(--border-secondary);
    margin: var(--gap-6) 0;
  }

  img {
    max-width: 100%;
    border-radius: 6px;
    margin: var(--gap-2) 0;
  }

  ${({ $author }) =>
    $author === Author.AI
      ? css`
          max-width: 100%;
          background-color: transparent;
          padding: var(--gap-3) 0;
        `
      : css`
          max-width: 80%;
          background-color: var(--bg-quaternary);
          display: flex;
          flex-direction: column;
          gap: var(--spacing);

          p {
            margin: 0;
          }
        `}
`;

export const MessageError = styled(Alert)`
  margin-left: var(--gap-4);
  font-family: var(--font-family-1);

  &.ant-alert-error {
    background-color: var(--bg-quaternary);
    border: none;
  }

  .ant-alert-message,
  .ant-alert-description {
    color: var(--text-primary) !important;
  }

  .ant-alert-message {
    font-weight: var(--font-weight-bold);
  }
`;

export default Message;
