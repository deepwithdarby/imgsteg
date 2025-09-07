import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://imgsteg.com'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/learn-more`,
      lastModified: new Date(),
    },
    {
        url: `${baseUrl}/privacy`,
        lastModified: new Date(),
    },
    {
        url: `${baseUrl}/terms`,
        lastModified: new Date(),
    },
    {
      url: `${baseUrl}/tool`,
      lastModified: new Date(),
    },
  ]
}
