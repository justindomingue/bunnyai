import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import Head from 'next/head'
import { ComponentWrapper } from './wrapper';

const lodrinaFont = localFont({
  src: './fonts/lodrina/LondrinaSolid-Regular.ttf',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'bunnyAI',
  description: 'down rabbit holes like never before',
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1",
  icons: ["/favicon.ico"],
  themeColor: "#FFEF16",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>

      </Head>
      <body className={`${lodrinaFont.className}`}>
        <ComponentWrapper children={children} />
      </body>
    </html>
  )
}