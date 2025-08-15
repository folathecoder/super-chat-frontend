import React, { RefObject, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Scrollbar } from 'react-scrollbars-custom';
import Message from './message';
import ChatForm from './chatForm';
import Prompts from './prompts';
import { useRouter } from 'next/navigation';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useConversation } from '@/providers/conversationProvider';
import { startConversation } from '@/services/conversation.service';

type ScrollbarRef = {
  scrollToBottom: () => void;
};

const Chat = () => {
  const router = useRouter();
  const { conversation, fetchConversations, loadingConversation } =
    useConversation();
  const { messages, title } = conversation || {};

  const scrollbarRef = useRef<ScrollbarRef | null>(null);

  const handleStartConversation = async () => {
    try {
      const newConversation = await startConversation();

      if (!newConversation.id) {
        throw new Error('Failed to create a new conversation.');
      }

      fetchConversations();
      router.push(`/conversation/${newConversation.id}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  useEffect(() => {
    if (scrollbarRef?.current) {
      scrollbarRef?.current?.scrollToBottom();
    }
  }, [messages]);

  return (
    <ChatContainer>
      <ChatHeader>
        <h1>{title}</h1>
        <NewChatButton onClick={handleStartConversation}>
          <ChatBubbleOutlineIcon />
          <span>New Chat</span>
        </NewChatButton>
      </ChatHeader>
      <Conversation>
        {!loadingConversation && (
          <Scrollbar
            ref={scrollbarRef as RefObject<Scrollbar | ScrollbarRef | null>}
          >
            {messages && messages?.length > 0 ? (
              <ConversationList>
                {messages?.map((message) => (
                  <Message key={message.id} message={message} />
                ))}
              </ConversationList>
            ) : (
              <Prompts />
            )}
          </Scrollbar>
        )}
      </Conversation>
      <ChatForm />
    </ChatContainer>
  );
};

const ChatContainer = styled.section`
  flex: 1;
  background-color: var(--bg-primary);
`;

const ChatHeader = styled.section`
  width: 100%;
  background-color: var(--bg-secondary);
  min-height: 70px;
  padding: var(--gap-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-2);

  h1 {
    font-size: var(--font-size-body);
    line-height: var(--line-height-body);
    font-family: var(--font-family-1);
    font-weight: var(--font-weight-regular);
    color: var(--text-tertiary);
    transition: all 0.3s ease-in-out;
  }
`;

const NewChatButton = styled.button`
  display: flex;
  gap: var(--gap-2);
  align-items: center;
  padding: var(--gap-2);
  border-radius: var(--border-radius-medium);
  color: var(--text-tertiary);
  border: 1px solid var(--text-tertiary);

  svg {
    font-size: var(--font-size-body);
  }

  span {
    font-size: var(--font-size-small);
    font-family: var(--font-family-1);
  }
`;

const Conversation = styled.section`
  width: 100%;
  margin: 0 auto;
  height: 100vh;
  overflow-y: auto;
  scrollbar-width: none;
  position: relative;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ConversationList = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--gap-4);
  display: flex;
  flex-direction: column;
  gap: var(--gap-4);
  margin-bottom: 300px;
`;

export default Chat;
