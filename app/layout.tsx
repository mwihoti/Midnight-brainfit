import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'BrainFit — Brain Training Games',
  description: 'Memory and puzzle games for kids and adults. Train your brain, earn achievements, keep your data private.',
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
      <body className="bg-[#000009] text-slate-100">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
