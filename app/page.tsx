'use client'

import { Airdrop } from '@/components/Airdrop'
import { OnboardingLogin } from '@/components/OnboardingLogin'
import { Profile } from '@/components/Profile'
import { Topics } from '@/components/Topic'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createContext, useState } from 'react'

const AppContext = createContext<{
  backgroundColor: string
  setBackgroundColor: () => void,
}>({
  backgroundColor: '#ffe7b2',
  setBackgroundColor: () => { },
})

export default function Home() {
  const [backgroundColor, setBackgroundColor] = useState('#ffe7b2')

  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center justify-between bg-white" style={{ backgroundColor: backgroundColor }}>
      <Tabs defaultValue="feed" className="flex flex-col flex-1 gap-8">
        <TabsContent value="feed">
          <Topics setBackgroundColor={setBackgroundColor} />
        </TabsContent>
        <TabsContent value="profile">
          <Profile />
        </TabsContent>
        <TabsContent value="airdrop">
          <Airdrop />
        </TabsContent>
        <TabsList className="absolute bottom-8">
          <TabsTrigger value="feed">for you</TabsTrigger>
          <TabsTrigger value="profile">profile </TabsTrigger>
          <TabsTrigger value="airdrop">airdrop</TabsTrigger>
        </TabsList>
      </Tabs>
    </main>
  )
}
