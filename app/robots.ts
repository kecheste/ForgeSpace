import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/private/',
          '/dashboard/',
          '/invite/',
        ],
      },
    ],
    sitemap: 'https://forge-space.vercel.app/sitemap.xml',
    host: 'https://forge-space.vercel.app',
  };
}
