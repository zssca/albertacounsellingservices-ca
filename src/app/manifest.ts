import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Alberta Counselling Services',
    short_name: 'Alberta Counselling Services',
    description: 'Professional counselling services in Calgary with 35+ years experience. Relationship counselling, marriage therapy, family counselling & individual therapy.',
    start_url: '/',
    display: 'standalone',
      background_color: 'oklch(1 0 0)',
  theme_color: 'oklch(0.45 0.08 160)',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}