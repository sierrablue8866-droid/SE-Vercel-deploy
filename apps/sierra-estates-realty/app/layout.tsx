import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sierra-estates.net'),
  title: {
    default: 'Sierra Estates | Luxury PropTech Real Estate in New Cairo',
    template: '%s | Sierra Estates',
  },
  description:
    'Discover 1,200+ AI-curated luxury villas, twin houses, and penthouses across Hyde Park, Mivida, Uptown Cairo, and Villette in New Cairo, Egypt.',
  keywords: [
    'Sierra Estates',
    'New Cairo real estate',
    'Hyde Park villas',
    'Mivida apartments',
    'Uptown Cairo penthouses',
    'Egypt luxury property',
    'PropTech Cairo',
  ],
  authors: [{ name: 'Sierra Estates Architecture Team' }],
  creator: 'Sierra Estates',
  publisher: 'Sierra Estates',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sierra-estates.net',
    siteName: 'Sierra Estates',
    title: 'Sierra Estates | Luxury PropTech Real Estate in New Cairo',
    description:
      'AI-curated verified listings in New Cairo compounds with instant WhatsApp consultation and 48-hour deal closing.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Sierra Estates Luxury Villa New Cairo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sierra Estates | Luxury Real Estate New Cairo',
    description: 'AI-driven luxury real estate platform for New Cairo compounds.',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'],
  },
  alternates: {
    canonical: 'https://sierra-estates.net',
    languages: {
      'en-US': 'https://sierra-estates.net',
      'ar-EG': 'https://sierra-estates.net?lang=ar',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cairo:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
