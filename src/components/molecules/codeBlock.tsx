import { useState } from 'react';
import { Button, Tooltip } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';

const CodeBlock = ({
  inline,
  className,
  children,
  ...props
}: {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return !inline && match ? (
    <CodeBlockContainer>
      <div className="code-header">
        <Tooltip title={copied ? 'Copied!' : 'Copy'}>
          <Button
            size="small"
            shape="circle"
            icon={copied ? <CheckOutlined /> : <CopyOutlined />}
            onClick={handleCopy}
          />
        </Tooltip>
      </div>
      <SyntaxHighlighter
        language={match[1]}
        style={oneDark}
        PreTag="div"
        customStyle={{
          borderRadius: '12px',
          padding: '16px',
          margin: '0',
          fontSize: '0.9rem',
        }}
        {...props}
      >
        {codeString}
      </SyntaxHighlighter>
    </CodeBlockContainer>
  ) : (
    <StyledCode className={className} {...props}>
      {children}
    </StyledCode>
  );
};

const CodeBlockContainer = styled.div`
  position: relative;
  margin: 12px 0;
  border-radius: 12px;
  overflow: hidden;

  .code-header {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10;

    button {
      background: var(--bg-tertiary);
      border: none;
      box-shadow: var(--shadow-sm);
      color: var(--text-tertiary);

      &:hover {
        svg path {
          stroke: var(--text-quaternary);
        }
      }
    }
  }
`;

const StyledCode = styled.code`
  background: var(--bg-tertiary);
  border-radius: var(--border-radius-medium);
`;

export default CodeBlock;
