import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const searchList = [
  'AI stethoscope 15 second heart detection',
  'AI stethoscope',
  'AI stethoscope technology short detection time',
  'AI stethoscope 15 second heart detection',
  'AI stethoscope rapid heart sound analysis',
  'AI stethoscope',
];

const MessageSearch = () => {
  return (
    <SearchContainer>
      <SearchSubHeader>Keywords (6)</SearchSubHeader>
      <SearchList>
        {searchList.map((search, index) => (
          <SearchListItem key={index}>
            <SearchOutlinedIcon />
            <div>{search}</div>
          </SearchListItem>
        ))}
      </SearchList>
      <SearchSubHeader>Sources (6)</SearchSubHeader>
      <SourceListContainer>
        <SourceList>
          {searchList.map((search, index) => (
            <SourceListItem key={index} href={'/'} target="_blank">
              <SourceListItemLeft>
                <SourceListIcon />
                <p>
                  Analyzing a 15-second heart sound clip to detect potential
                  signs of cardiac abnormalities.
                </p>
              </SourceListItemLeft>
              <SourceListItemRight>google.com</SourceListItemRight>
            </SourceListItem>
          ))}
        </SourceList>
      </SourceListContainer>
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  padding: var(--gap-3) 0;
`;

const SearchSubHeader = styled.h3`
  font-size: var(--font-size-ultra-small);
  line-height: var(--line-height-small);
  margin-bottom: var(--gap-2);
  font-weight: var(--font-weight-light);
  color: var(--text-secondary);
`;

const SearchList = styled.ul`
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-1);
  margin-bottom: var(--gap-2);
`;

const SearchListItem = styled.li`
  background-color: var(--bg-quaternary);
  max-width: fit-content;
  padding: var(--gap-1) var(--gap-2);
  border-radius: var(--border-radius-large);
  font-family: var(--font-family-1);
  font-size: var(--font-size-ultra-small);
  display: flex;
  align-items: center;
  gap: var(--gap-1);
  color: var(--text-quaternary);
  border: 1px solid var(--border-secondary);

  svg {
    font-size: var(--font-size-small);
  }
`;

const SourceListContainer = styled.div`
  max-width: 100%;
  background-color: var(--bg-quaternary);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--border-secondary);
  padding: var(--gap-1) var(--gap-2);
`;

const SourceList = styled.ul`
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap-3);
`;

const SourceListItem = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-2);
  font-family: var(--font-family-1);
  font-size: var(--font-size-ultra-small);
  max-width: 100%;
  color: var(--text-quaternary);

  p {
    font-family: var(--font-family-1);
    font-size: var(--font-size-ultra-small);
  }
`;

const SourceListIcon = styled.div`
  background-color: var(--bg-secondary);
  width: 20px;
  height: 20px;
  border-radius: 100%;
  border: 1px solid var(--border-secondary);
`;

const SourceListItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--gap-2);
`;

const SourceListItemRight = styled.div``;

export default MessageSearch;
