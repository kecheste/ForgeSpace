import type { Metadata, Viewport } from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';
import '../styles/globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error-boundary';
import { ClerkProvider } from '@clerk/nextjs';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  adjustFontFallback: true,
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['italic', 'normal'],
});

export const metadata: Metadata = {
  title: {
    default: 'ForgeSpace - AI-Powered Idea Development Platform',
    template: '%s | ForgeSpace',
  },
  description:
    'Transform your ideas into reality with ForgeSpace. Our AI-powered platform provides instant analysis, collaborative workspaces, and comprehensive development tools to take your ideas from concept to implementation.',
  keywords: [
    'idea development',
    'AI idea analysis',
    'collaborative workspaces',
    'innovation platform',
    'creative tools',
    'team collaboration',
    'idea validation',
    'project planning',
    'startup tools',
    'product development',
  ],
  authors: [{ name: 'ForgeSpace Team', url: 'https://forgespace.com' }],
  creator: 'ForgeSpace',
  publisher: 'ForgeSpace',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://forgespace.com'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'ForgeSpace - AI-Powered Idea Development Platform',
    description:
      'From concept to implementation - develop better ideas faster with AI-powered analysis and collaborative tools.',
    siteName: 'ForgeSpace',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ForgeSpace Platform Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ForgeSpace - AI-Powered Idea Development',
    description:
      'The complete platform for developing and validating ideas with AI and team collaboration',
    images: ['/og-image.jpg'],
    creator: '@forgespace',
    site: '@forgespace',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#6366f1',
      },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
  colorScheme: 'light dark',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ForgeSpace',
  description:
    'AI-powered platform for idea development and validation with collaborative workspaces',
  url: 'https://forgespace.com',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'AI-powered idea analysis',
    'Real-time collaboration',
    'Development roadmaps',
    'Idea validation scoring',
    'Team workspaces',
    'Progress tracking',
  ],
  author: {
    '@type': 'Organization',
    name: 'ForgeSpace',
    url: 'https://forgespace.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'ForgeSpace',
    url: 'https://forgespace.com',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '250',
    bestRating: '5',
  },
};

/**
 * Root layout component that wraps all pages
 *
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to render within the layout
 * @returns {JSX.Element} The root layout structure
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${manrope.variable} ${playfair.variable}`}
        suppressHydrationWarning
      >
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        </head>
        <body
          className={`
          font-body 
          bg-background text-foreground subpixel-antialiased
          min-h-screen
          selection:bg-primary/20 selection:text-primary-foreground
          tracking-tight
        `}
        >
          <ErrorBoundary>
            {children}
            <Toaster />
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
