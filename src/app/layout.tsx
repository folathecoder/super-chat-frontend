'use client';
import { Suspense } from 'react';
import StyledComponentsRegistry from '@/lib/registry';
import { ThemeProvider } from '@/providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          <ThemeProvider>
            <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
