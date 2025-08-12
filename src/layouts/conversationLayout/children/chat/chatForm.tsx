import React from 'react';
import styled from 'styled-components';
import { Form, Input } from 'antd';
import SendIcon from '@mui/icons-material/Send';

const { TextArea } = Input;

interface ChatFormValues {
  message: string;
}

const ChatForm = () => {
  const [form] = Form.useForm<ChatFormValues>();

  const onFinish = (values: ChatFormValues) => {
    console.log('Form Submitted:', values);
    form.resetFields();
  };

  return (
    <ChatFormContainer>
      <BlurredBackground />
      <ChatFormInner>
        <StyledForm form={form} name="chat_form" onFinish={onFinish}>
          <StyledTextArea
            name="message"
            placeholder="Ask me anything"
            autoSize={{ minRows: 1, maxRows: 6 }}
            autoFocus
            variant="borderless"
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                form.submit();
              }
            }}
          />
          <SendButton type="submit">
            <SendIcon style={{ fontSize: 20 }} />
          </SendButton>
        </StyledForm>
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

const StyledForm = styled(Form)`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  border-radius: var(--border-radius-xLarge);
`;

const StyledTextArea = styled(TextArea)`
  flex: 1;
  background: transparent !important;
  color: var(--text-secondary);
  resize: none;
  padding: 10px;
  font-size: var(--font-size-base);
  caret-color: var(--accent-quaternary);

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
`;

export default ChatForm;
