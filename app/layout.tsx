import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { Toaster } from 'sonner';
import { getSiteSettings } from "@/lib/data";
import ParticlesBackground from '@/components/ui/ParticlesBackground';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.globalTitle,
    description: settings.globalDescription,
    icons: {
      icon: '/images/favicon.ico',
    },
  };
}



import { HeadScripts } from '@/components/shared/HeadScripts';

import FCMClient from '@/components/FCMClient';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {settings.headScripts && <HeadScripts content={settings.headScripts} />}
      </head>
      <body className={inter.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FCMClient />
          <ParticlesBackground />
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
