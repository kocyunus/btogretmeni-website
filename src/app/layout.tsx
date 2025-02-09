import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kocyunus.com'),
  title: {
    default: "Yunus Koç | BT Öğretmeni - Kodlama ve Teknoloji Eğitimi",
    template: "%s | Yunus Koç - BT Öğretmeni"
  },
  description: "Yunus Koç - Bilişim Teknolojileri Öğretmeni. Kodlama, robotik ve teknoloji eğitimleri. Öğrenciler için oyunlaştırılmış kodlama platformu ve eğitim içerikleri.",
  keywords: ["yunus koç", "kocyunus", "bt öğretmeni yunus", "kodlama eğitimi", "robotik eğitimi", "teknoloji öğretmeni", "bilişim teknolojileri", "online kodlama dersleri", "çocuklar için kodlama"],
  authors: [{ name: "Yunus KOÇ", url: "https://www.kocyunus.com" }],
  creator: "Yunus KOÇ",
  publisher: "Yunus KOÇ - BT Öğretmeni",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://www.kocyunus.com",
    siteName: "Yunus Koç - BT Öğretmeni",
    title: "Yunus Koç | BT Öğretmeni - Kodlama ve Teknoloji Eğitimi",
    description: "Yunus Koç - Bilişim Teknolojileri Öğretmeni. Kodlama, robotik ve teknoloji eğitimleri. Öğrenciler için oyunlaştırılmış kodlama platformu ve eğitim içerikleri.",
    images: [
      {
        url: "https://www.kocyunus.com/images/yunus-koc.jpg",
        width: 1200,
        height: 630,
        alt: "Yunus Koç - BT Öğretmeni"
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yunus Koç | BT Öğretmeni - Kodlama ve Teknoloji Eğitimi',
    description: 'Kodlama ve teknoloji eğitimi uzmanı Yunus Koç resmi web sitesi',
    images: ['https://www.kocyunus.com/images/yunus-koc.jpg'],
    creator: '@yunuskoc',
    site: '@yunuskoc'
  },
  verification: {
    google: "JNRiDuAE78VIYxwjrKgybW7DdjG22Wwp2ijs35GQTQk",
  },
  alternates: {
    canonical: "https://www.kocyunus.com",
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
