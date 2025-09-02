import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';

interface MessagesHeaderProps {
  icon: ReactNode;
  title: string;
  handleClick?: () => void;
}

const MessageHeader = ({ icon, title, handleClick }: MessagesHeaderProps) => {
  return (
    <MessageStepHeader onClick={handleClick} $clickable={!!handleClick}>
      {icon}
      <Title $clickable={!!handleClick}>{title}</Title>
    </MessageStepHeader>
  );
};

const MessageStepHeader = styled.div<{ $clickable: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--gap-2);

  ${({ $clickable }) =>
    $clickable &&
    css`
      cursor: pointer;

      &:hover {
        color: var(--accent-primary);
      }
    `}
`;

const Title = styled.span<{ $clickable: boolean }>`
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-mini-bold);
  color: var(--text-quaternary);
  font-family: var(--font-family-2);

  ${({ $clickable }) =>
    $clickable &&
    css`
      &:hover {
        color: var(--accent-primary);
      }
    `}
`;

export default MessageHeader;
