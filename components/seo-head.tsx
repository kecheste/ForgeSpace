import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  twitterImage?: string;
  noIndex?: boolean;
  structuredData?: object;
}

export function SEOHead({
  title,
  description = 'Transform your ideas into reality with ForgeSpace. Our AI-powered platform provides instant analysis, collaborative workspaces, and comprehensive development tools.',
  keywords = [],
  canonical,
  ogImage = 'https://forge-space.vercel.app/opengraph-image',
  twitterImage = 'https://forge-space.vercel.app/twitter-image',
  noIndex = false,
  structuredData,
}: SEOHeadProps) {
  const fullTitle = title
    ? `${title} | ForgeSpace`
    : 'ForgeSpace - AI-Powered Idea Development Platform';
  const fullKeywords = [
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
    ...keywords,
  ].join(', ');

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={fullKeywords} />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={canonical || 'https://forge-space.vercel.app'}
      />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="ForgeSpace" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twitterImage} />
      <meta name="twitter:creator" content="@forgespace" />
      <meta name="twitter:site" content="@forgespace" />

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Additional Meta Tags */}
      <meta name="author" content="ForgeSpace" />
      <meta name="application-name" content="ForgeSpace" />
      <meta name="apple-mobile-web-app-title" content="ForgeSpace" />
      <meta name="msapplication-TileColor" content="#8B5CF6" />
      <meta name="theme-color" content="#8B5CF6" />
    </Head>
  );
}
