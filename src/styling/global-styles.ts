'use client';

import { createGlobalStyle } from 'styled-components';
import {
  colorVariables,
  fontVariables,
  gapVariables,
  shapeVariables,
} from '@/styling/variables';
import type { Theme } from '@/types/theme/theme';

export const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
    :root {
      ${({ theme }) => colorVariables({ theme })}
      ${() => fontVariables()}
      ${() => gapVariables()}
      ${() => shapeVariables()}
    }

    *, html {
      margin: 0;
      border: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-family-1);
      font-size: var(--font-size-body);
      background-color: var(--bg-primary);
      color: var(--text-secondary);
      font-weight: var(--font-weight-regular);
      width: 100%;
      position: relative;
    }

    h1 {
      font-size: var(--font-size-extra-large);
      line-height: var(--line-height-extra-large);
      font-family: var(--font-family-1);
      font-weight: var(--font-weight-regular);
      text-transform: capitalize;
      color: var(--text-primary);
    }

    h2 {
      font-size: var(--font-size-large);
      line-height: var(--line-height-large);
      font-family: var(--font-family-1);
      font-weight: var(--font-weight-bold);
      text-transform: capitalize;
      color: var(--text-primary);
    }

    h3 {
      font-size: var(--font-size-medium);
      line-height: var( --line-height-medium);
      font-family: var(--font-family-1);
      font-weight: var(--font-weight-bold);
      text-transform: capitalize;
      color: var(--text-primary);
    }

    h4 {
      font-size: var(--font-size-regular);
      line-height: var(--line-height-regular);
      font-family: var(--font-family-1);
      font-weight: var(--font-weight-bold);
      text-transform: capitalize;
      color: var(--text-primary);
    }

    h5 {
      font-size: var(--font-size-body);
      line-height: var(--line-height-body);
      font-family: var(--font-family-1);
      font-weight: var(--font-weight-bold);
      text-transform: capitalize;
      color: var(--text-primary);
    }

    h6 {
      font-size: var(--font-size-small);
      line-height: var(--line-height-small);
      font-family: var(--font-family-1);
      font-weight: var(--font-weight-bold);
      text-transform: capitalize;
      color: var(--text-primary);
    }

    p {
      font-size: var(--font-size-body);
      line-height: var(--line-height-body);
      font-family: var(--font-family-1);
      font-weight: var(--font-weight-regular);
    }

    img, picture {
      display: block;
      object-fit: cover;
      max-width: 100%;
      height: auto;
    }

    ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

    li {
      font-size: var(--font-size-body);
      list-style: none;
      font-family: var(--font-family-1);
      font-weight: var(--font-weight-regular);
    }

    a {
      
      color: var(--link-default);
      text-decoration: none;
      font-family: var(--font-family-1) !important;  
      transition: var(--transition-1) !important; 
    }

    button {
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
      font-size: var(--font-size-body);
      font-family: var(--font-family-1) !important;
      transition: var(--transition-1) !important; 
      background-color: transparent;
    }

    input, textarea, form, select {
      font-family: var(--font-family-1) !important;
      background-color: var(--bg-primary);
      color: var(--text-quaternary);
    }

    input:not([type="checkbox"]), select {
      width: 100%;
      padding: 1.06rem 0.94rem 1.25rem 1.5rem;
      border-radius: var(--border-radius-medium);
      border: 1px solid var(--bg-tertiary);
      font-size: var( --font-size-body);
      font-weight: var(--font-weight-regular);
    }

    input:invalid:focus {
       border-color: var(--error);
    }

    i, svg {
      font-weight: var(--font-weight-light) !important;
    }

  .MuiTooltip-tooltip {
    background: var(--bg-primary) !important;
    border: var(--border-width-1) solid var(--border-tertiary);
    padding: 0 !important;
    box-shadow: none !important;
  }

  .MuiTooltip-arrow {
    background-color: var(--bg-primary) !important;
  }
`;
