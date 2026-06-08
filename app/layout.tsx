import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { ClerkProvider } from '@clerk/nextjs';
import type { Viewport } from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';
import '../styles/globals.css';

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
