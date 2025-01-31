import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'BT Öğretmeni',
    template: '%s | BT Öğretmeni',
  },
  description: 'Bilişim Teknolojileri ve Yazılım Geliştirme Blog',
  keywords: ['eğitim', 'bilişim', 'teknoloji', 'yazılım', 'kodlama', 'bt öğretmeni'],
  authors: [{ name: 'Yunus Emre' }],
  creator: 'Yunus Emre',
  publisher: 'BT Öğretmeni',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://btogretmeni.com',
    siteName: 'BT Öğretmeni Blog',
    title: 'BT Öğretmeni Blog',
    description: 'Bilişim Teknolojileri ve yazılım geliştirme üzerine blog yazıları.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BT Öğretmeni Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@btogretmeni',
    creator: '@btogretmeni',
    title: 'BT Öğretmeni Blog',
    description: 'Bilişim Teknolojileri ve yazılım geliştirme üzerine blog yazıları.',
    images: ['/images/twitter-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon-16x16.png',
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL('http://localhost:3000'),
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
}; 