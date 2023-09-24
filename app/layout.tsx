import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ComponentWrapper } from './wrapper'

const lodrinaFont = localFont({
  src: './fonts/lodrina/LondrinaSolid-Regular.ttf',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BunnyAI',
  description: 'down rabbit holes like never before',
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1',
  icons: ['/favicon.ico'],
  themeColor: '#FFEF16',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${lodrinaFont.className}`}>
        <ComponentWrapper>{children}</ComponentWrapper>
      </body>
    </html>
  )
}
