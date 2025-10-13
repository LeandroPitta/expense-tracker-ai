import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from '@/components/providers';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Expense Tracker - Modern Expense Management',
  description: 'Track your expenses with our modern, intuitive expense tracking application. Manage your finances with real-time analytics and beautiful visualizations.',
  keywords: ['expense tracker', 'finance', 'budgeting', 'money management'],
  authors: [{ name: 'Expense Tracker Team' }],
  creator: 'Expense Tracker Team',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Expense Tracker - Modern Expense Management',
    description: 'Track your expenses with our modern, intuitive expense tracking application.',
    siteName: 'Expense Tracker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Expense Tracker - Modern Expense Management',
    description: 'Track your expenses with our modern, intuitive expense tracking application.',
    creator: '@expensetracker',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
