import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import Head from 'next/head'
import {PrivyProvider} from '@privy-io/react-auth';

const lodrinaFont = localFont({
  src: './fonts/lodrina/LondrinaSolid-Regular.ttf',
  display: 'swap',
})
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'bunnyAI',
  description: 'down rabbit holes like never before',
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1",
  icons: ["/favicon.ico"],
  themeColor: "#FFEF16",
}

// This method will be passed to the PrivyProvider as a callback
// that runs after successful login.
const handleLogin = (user: any) => {
  console.log(`User ${user.id} logged in!`)
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
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        onSuccess={handleLogin}
        config={{
          loginMethods: ['email', 'wallet'],
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            logo: 'https://your-logo-url',
          },
        }}
      >
        <body className={`${inter.className} ${lodrinaFont.className}`}>{children}</body>
      </PrivyProvider>
    </html>
  )
}