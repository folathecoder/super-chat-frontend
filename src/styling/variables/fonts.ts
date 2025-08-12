import { DM_Sans, Fira_Code } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  display: 'swap',
});

export const fontVariables = () => `
  --font-family-1: ${dmSans.style.fontFamily}, sans-serif;
  --font-family-2: ${firaCode.style.fontFamily}, monospace;
  --font-family-icon: "Material Icons";

  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-mini-bold: 500;
  --font-weight-semi-bold: 600;
  --font-weight-bold: 700;
  --font-weight-extra-bold: 800;

  --font-size-extra-large: 5.38rem;
  --font-size-semi-large: 2.63rem;
  --font-size-large: 1.63rem;
  --font-size-medium: 1.38rem;
  --font-size-regular: 1.25rem;
  --font-size-body: 1rem;
  --font-size-small: 0.88rem;
  --font-size-ultra-small: 0.75rem;

  --line-height-extra-large: 5.62rem;
  --line-height-large: 3.25rem;
  --line-height-medium: 2rem;
  --line-height-regular: 1.75rem;
  --line-height-body: 1.63rem;
  --line-height-small: 1.2rem;

  --spacing: 0.75rem;
`;

export default fontVariables;
