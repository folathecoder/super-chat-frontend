'use client';

import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Author } from '@/types/enums';
import Loader from '@/components/atoms/loader';
import { MessageStatus } from '@/types/api/conversation';
import { Alert } from 'antd';
import CodeBlock from '@/components/molecules/codeBlock';
import userInitials from '@/utils/helpers/userInitials';
import { useAuth } from '@/providers/authenticationProvider';

interface MessageProps {
  message: {
    conversationId: string;
    content: string;
    timestamp: string;
    author: string;
    status: string;
    id: string;
  };
}

const Message = ({ message }: MessageProps) => {
  const { user } = useAuth();

  const isMessageLoading =
    !message.content && message.status !== MessageStatus.FAILED;

  const errorTitle =
    message.author === Author.AI
      ? 'Agent failed to respond'
      : 'Message failed to send';

  const errorMessage =
    message.author === Author.AI
      ? 'Something went wrong while generating the Agent response. Please try again.'
      : 'Your message could not be delivered. Check your connection or try again.';

  return (
    <MessageContainer
      key={message.id}
      $author={message.author as Author}
      $isLoading={isMessageLoading}
    >
      {message.author === Author.AI && (
        <MessageAuthor $author={message.author as Author}>AI</MessageAuthor>
      )}
      {message.content && (
        <MessageContent $author={message.author as Author}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
              code: CodeBlock,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </MessageContent>
      )}
      {isMessageLoading && <Loader />}
      {message.status === MessageStatus.FAILED && (
        <MessageError
          message={errorTitle}
          showIcon
          description={errorMessage}
          type="error"
        />
      )}
      {message.author === Author.USER && (
        <MessageAuthor $author={message.author as Author}>
          {userInitials(user?.firstName, user?.lastName)}
        </MessageAuthor>
      )}
    </MessageContainer>
  );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px); /* Optional: adds a slight upward movement */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const MessageContainer = styled.div<{ $author: Author; $isLoading: boolean }>`
  display: flex;
  width: 100%;

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
`;

const MessageAuthor = styled.div<{ $author: Author }>`
  height: 40px;
  width: 40px;
  flex-shrink: 0;
  border-radius: 100%;
  display: grid;
  place-items: center;
  font-size: var(--font-size-regular);
  line-height: var(--line-height-regular);
  font-family: var(--font-family-1);
  font-weight: var(--font-weight-bold);
  text-transform: capitalize;
  color: var(--text-primary);

  ${({ $author }) =>
    $author === Author.AI
      ? css`
          background: var(--gradient-1);
          margin-top: var(--gap-4);
        `
      : css`
          background: var(--accent-quaternary);
          margin-left: var(--gap-2);
        `}
`;

const MessageContent = styled.div<{ $author: Author }>`
  padding: var(--gap-3);
  border-radius: var(--border-radius-medium);
  font-family: var(--font-family-1);
  font-size: var(--font-size-body);
  line-height: var(--line-height-body);
  color: var(--text-primary);
  word-break: break-word;
  animation: ${fadeIn} 0.5s ease forwards;

  p {
    margin: 0 0 var(--spacing) 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-regular);
    margin: 1.5rem 0 0.75rem;
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

const MessageError = styled(Alert)`
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
