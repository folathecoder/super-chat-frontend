'use client';

import React, { useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import { Form, Input, message as antdMessage } from 'antd';
import SendIcon from '@mui/icons-material/Send';
import { useParams } from 'next/navigation';

import { createMessage } from '@/services/message.service';
import { Author } from '@/types/enums';
import { useConversation } from '@/providers/conversationProvider';
import {
  Message,
  ConversationDetail,
  Conversation,
  Conversations,
} from '@/types/api/conversation';
import socket from '@/lib/clients/socketClient';
import SOCKET_EVENTS from '@/utils/constants/socketEvents';

const { TextArea } = Input;

interface ChatFormValues {
  message: string;
}

const ChatForm = () => {
  const { conversation, setConversation, conversations, setConversations } =
    useConversation();
  const [formInstance] = Form.useForm<ChatFormValues>();
  const routeParameters = useParams();
  const conversationId = routeParameters?.conversationId as string;
  const [messageInputValue, setMessageInputValue] = useState('');

  const addMessageToConversation = useCallback(
    (
      currentConversation: ConversationDetail,
      newMessage: Message | undefined
    ) => {
      if (!currentConversation || !newMessage) return;

      setConversation((previousConversation) => {
        if (!previousConversation) return previousConversation;

        const existingMessageIndex = previousConversation.messages.findIndex(
          (message) => message.id === newMessage.id
        );

        const updatedMessages =
          existingMessageIndex !== -1
            ? previousConversation.messages.map((message, index) =>
                index === existingMessageIndex ? newMessage : message
              )
            : [...previousConversation.messages, newMessage];

        return { ...previousConversation, messages: updatedMessages };
      });
    },
    [setConversation]
  );

  const updateConversationTitleInList = useCallback(
    (
      currentConversation: ConversationDetail,
      allConversations: Conversations,
      updatedConversationTitle: string
    ) => {
      if (
        !currentConversation ||
        !updatedConversationTitle ||
        !allConversations
      )
        return;

      setConversation((previousConversation) =>
        previousConversation
          ? { ...previousConversation, title: updatedConversationTitle }
          : previousConversation
      );

      setConversations((previousConversations) =>
        previousConversations.map((existingConversation) =>
          existingConversation.id === conversationId
            ? { ...existingConversation, title: updatedConversationTitle }
            : existingConversation
        )
      );
    },
    [setConversation, setConversations, conversationId]
  );

  useEffect(() => {
    if (!conversationId || !conversation || !conversations) return;

    socket.emit('join_room', { conversation_id: conversationId });

    const handleAIMessageReceived = (receivedMessage: Message) =>
      addMessageToConversation(conversation, receivedMessage);

    const handleUserMessageCreated = (receivedMessage: Message) =>
      addMessageToConversation(conversation, receivedMessage);

    const handleConversationTitleCreated = (
      updatedConversation: Conversation
    ) =>
      updateConversationTitleInList(
        conversation,
        conversations,
        updatedConversation.title
      );

    socket.on(SOCKET_EVENTS.CHAT_AI_MESSAGE, handleAIMessageReceived);
    socket.on(SOCKET_EVENTS.CHAT_USER_CREATE, handleUserMessageCreated);
    socket.on(SOCKET_EVENTS.CHAT_TITLE_CREATE, handleConversationTitleCreated);

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_AI_MESSAGE, handleAIMessageReceived);
      socket.off(SOCKET_EVENTS.CHAT_USER_CREATE, handleUserMessageCreated);
      socket.off(
        SOCKET_EVENTS.CHAT_TITLE_CREATE,
        handleConversationTitleCreated
      );
    };
  }, [
    conversationId,
    conversation,
    conversations,
    addMessageToConversation,
    updateConversationTitleInList,
  ]);

  const handleFormSubmit = async () => {
    if (!conversationId) {
      antdMessage.error('No conversation selected.');
      return;
    }

    try {
      const createdMessage = await createMessage(conversationId, {
        content: messageInputValue.trim(),
        author: Author.USER,
      });

      if (createdMessage && conversation) {
        addMessageToConversation(conversation, createdMessage);
      }

      formInstance.resetFields();
      setMessageInputValue('');
    } catch (error) {
      console.error('Failed to send message', error);
      antdMessage.error('Failed to send message.');
    }
  };

  return (
    <ChatFormContainer>
      <BlurredBackground />
      <ChatFormInner>
        <StyledForm
          form={formInstance}
          name="chat_form"
          onFinish={handleFormSubmit}
        >
          <Form.Item name="message">
            <StyledTextArea
              placeholder="Ask me anything"
              autoSize={{ minRows: 1, maxRows: 6 }}
              autoFocus
              variant="borderless"
              value={messageInputValue}
              onChange={(event) => setMessageInputValue(event.target.value)}
              onPressEnter={(event) => {
                if (!event.shiftKey) {
                  event.preventDefault();
                  formInstance.submit();
                }
              }}
            />
          </Form.Item>
          <SendButton type="submit" disabled={!messageInputValue.trim()}>
            <SendIcon style={{ fontSize: 20 }} />
          </SendButton>
        </StyledForm>
      </ChatFormInner>
    </ChatFormContainer>
  );
};

const ChatFormContainer = styled.div`
  position: absolute;
  left: calc(50% + 125px);
  bottom: 0%;
  transform: translate(-50%, -20%);
  bottom: 0;
  width: 800px;
  display: flex;
  justify-content: center;
`;

const BlurredBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-blur-primary);
  box-shadow: var(--shadow-1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid var(--bg-blur-secondary);
  border-radius: var(--border-radius-xLarge);
  z-index: 0;
`;

const ChatFormInner = styled.div`
  position: relative;
  width: 100%;
  border-radius: var(--border-radius-xLarge);
  z-index: 1;
  padding: var(--gap-3);
`;

const StyledForm: typeof Form = styled(Form)`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  border-radius: var(--border-radius-xLarge);

  & > *:first-child {
    flex: 1;
    margin: 0;
  }
`;

const StyledTextArea = styled(TextArea)`
  flex: 1;
  background: transparent !important;
  color: var(--text-secondary);
  resize: none;
  padding: 10px;
  font-size: var(--font-size-base);
  caret-color: var(--accent-quaternary);

  &:focus {
    outline: none;
    box-shadow: none;
  }

  &::placeholder {
    color: var(--text-tertiary);
    opacity: 0.5;
  }
`;

const SendButton = styled.button`
  background-color: var(--primary);
  color: var(--text-primary);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: var(--primary-hover);
  }

  &:disabled {
    background-color: var(--primary);
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

export default ChatForm;
