// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono }   from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets:  ['latin'],
  variable: '--font-inter',
  display:  'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets:  ['latin'],
  variable: '--font-mono',
  display:  'swap',
  weight:   ['400', '500', '700'],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dwebstudios.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:  'Nitheesh Donepudi — D Web Studios',
    template: '%s · D Web Studios',
  },
  description:
    'Nitheesh Donepudi — Full-stack AI engineer. Portfolio built as a spatial OS: draggable windows, live Neon DB feeds, Claude AI assistant. Every pixel is proof of craft, not decoration.',

  keywords: [
    'full-stack engineer', 'AI engineer', 'Next.js', 'Anthropic Claude',
    'Neon Postgres', 'React', 'TypeScript', 'portfolio', 'D Web Studios',
    'Nitheesh Donepudi', 'Kore.ai', 'Citrix', 'RAG', 'LangChain',
  ],

  authors:  [{ name: 'Nitheesh Donepudi', url: SITE_URL }],
  creator:  'Nitheesh Donepudi',
  publisher:'D Web Studios',

  alternates: { canonical: '/' },
  robots: {
    index:     true,
    follow:    true,
    googleBot: {
      index:              true,
      follow:             true,
      'max-video-preview':  -1,
      'max-image-preview':  'large',
      'max-snippet':        -1,
    },
  },

  // OpenGraph — LinkedIn, Slack, iMessage, Discord
  openGraph: {
    type:        'website',
    url:         SITE_URL,
    siteName:    'D Web Studios',
    locale:      'en_US',
    title:       'Nitheesh Donepudi — Spatial Portfolio OS',
    description: 'This is not a portfolio. It\'s a desktop OS built in Next.js. Draggable windows. Live Postgres feeds. A Claude AI assistant that knows every project. Open it — you\'ll understand the difference.',
    images: [
      {
        url:    '/og-image.jpg',
        width:  1200,
        height: 630,
        alt:    'Nitheesh Donepudi — Spatial UI portfolio desktop OS',
      },
    ],
  },

  // Twitter / X
  twitter: {
    card:        'summary_large_image',
    site:        '@dwebstudios',   // update with your handle
    creator:     '@dwebstudios',
    title:       'Nitheesh Donepudi — Spatial Portfolio OS',
    description: 'Not a portfolio. A desktop OS. Draggable windows, live Postgres feeds, Claude AI. Open it.',
    images:      ['/og-image.jpg'],
  },

  applicationName: 'D Web Studios Portfolio',
  category:        'technology',
};

export const viewport: Viewport = {
  themeColor:   '#080812',
  colorScheme:  'dark',
  width:        'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon"             href="/favicon.ico" sizes="any" />
        <link rel="icon"             href="/icon.svg"    type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest"         href="/manifest.webmanifest" />
        <style>{`html,body{background:#080812}`}</style>
      </head>
      <body className={`${inter.className} antialiased overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
