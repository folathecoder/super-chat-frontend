import { useState, useRef, useEffect } from 'react';
import { Typography } from 'antd';
import styled from 'styled-components';

const { Paragraph } = Typography;

interface TruncateTextProps {
  children: string;
  rows?: number;
}

const TruncateText = ({ children, rows = 1 }: TruncateTextProps) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);

  const paragraphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (!paragraphRef.current) return;

      const lineHeight = parseFloat(
        getComputedStyle(paragraphRef.current).lineHeight
      );

      const newMaxHeight = lineHeight * rows;
      setMaxHeight(newMaxHeight);
    };

    updateHeight();

    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [rows]);

  return (
    <StyledParagraph
      ref={paragraphRef}
      $rows={rows}
      $maxHeight={maxHeight}
      ellipsis={{
        rows,
        expandable: false,
        symbol: null,
        onEllipsis: (ellipsis) => setIsTruncated(ellipsis),
      }}
    >
      {children}
    </StyledParagraph>
  );
};

const StyledParagraph = styled(Paragraph)<{
  $rows: number;
  $maxHeight?: number;
}>`
  && {
    display: -webkit-box !important;
    -webkit-line-clamp: ${({ $rows }) => $rows};
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    font-family: var(--font-family-1);
    margin-bottom: 0;

    max-height: ${({ $maxHeight }) =>
      $maxHeight ? `${$maxHeight}px` : 'none'};
    transition: max-height 0.3s ease;
  }

  .ant-typography-ellipsis-single-line {
    white-space: normal !important;
  }

  .ant-typography-ellipsis {
    display: none;
    cursor: default;
  }
`;

export default TruncateText;
