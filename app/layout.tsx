import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'GameFit - Cognitive Health Tracker',
  description: 'Private cognitive health tracking for dementia care powered by Midnight blockchain',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-100">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
