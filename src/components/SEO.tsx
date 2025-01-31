import { NextSeo } from 'next-seo';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export default function SEO({
  title = 'Yunus Koç - BT Öğretmeni',
  description = 'Bilişim Teknolojileri Öğretmeni Yunus Koç\'un kişisel web sitesi ve blog sayfası',
  keywords = 'bt öğretmeni, bilişim teknolojileri, eğitim, teknoloji',
  canonicalUrl = 'https://yunuskoc.com',
  ogImage = '/images/og-image.jpg'
}: SEOProps) {
  return (
    <NextSeo
      title={title}
      description={description}
      canonical={canonicalUrl}
      openGraph={{
        url: canonicalUrl,
        title: title,
        description: description,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        siteName: 'Yunus Koç',
      }}
      additionalMetaTags={[
        {
          name: 'keywords',
          content: keywords
        }
      ]}
    />
  );
} 