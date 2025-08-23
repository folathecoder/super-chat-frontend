import React, {
  RefObject,
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react';
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
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
};

const Chat = () => {
  const router = useRouter();
  const {
    conversation,
    fetchConversations,
    loadingConversation,
    streamingMessageId,
  } = useConversation();
  const { messages, title, id } = conversation || {};

  const scrollbarRef = useRef<ScrollbarRef | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>(null);
  const lastMessageCountRef = useRef(messages?.length || 0);

  const scrollNearBottom = useCallback((offsetFromBottom: number = 350) => {
    if (!scrollbarRef.current) return;

    requestAnimationFrame(() => {
      const { scrollHeight, clientHeight } = scrollbarRef.current!;
      scrollbarRef.current!.scrollTop =
        scrollHeight - clientHeight - offsetFromBottom;
    });
  }, []);

  const isNearBottom = useCallback(() => {
    const scrollbar = scrollbarRef.current;
    if (!scrollbar) return false;

    const threshold = 600;

    return (
      scrollbar.scrollHeight - scrollbar.scrollTop - scrollbar.clientHeight <
      threshold
    );
  }, []);

  const handleScroll = useCallback(() => {
    const wasNearBottom = isNearBottom();
    setShouldAutoScroll(wasNearBottom);
    setIsUserScrolling(true);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 150);
  }, [isNearBottom]);

  const scrollToBottom = useCallback(
    (force = false) => {
      if (!scrollbarRef.current) return;

      if (shouldAutoScroll || force) {
        requestAnimationFrame(() => {
          scrollbarRef.current?.scrollToBottom();
        });
      }
    },
    [shouldAutoScroll]
  );

  const handleScrollToBottomClick = () => {
    setShouldAutoScroll(true);
    scrollToBottom();
  };

  useEffect(() => {
    const currentMessageCount = messages?.length || 0;
    const hasNewMessages = currentMessageCount > lastMessageCountRef.current;

    if (hasNewMessages && !isUserScrolling) {
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 50);

      lastMessageCountRef.current = currentMessageCount;
      return () => clearTimeout(timeoutId);
    }

    lastMessageCountRef.current = currentMessageCount;
  }, [messages, isUserScrolling, scrollToBottom]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (id) {
      scrollNearBottom(350);
    }
  }, [id]);

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
            onScroll={handleScroll}
            disableDefaultStyles={false}
            trackYProps={{
              style: {
                background: 'var(--bg-secondary)',
                borderRadius: '3px',
                width: '6px',
                right: '2px',
              },
            }}
            thumbYProps={{
              style: {
                background: 'var(--border-secondary)',
                borderRadius: '3px',
                cursor: 'pointer',
              },
            }}
            momentum={false}
            noDefaultStyles={false}
            contentProps={{
              style: {
                scrollBehavior: 'smooth',
              },
            }}
          >
            {messages && messages?.length > 0 ? (
              <ConversationList>
                {messages?.map((message) => (
                  <MessageWrapper
                    key={message.id}
                    $isStreaming={message.id === streamingMessageId}
                  >
                    <Message
                      message={message}
                      isStreaming={message.id === streamingMessageId}
                    />
                  </MessageWrapper>
                ))}
              </ConversationList>
            ) : (
              <Prompts />
            )}
          </Scrollbar>
        )}
      </Conversation>
      <ChatForm
        shouldAutoScroll={shouldAutoScroll}
        handleScrollToBottomClick={handleScrollToBottomClick}
        scrollNearBottom={scrollNearBottom}
      />
    </ChatContainer>
  );
};

const ChatContainer = styled.section`
  flex: 1;
  background-color: var(--bg-primary);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
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
  flex-shrink: 0;

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
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-tertiary);
  }

  svg {
    font-size: var(--font-size-body);
  }

  span {
    font-size: var(--font-size-small);
    font-family: var(--font-family-1);
  }
`;

const Conversation = styled.section`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;

const ConversationList = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--gap-4);
  display: flex;
  flex-direction: column;
  gap: var(--gap-4);
  margin-bottom: 500px;
  min-height: min-content;
  width: 100%;
`;

const MessageWrapper = styled.div<{ $isStreaming: boolean }>`
  ${({ $isStreaming }) =>
    $isStreaming &&
    `
    contain: layout style;
    will-change: contents;
  `}
`;

const ScrollToBottomButton = styled.button`
  position: absolute;
  bottom: 120px;
  right: 20px;
  background: var(--accent-secondary);
  color: var(--text-primary);
  border: none;
  border-radius: var(--border-radius-xLarge);
  padding: var(--gap-2) var(--gap-4);
  font-size: var(--font-size-small);
  font-family: var(--font-family-1);
  cursor: pointer;
  box-shadow: 0 2px 12px var(--shadow-1);
  transition: all 0.2s ease;
  z-index: 10;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  &:hover {
    background: var(--accent-primary);
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px var(--shadow-2);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default Chat;
