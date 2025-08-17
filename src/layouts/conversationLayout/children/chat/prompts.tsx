import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useConversation } from '@/providers/conversationProvider';
import { getUserPrompts } from '@/services/prompt.service';
import { UserPrompts } from '@/types/api/prompt';
import { Skeleton } from 'antd';
import { useAuth } from '@/providers/authenticationProvider';

const PLACEHOLDER_COUNT = 4;

const Prompts = () => {
  const { setChatMessage } = useConversation();
  const { user } = useAuth();

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState<UserPrompts | undefined>();

  const fetchUserPrompts = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    try {
      const data = await getUserPrompts();
      setPrompt(data);
    } catch (err) {
      setError(
        `Failed to fetch user prompts. Please try again; ${String(err)}`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserPrompts();
  }, []);

  return (
    <PromptsContainer>
      <PromptsInnerContainer>
        <PromptsHeading>
          {`Hello ${user?.firstName}! How can I help you today?`}
        </PromptsHeading>
        <PromptList>
          {loading
            ? Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
                <PromptListItem key={`prompt-skeleton-${index}`}>
                  <Skeleton active paragraph={{ rows: 1, width: '100%' }} />
                </PromptListItem>
              ))
            : prompt?.prompts.map((prompt) => (
                <PromptListItem
                  key={prompt}
                  tabIndex={0}
                  onClick={() => setChatMessage(prompt)}
                >
                  {prompt}
                </PromptListItem>
              ))}
        </PromptList>
      </PromptsInnerContainer>
    </PromptsContainer>
  );
};

const PromptsContainer = styled.section`
  background: var(--bg-primary);
  min-height: 100vh;
  padding: var(--gap-6) 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PromptsInnerContainer = styled.div`
  max-width: 800px;
  width: 90%;
  margin: 0 auto;
  padding: var(--gap-4);
  box-shadow: var(--shadow-2);
  border-radius: var(--border-radius-xLarge);
  background-color: var(--bg-secondary);
`;

const PromptsHeading = styled.h2`
  color: var(--text-primary);
  margin-bottom: var(--gap-5);
  background: var(--gradient-3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PromptList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--gap-4);
`;

const PromptListItem = styled.button`
  padding: var(--gap-3);
  border-radius: var(--border-radius-medium);
  border: 1.5px solid var(--border-secondary);
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  text-align: left;
  font-weight: 500;
  cursor: pointer;
  box-shadow: var(--shadow-1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease,
    transform 0.15s ease;

  &:hover,
  &:focus-visible {
    background-color: var(--bg-quaternary);
    box-shadow: var(--shadow-3);
    color: var(--text-primary);
    transform: translateY(-3px);
    outline: none;
  }

  &:active {
    transform: translateY(0);
    box-shadow: var(--shadow-1);
  }
`;

export default Prompts;
