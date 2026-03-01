import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { Toaster } from 'sonner';
import { getSiteSettings } from "@/lib/data";
import ParticlesBackground from '@/components/ui/ParticlesBackground';
import QueryProvider from '@/components/providers/QueryProvider';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-poppins' });

export const metadata: Metadata = {
  metadataBase: new URL('https://swarn.unitewings.com'),
  title: {
    template: '%s | AI Growth & Journey',
    default: "Swarn Shauryam | AI Growth & Journey",
  },
  description: "Welcome to my personal portfolio and blog. Explore my professional projects, technical skills, and detailed articles on software development and technology. Stay updated with my latest work and career journey here.",
  icons: {
    icon: '/Images/favicon.ico',
  },
};



import { HeadScripts } from '@/components/shared/HeadScripts';
import { MaterialIcons } from '@/components/shared/MaterialIcons';

import dynamic from 'next/dynamic';
const FCMClient = dynamic(() => import('@/components/FCMClient'));

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <MaterialIcons />
        {settings.headScripts && <HeadScripts content={settings.headScripts} />}
      </head>
      <body className={`${poppins.variable} bg-background-light dark:bg-background-dark font-body min-h-screen text-text-light dark:text-text-dark selection:bg-primary selection:text-white transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <FCMClient />
            {children}
            <Toaster position="bottom-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
