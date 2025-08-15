import React from 'react';
import styled from 'styled-components';
import ChatHistory from './children/chatHistory/chatHistory';
import Chat from './children/chat/chat';

interface ConversationLayoutProps {
  conversationId?: string;
}

const ConversationLayout = ({ conversationId }: ConversationLayoutProps) => {
  return (
    <LayoutContainer>
      <ChatHistory />
      <Chat />
    </LayoutContainer>
  );
};

const LayoutContainer = styled.main`
  max-height: 100vh;
  display: flex;
  overflow: hidden;
`;

export default ConversationLayout;
