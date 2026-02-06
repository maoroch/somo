import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Somo | AI Video Generator from Text',
    template: '%s | Somo',
  },
  description:
    'Create videos from text using AI. Automatic subtitles, voiceover and formats for social media.',
  keywords: [
    'AI video generator',
    'video creator',
    'AI voiceover',
    'auto subtitles',
    'social media video',
    'content creation',
  ],
  authors: [{ name: 'Somo' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://Somo.ai',
    siteName: 'Somo',
    images: [
      {
        url: 'https://Somo.ai/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Somo - AI Video Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@Somo',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#0f172a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${poppins.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}