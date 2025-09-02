import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Author } from '@/types/enums';
import { Message, MessageStatus } from '@/types/api/conversation';
import { useAuth } from '@/providers/authenticationProvider';
import { Spin } from 'antd';
import Loader from '@/components/atoms/loader';
import { MessageContent, MessageError } from './message';
import { LoadingOutlined } from '@ant-design/icons';
import AttachFileIcon from '@mui/icons-material/AttachFile';

interface UserMessageProps {
  message: Message;
  isStreaming: boolean;
  isMessageLoading: boolean;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const UserMessage = ({
  message,
  isMessageLoading,
  isStreaming,
  contentRef,
}: UserMessageProps) => {
  const errorTitle = 'Message failed to send';
  const errorMessage =
    'Your message could not be delivered. Check your connection or try again.';

  const { user } = useAuth();

  return (
    <MessageContainer>
      {message.content && (
        <MessageContent
          ref={contentRef}
          author={message.author as Author}
          message={message.content ?? ''}
          isStreaming={isStreaming}
        >
          {!!message.files?.length && (
            <MessageFileList>
              {message.files.map((file, index) => (
                <MessageFile
                  href={file.fileUrl ?? ''}
                  target="_blank"
                  key={`${file.fileName}_${index}`}
                >
                  <AttachFileIcon />
                  <div>{file.fileName}</div>
                  {!file.fileUrl && (
                    <MessageFileLoader>
                      <Spin
                        indicator={
                          <LoadingOutlined style={{ fontSize: 20 }} spin />
                        }
                        size="small"
                      />
                    </MessageFileLoader>
                  )}
                </MessageFile>
              ))}
            </MessageFileList>
          )}
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
    </MessageContainer>
  );
};

const MessageContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const MessageFileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--gap-2);
`;

const MessageFile = styled(Link)`
  background-color: var(--bg-tertiary);
  border-radius: var(--border-radius-medium);
  padding: var(--gap-2);
  display: flex;
  align-items: center;
  gap: var(--gap-2);
  border: 1px solid var(--border-secondary);
  font-size: var(--font-size-small);
  line-height: var(--line-height-small);
  color: var(--text-tertiary) !important;
  position: relative;
  box-shadow: var(--shadow-1);
`;

const MessageFileLoader = styled.div`
  border-radius: var(--border-radius-medium);
  background-color: var(--bg-blur-tertiary);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: var(--gap-2);
`;

export default UserMessage;
