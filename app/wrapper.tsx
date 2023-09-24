'use client' // This is a client component 👈🏽

import { PrivyProvider } from '@privy-io/react-auth'
import { PropsWithChildren } from 'react'

// This method will be passed to the PrivyProvider as a callback
// that runs after successful login.
const handleLogin = (user: any) => {
  console.log(`User ${user.id} logged in!`)
}

export function ComponentWrapper({ children }: PropsWithChildren<{}>) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      onSuccess={handleLogin}
      config={{
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          noPromptOnSignature: true,
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
