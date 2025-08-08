import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata, Viewport } from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';
import '../styles/globals.css';
import {
  structuredData as appStructuredData,
  organizationStructuredData,
  websiteStructuredData,
} from './structured-data';

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
    'AI-powered platform',
    'idea management',
    'creative collaboration',
    'innovation tools',
    'startup development',
    'business ideas',
    'entrepreneurship',
    'innovation management',
    'product ideation',
    'market validation',
  ],
  authors: [
    { name: 'ForgeSpace Team', url: 'https://forge-space.vercel.app/' },
  ],
  creator: 'ForgeSpace',
  publisher: 'ForgeSpace',
  metadataBase: new URL('https://forge-space.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://forge-space.vercel.app',
    title: 'ForgeSpace - AI-Powered Idea Development Platform',
    description:
      'From concept to implementation - develop better ideas faster with AI-powered analysis and collaborative tools.',
    siteName: 'ForgeSpace',
    images: [
      {
        url: 'https://forge-space.vercel.app/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'ForgeSpace Platform Dashboard',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ForgeSpace - AI-Powered Idea Development',
    description:
      'The complete platform for developing and validating ideas with AI and team collaboration',
    images: ['https://forge-space.vercel.app/twitter-image'],
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
      { url: '/forgespace-logo.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon', sizes: '180x180' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#8B5CF6',
      },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
  category: 'technology',
  classification: 'business',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'ForgeSpace',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileColor': '#8B5CF6',
    'msapplication-tap-highlight': 'no',
    'theme-color': '#8B5CF6',
    'application-name': 'ForgeSpace',
    'msapplication-TileImage': '/forgespace-logo.png',
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

const combinedStructuredData = [
  appStructuredData,
  organizationStructuredData,
  websiteStructuredData,
];

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
        <meta
          name="google-site-verification"
          content="CD8o5e2tN1I--zxj6lqHoKCqnQIu0nWfRxGxg0xgHWk"
        />
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(combinedStructuredData),
            }}
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
