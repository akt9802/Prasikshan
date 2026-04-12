import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/userdetails/', '/api/'],
    },
    sitemap: 'https://www.prasikshan.akt9802.in/sitemap.xml',
  }
}
