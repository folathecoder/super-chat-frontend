import type { Theme } from '@/types/theme/theme';

export const colorVariables = ({ theme }: { theme: Theme }) => `
  --text-primary: ${theme.color.font100}; 
  --text-secondary: ${theme.color.font200};
  --text-tertiary: ${theme.color.font300};
  --text-quaternary: ${theme.color.font400};

  --accent-primary: ${theme.color.accent100};
  --accent-secondary: ${theme.color.accent200};
  --accent-tertiary: ${theme.color.accent300};
  --accent-quaternary: ${theme.color.accent700};

  --bg-primary: ${theme.color.bg100};
  --bg-secondary: ${theme.color.bg200};
  --bg-tertiary: ${theme.color.bg300};
  --bg-quaternary: ${theme.color.bg400};
  --bg-bright: ${theme.color.bg500};

  --bg-blur-primary: rgba(255, 255, 255, 0.2);
  --bg-blur-secondary: rgba(255, 255, 255, 0.3);
  --bg-blur-tertiary: rgba(0, 0, 0, 0.6);

  --border-secondary: ${theme.color.border100};
  --border-tertiary: ${theme.color.border200};

  --link-default: ${theme.color.font500};
  --error: ${theme.color.accent800};

  --tag-progress-text: ${theme.color.accent100}; 
  --tag-progress-border: ${theme.color.accent200};
  --tag-progress-bg: ${theme.color.bg300}; 

  --tag-upload-success-content: ${theme.color.accent600};
  --tag-upload-success-border: ${theme.color.accent600};
  --tag-upload-success-bg: ${theme.color.bg300};

  --tag-done-text: ${theme.color.accent600};
  --tag-done-border: ${theme.color.accent600};
  --tag-done-bg: ${theme.color.bg300};

  --tag-error-text: ${theme.color.accent700};
  --tag-error-border: ${theme.color.accent700};
  --tag-error-bg: ${theme.color.bg300};

  --tag-promo-text: ${theme.color.accent400};
  --tag-promo-border: ${theme.color.accent400};
  --tag-promo-bg: ${theme.color.bg300};
`;

export default colorVariables;
