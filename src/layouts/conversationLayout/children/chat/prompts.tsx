import React from 'react';
import styled from 'styled-components';

const prompts = [
  { id: 1, question: 'What’s your favorite programming language and why?' },
  { id: 2, question: 'Describe a project you’re most proud of.' },
  { id: 3, question: 'How do you stay updated with the latest tech trends?' },
  { id: 4, question: 'What motivates you to learn new skills every day?' },
];

const Prompts = () => {
  return (
    <PromptsContainer>
      <PromptsInnerContainer>
        <PromptsHeading>
          Hello Folarin! How can I help you today?
        </PromptsHeading>
        <PromptList>
          {prompts.map((prompt) => (
            <PromptListItem key={prompt.id} tabIndex={0}>
              {prompt.question}
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
