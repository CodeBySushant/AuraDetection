import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Aura Analysis - Discover Your Energy',
  description: 'Uncover your hidden energy through AI. Generate a personalized aura card based on your personality and mood.',
  generator: 'sushant.app',
  icons: {
    icon: [
      {
        url: '/meditation.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/meditation.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/meditation.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/meditation.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
