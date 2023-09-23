"use client"; // This is a client component 👈🏽

import {PrivyProvider} from '@privy-io/react-auth';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local'
const lodrinaFont = localFont({
    src: './fonts/lodrina/LondrinaSolid-Regular.ttf',
    display: 'swap',
  })
  const inter = Inter({ subsets: ['latin'] })

// This method will be passed to the PrivyProvider as a callback
// that runs after successful login.
const handleLogin = (user: any) => {
    console.log(`User ${user.id} logged in!`)
}

export function ComponentWrapper({children}: {children: React.ReactNode}) {
    return (
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
                embeddedWallets: {
                    createOnLogin: 'users-without-wallets'
                }
            }}
            >
                <body className={`${inter.className} ${lodrinaFont.className}`}>{children}</body>
        </PrivyProvider>
    )
}