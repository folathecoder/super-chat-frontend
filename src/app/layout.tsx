'use client';
import { Suspense } from 'react';
import StyledComponentsRegistry from '@/lib/registry';
import { ThemeProvider, ConversationProvider, AuthProvider } from '@/providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          <AuthProvider>
            <ThemeProvider>
              <ConversationProvider>
                <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
              </ConversationProvider>
            </ThemeProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
