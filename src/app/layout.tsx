import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://btogretmeni.vercel.app'),
  title: {
    default: "BT Öğretmeni",
    template: "%s | BT Öğretmeni"
  },
  description: "Yazılım, robotik ve teknoloji eğitimleri ile kendinizi geliştirin. Oyunlaştırılmış kodlama öğrenme platformu.",
  keywords: ["kodlama", "programlama", "eğitim", "yazılım", "robotik", "teknoloji", "bt öğretmeni", "bilişim teknolojileri"],
  authors: [{ name: "Yunus KOÇ", url: "https://btogretmeni.vercel.app" }],
  creator: "Yunus KOÇ",
  publisher: "BT Öğretmeni",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large'
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://btogretmeni.vercel.app",
    siteName: "BT Öğretmeni",
    title: "BT Öğretmeni - Kodlama Öğrenme Platformu",
    description: "Yazılım, robotik ve teknoloji eğitimleri ile kendinizi geliştirin. Oyunlaştırılmış kodlama öğrenme platformu.",
    images: [
      {
        url: "https://btogretmeni.vercel.app/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "BT Öğretmeni"
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BT Öğretmeni - Kodlama Öğrenme Platformu',
    description: 'Yazılım, robotik ve teknoloji eğitimleri ile kendinizi geliştirin.',
    images: ['https://btogretmeni.vercel.app/images/og-image.png'],
  },
  verification: {
    google: "google-site-verification-code", // Google Search Console doğrulama kodu buraya gelecek
  },
  alternates: {
    canonical: "https://btogretmeni.vercel.app",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1a1b26" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
