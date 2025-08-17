'use client';

import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scrollbar } from 'react-scrollbars-custom';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LanguageIcon from '@mui/icons-material/Language';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useConversation } from '@/providers/conversationProvider';
import {
  deleteConversation,
  getConversations,
} from '@/services/conversation.service';

const ChatHistory = () => {
  const router = useRouter();
  const { conversations, conversationId, setConversations } = useConversation();

  const menu = [
    {
      key: 1,
      title: 'Job Hunter',
      iconName: WorkOutlineIcon,
      function: () => {
        console.log('Job Hunter clicked');
      },
    },
    {
      key: 2,
      title: 'Career Coach',
      iconName: PsychologyIcon,
      function: () => {
        console.log('Career Coach clicked');
      },
    },
    {
      key: 3,
      title: 'Skill Builder',
      iconName: SchoolIcon,
      function: () => {
        console.log('Skill Builder clicked');
      },
    },
    {
      key: 4,
      title: 'Language Expert',
      iconName: LanguageIcon,
      function: () => {
        console.log('Language Expert clicked');
      },
    },
    {
      key: 5,
      title: 'Chat Assistant',
      iconName: ChatBubbleOutlineIcon,
      function: () => {
        console.log('Chat Assistant clicked');
      },
    },
  ];

  const handleDeleteConversation = useCallback(async () => {
    if (!conversationId) return;

    try {
      await deleteConversation(conversationId);

      const conversationsData = await getConversations();
      const sortedConversations = [...conversationsData].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setConversations(sortedConversations);
    } catch (err) {
      console.error(
        `Failed to delete conversation with conversationId: ${conversationId}. Please try again; ${String(
          err
        )}`
      );
    }
  }, [conversationId]);

  return (
    <ChatHistoryContainer>
      <ChatHistoryHeader>
        <ChatHistoryHeaderItem>
          <UserProfile />
        </ChatHistoryHeaderItem>
        <ChatHistoryHeaderItem>
          <ViewSidebarOutlinedIcon />
        </ChatHistoryHeaderItem>
      </ChatHistoryHeader>
      <ChatHistoryTitle>Agents</ChatHistoryTitle>
      <ChatHistoryMenu>
        {menu.map((menuItem) => (
          <ChatHistoryMenuItem key={menuItem.key} onClick={menuItem.function}>
            <menuItem.iconName />
            <ChatHistoryMenuItemContent>
              {menuItem.title}
            </ChatHistoryMenuItemContent>
          </ChatHistoryMenuItem>
        ))}
      </ChatHistoryMenu>
      <ChatHistoryTitle>Chats</ChatHistoryTitle>
      <ChatHistoryList>
        <Scrollbar removeTracksWhenNotUsed>
          {conversations.length === 0 ? (
            <EmptyState>
              <ChatBubbleOutlineIcon
                style={{ fontSize: 48, color: 'var(--text-tertiary)' }}
              />
              <EmptyStateText>No conversations yet</EmptyStateText>
              <EmptyStateSubtext>
                Click "New chat" to start a conversation!
              </EmptyStateSubtext>
            </EmptyState>
          ) : (
            conversations.map((conversation, index) => (
              <ChatHistoryListItem
                key={conversation.id}
                $active={conversation.id === conversationId}
              >
                <Link href={`/conversation/${conversation.id}`}>
                  {conversation.title}
                </Link>
                <span>
                  <DeleteOutlineIcon onClick={handleDeleteConversation} />
                </span>
              </ChatHistoryListItem>
            ))
          )}
        </Scrollbar>
      </ChatHistoryList>
    </ChatHistoryContainer>
  );
};

const ChatHistoryContainer = styled.section`
  width: 256px;
  height: 100vh;
  background-color: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--bg-primary);
`;

const ChatHistoryHeader = styled.div`
  flex-shrink: 0;
  padding: var(--gap-4);
  border-bottom: 1px solid var(--bg-primary);
  width: 100%;
  display: flex;
  justify-content: space-between;
  min-height: 70px;
`;

const ChatHistoryHeaderItem = styled.button`
  color: var(--text-secondary);
`;

const UserProfile = styled.div`
  height: 25px;
  width: 25px;
  background: var(--gradient-1);
  border-radius: 100%;
`;

const ChatHistoryMenu = styled.div`
  flex-shrink: 0;
  padding: var(--gap-4);
  display: flex;
  flex-direction: column;
  gap: var(--gap-4);
  border-bottom: 1px solid var(--bg-primary);
`;

const ChatHistoryMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: var(--gap-2);
  width: 100%;
  color: var(--text-secondary);

  svg {
    font-size: var(--font-size-body);
  }
`;

const ChatHistoryMenuItemContent = styled.span`
  font-size: var(--font-size-small);
  font-family: var(--font-family-1);
`;

const ChatHistoryTitle = styled.p`
  font-size: var(--font-size-small);
  font-family: var(--font-family-1);
  padding: var(--gap-4) var(--gap-4) 0 var(--gap-4);
  color: var(--text-tertiary);
`;

const ChatHistoryList = styled.div`
  margin-top: var(--gap-1);
  min-height: 0;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ChatHistoryListItem = styled.div<{ $active: boolean }>`
  padding: var(--gap-3) var(--gap-4);
  white-space: nowrap;
  font-size: var(--font-size-small);
  line-height: var(--line-height-small);
  font-family: var(--font-family-1);
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;

  & > *:first-child {
    flex: 1;
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  ${({ $active }) =>
    $active &&
    css`
      background-color: var(--bg-quaternary);
    `}

  &:hover {
    background-color: var(--bg-quaternary);
  }

  svg {
    font-size: var(--font-size-body);
  }
`;

const EmptyState = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  padding: var(--gap-4);
  text-align: center;
`;

const EmptyStateText = styled.p`
  font-size: var(--font-size-small);
  margin-top: var(--gap-2);
`;

const EmptyStateSubtext = styled.p`
  font-size: var(--font-size-small);
  margin-top: var(--gap-1);
  color: var(--text-quaternary);
`;

export default ChatHistory;
