'use client';

import { Inter } from 'next/font/google'
import { useEffect } from 'react';
import './globals.css'
import { analytics, logEvent } from '@/lib/firebase';
import { ThemeProvider } from '@/components/theme-provider'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view');
      logEvent(analytics, 'test_event', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
      console.log('Analytics olaylari gonderildi');
    }
  }, []);

  return (
    <html lang="tr">
      <body className={inter.className}>
        <ThemeProvider>
          <Navbar />
          <div className="pt-16">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
