import React, { useState } from 'react';
import styled from 'styled-components';
import { Author } from '@/types/enums';
import { Message, MessageStatus } from '@/types/api/conversation';
import { StepProps } from '@mui/material';
import Loader from '@/components/atoms/loader';
import { MessageContent, MessageError } from './message';
import { Steps } from 'antd';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import FaceRetouchingNaturalOutlinedIcon from '@mui/icons-material/FaceRetouchingNaturalOutlined';
import MessageHeader from './children/messageHeader';
import MessageSearch from './children/messageSearch';
import Collapse from '@/components/atoms/collapse';

interface AIMessageProps {
  message: Message;
  isStreaming: boolean;
  isMessageLoading: boolean;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const AIMessage = ({
  message,
  isMessageLoading,
  isStreaming,
  contentRef,
}: AIMessageProps) => {
  const errorTitle = 'Agent failed to respond';
  const errorMessage =
    'Something went wrong while generating the Agent response. Please try again.';

  const [stepsState, setStepsState] = useState({
    reasoningStep: false,
    searchingStep: false,
  });

  const handleToggleStep = (key: keyof typeof stepsState) => {
    setStepsState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const stepItems = [
    message.reasoning && {
      title: (
        <MessageHeader icon={<AutoFixHighIcon />} title="Reading 4 documents" />
      ),
    },
    message.reasoning && {
      title: (
        <MessageHeader
          icon={<MemoryOutlinedIcon />}
          title="Thinking it through"
          handleClick={() => handleToggleStep('reasoningStep')}
        />
      ),
      description: (
        <Collapse isOpen={stepsState.reasoningStep}>
          <MessageReasoning>
            <MessageContent
              ref={contentRef}
              author={message.author as Author}
              message={message.reasoning}
              isStreaming={isStreaming}
            />
          </MessageReasoning>
        </Collapse>
      ),
    },
    message.reasoning && {
      title: (
        <MessageHeader
          icon={<LanguageOutlinedIcon />}
          title="Searching the internet"
          handleClick={() => handleToggleStep('searchingStep')}
        />
      ),
      description: (
        <Collapse isOpen={stepsState.searchingStep}>
          <MessageSearch />
        </Collapse>
      ),
    },
    message.content && {
      title: (
        <MessageHeader
          icon={<FaceRetouchingNaturalOutlinedIcon />}
          title="Generating response"
        />
      ),
      description: (
        <MessageContent
          ref={contentRef}
          author={message.author as Author}
          message={message.content}
          isStreaming={isStreaming}
        />
      ),
    },
  ].filter(Boolean);

  return (
    <MessageContainer>
      <MessageSteps
        progressDot
        current={stepItems.length}
        direction="vertical"
        items={stepItems as StepProps[]}
      />
      {isMessageLoading && <Loader />}
      {message.status === MessageStatus.FAILED && (
        <MessageError
          message={errorTitle}
          showIcon
          description={errorMessage}
          type="error"
        />
      )}
    </MessageContainer>
  );
};

const MessageContainer = styled.div``;

const MessageSteps = styled(Steps)`
  & .ant-steps-item-title {
    color: var(--text-quaternary) !important;
  }

  & .ant-steps-item-description {
    color: var(--text-primary) !important;
  }
`;

const MessageReasoning = styled.div`
  * > p {
    color: var(--text-tertiary) !important;
  }
`;

export default AIMessage;
