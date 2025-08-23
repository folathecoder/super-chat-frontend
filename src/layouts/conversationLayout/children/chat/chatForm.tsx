'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  Tooltip,
  Button,
  message,
  Upload,
  Form,
  Input,
  message as antdMessage,
} from 'antd';
import SendIcon from '@mui/icons-material/Send';
import { useParams, useRouter } from 'next/navigation';
import type { UploadProps } from 'antd';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import AttachmentIcon from '@mui/icons-material/Attachment';
import DeleteIcon from '@mui/icons-material/Delete';
import { createMessage } from '@/services/message.service';
import { startConversation } from '@/services/conversation.service';
import { Author } from '@/types/enums';
import { useConversation } from '@/providers/conversationProvider';
import type { UploadFile, UploadFileStatus } from 'antd/es/upload/interface';
import TruncateText from '@/components/atoms/textTruncate';
import { VERSION, BASE_URL } from '@/lib/clients/apiClient';

const { TextArea } = Input;

interface ChatFormProps {
  shouldAutoScroll: boolean;
  handleScrollToBottomClick: () => void;
  scrollNearBottom: (offsetFromBottom?: number) => void;
}

interface ChatFormValues {
  message: string;
}

interface FileIdWithType {
  id: string;
  type: string;
  status: UploadFileStatus;
}

interface FileInfo {
  fileId: string;
  url: string;
  fileName?: string;
}

interface UploadStatus {
  [uid: string]: boolean;
}

const getFileName = (url: string): string => {
  const matches = url.match(/^.*?([^/]+$)$/);
  if (matches) {
    return matches[1];
  }
  return url;
};

const ChatForm = ({
  shouldAutoScroll,
  handleScrollToBottomClick,
  scrollNearBottom,
}: ChatFormProps) => {
  const {
    conversation,
    chatMessage,
    setChatMessage,
    addMessageToConversation,
  } = useConversation();
  const [formInstance] = Form.useForm<ChatFormValues>();
  const routeParameters = useParams();
  const router = useRouter();
  const conversationId = routeParameters?.conversationId as string;

  const initialFiles: FileInfo[] = [];
  const fileToFileIdMap = useRef<Record<string, FileIdWithType>>({}).current;

  const [fileIds, setFileIds] = useState<string[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({});

  useEffect(() => {
    formInstance.setFieldsValue({ message: chatMessage });
  }, [chatMessage, formInstance]);

  useEffect(() => {
    if (initialFiles?.length) {
      const initialFileList: UploadFile[] = [];
      for (const file of initialFiles) {
        initialFileList.push({
          uid: file.fileId,
          url: file.url,
          status: 'done',
          name: file.fileName || getFileName(file.url),
        });
        fileToFileIdMap[file.fileId] = {
          id: file.fileId,
          type: 'FILE',
          status: 'done',
        };
      }
      setFileList(initialFileList);
    }
  }, [initialFiles, fileToFileIdMap]);

  useEffect(() => {
    setFileIds(fileList.map((f) => fileToFileIdMap[f.uid].id));
  }, [fileList, fileToFileIdMap]);

  const convertToMarkdown = (text: string): string => {
    let markdown = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    markdown = markdown.replace(/(https?:\/\/[^\s]+)/g, '[$1]($1)');
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '**$1**');
    markdown = markdown.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '*$1*');
    markdown = markdown.replace(/```([\s\S]*?)```/g, '```$1```');
    markdown = markdown.replace(/`([^`]+)`/g, '`$1`');

    return markdown;
  };

  const handleFormSubmit = async () => {
    try {
      const conversationIdToUse =
        conversationId || (await startConversation()).id;

      router.push(`/conversation/${conversationIdToUse}`);

      if (!conversationIdToUse) {
        throw new Error('Failed to start or retrieve conversation');
      }

      const createdMessage = await createMessage(conversationIdToUse, {
        content: chatMessage.trim(),
        author: Author.USER,
      });

      if (createdMessage && conversation) {
        handleScrollToBottomClick();
        addMessageToConversation(conversation, createdMessage);
      }

      resetFormFields();
    } catch (error) {
      console.error('Failed to send message', error);
      antdMessage.error('Failed to send message.');
    }
  };

  const resetFormFields = () => {
    formInstance.resetFields();
    setChatMessage('');
    setFileList([]);
    setFileIds([]);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    const pastedText = e.clipboardData.getData('text');
    const markdownText = convertToMarkdown(pastedText);

    // Get current cursor position
    const target = e.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;

    // Insert the markdown text at cursor position
    const currentValue = chatMessage;
    const newValue =
      currentValue.substring(0, start) +
      markdownText +
      currentValue.substring(end);

    setChatMessage(newValue);

    formInstance.setFieldValue('message', newValue);

    setTimeout(() => {
      target.selectionStart = target.selectionEnd = start + markdownText.length;
      target.focus();
    }, 0);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setChatMessage(value);
    formInstance.setFieldValue('message', value);
  };

  const handleRemove = (file: UploadFile) => {
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    delete fileToFileIdMap[file.uid];
    setFileIds(Object.values(fileToFileIdMap).map((f) => f.id));
    setUploadStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[file.uid];
      return newStatus;
    });
  };

  const uploadProps: UploadProps = {
    name: 'file',
    action: `${BASE_URL}/api/${VERSION}/files/upload`,
    headers: { authorization: 'authorization-text' },
    multiple: true,
    maxCount: 4,
    fileList,
    disabled: fileList.length === 4,
    onChange(info) {
      const updatedList = info.fileList.map((file) => {
        if (file.response) {
          file.uid = file.response.id || file.uid;
          file.status = 'done';
        }
        return file;
      });

      setFileList(updatedList);

      const newMap: Record<string, FileIdWithType> = {};
      updatedList.forEach((f) => {
        newMap[f.uid] = {
          id: f.uid,
          type: 'FILE',
          status: f.status,
        };
      });
      Object.assign(fileToFileIdMap, newMap);
      setFileIds(Object.values(fileToFileIdMap).map((f) => f.id));

      const lastFile = info.file;
      if (lastFile.status === 'done') {
        message.success(`${lastFile.name} uploaded successfully`);
      } else if (lastFile.status === 'error') {
        message.error(`${lastFile.name} upload failed.`);
      }
    },
    onRemove(file) {
      handleRemove(file);
      return true;
    },
  };

  return (
    <ChatFormContainer>
      {!shouldAutoScroll && (
        <ScrollToBottomButton onClick={() => scrollNearBottom(350)}>
          ↓ New messages
        </ScrollToBottomButton>
      )}
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
              onChange={handleInputChange}
              onPaste={handlePaste}
              onPressEnter={(event) => {
                if (!event.shiftKey) {
                  event.preventDefault();
                  formInstance.submit();
                }
              }}
            />
          </Form.Item>
          <Tooltip title="Upload a maximum of 4 files" placement="top">
            <StyledUpload {...uploadProps}>
              <Button icon={<FileUploadOutlinedIcon />} />
            </StyledUpload>
          </Tooltip>
          <SendButton type="submit" disabled={!chatMessage.trim()}>
            <SendIcon style={{ fontSize: 20 }} />
          </SendButton>
        </StyledForm>
        {fileList.length > 0 && (
          <FileListContainer>
            <FileList>
              {fileList.map((file) => (
                <FileListItem key={file.uid} $fileStatus={file.status}>
                  <FileListContent className="file-list-content">
                    <AttachmentIcon />
                    <FileListName>{file.name}</FileListName>
                  </FileListContent>
                  <FileListDelete
                    onClick={() => handleRemove(file)}
                    className={'file-list-delete'}
                  >
                    <DeleteIcon />
                  </FileListDelete>
                </FileListItem>
              ))}
            </FileList>
          </FileListContainer>
        )}
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
  align-items: center;
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
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

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

const StyledUpload = styled(Upload)`
  button {
    background-color: transparent;
    border-color: var(--border-secondary) !important;

    &:hover {
      background-color: transparent !important;
      border-color: var(--border-tertiary) !important;

      svg {
        color: var(--text-secondary) !important;
      }
    }
  }

  svg {
    color: var(--text-primary) !important;
    font-size: var(--font-size-regular);
  }

  .ant-upload-list {
    display: none;
  }

  .ant-upload-disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--gap-1);
  margin-top: var(--gap-1);
`;

const FileListItem = styled.div<{ $fileStatus?: UploadFileStatus }>`
  padding: var(--gap-2);
  border-radius: var(--border-radius-xLarge);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--gap-2);

  svg path {
    fill: transparent !important;
    stroke: var(--text-quaternary) !important;
  }

  ${({ $fileStatus }) =>
    $fileStatus === 'done' &&
    css`
      background-color: var(--tag-upload-success-bg) !important;
      color: var(--tag-upload-success-content) !important;
      border: 1px solid var(--tag-upload-success-border);

      span,
      .ant-typography-ellipsis {
        color: var(--tag-upload-success-content) !important;
      }

      svg:hover path {
        stroke: var(--tag-upload-success-content) !important;
      }

      .file-list-content {
        svg path {
          stroke: var(--tag-upload-success-content) !important;
        }
      }
    `}

  ${({ $fileStatus }) =>
    $fileStatus === 'error' &&
    css`
      background-color: var(--tag-error-bg);
      color: var(--tag-error-text) !important;
      border: 1px solid var(--tag-error-border);

      span {
        color: var(--tag-error-text) !important;
      }

      svg:hover path {
        stroke: var(--tag-error-text) !important;
      }

      .file-list-content {
        svg path {
          stroke: var(--tag-error-text) !important;
        }
      }
    `}

  ${({ $fileStatus }) =>
    $fileStatus === 'uploading' &&
    css`
      background-color: var(--tag-promo-bg);
      color: var(--tag-promo-text) !important;
      border: 1px solid var(--tag-promo-border);

      span {
        color: var(--tag-promo-text) !important;
      }

      svg:hover path {
        stroke: var(--tag-promo-text) !important;
      }

      .file-list-content {
        svg path {
          stroke: var(--tag-promo-text) !important;
        }
      }
    `}
`;

const FileListContent = styled.div`
  display: flex;
  align-items: center;
  gap: var(--gap-2);
`;

const FileListName = styled(TruncateText)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

const FileListDelete = styled.div`
  cursor: pointer;
  display: grid;
  place-items: center;

  svg path {
    stroke: var(--text-secondary) !important;
  }
`;

const FileListContainer = styled.div``;

const ScrollToBottomButton = styled.button`
  position: fixed;
  transform: translateY(-60px);
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

  &:hover {
    background: var(--accent-primary);
    opacity: 0.9;
    transform: translateY(-55px);
    box-shadow: 0 4px 16px var(--shadow-2);
  }
`;

export default ChatForm;
