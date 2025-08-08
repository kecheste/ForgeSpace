export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ForgeSpace',
  description:
    'AI-powered platform for idea development and validation with collaborative workspaces',
  url: 'https://forge-space.vercel.app',
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
    url: 'https://forge-space.vercel.app',
  },
  publisher: {
    '@type': 'Organization',
    name: 'ForgeSpace',
    url: 'https://forge-space.vercel.app',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '250',
    bestRating: '5',
  },
  sameAs: [
    'https://twitter.com/forgespace',
    'https://linkedin.com/company/forgespace',
  ],
};

export const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ForgeSpace',
  url: 'https://forge-space.vercel.app',
  logo: 'https://forge-space.vercel.app/forgespace-logo.png',
  description:
    'AI-powered platform for idea development and team collaboration',
  sameAs: [
    'https://twitter.com/forgespace',
    'https://linkedin.com/company/forgespace',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'support@forge-space.vercel.app',
  },
};

export const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ForgeSpace',
  url: 'https://forge-space.vercel.app',
  description:
    'AI-powered platform for idea development and team collaboration',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate:
        'https://forge-space.vercel.app/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://forge-space.vercel.app',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Dashboard',
      item: 'https://forge-space.vercel.app/dashboard',
    },
  ],
};
