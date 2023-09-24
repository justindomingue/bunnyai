'use client'

import { Airdrop } from '@/components/Airdrop'
import { OnboardingLogin } from '@/components/OnboardingLogin'
import { Profile } from '@/components/Profile'
import { Topics } from '@/components/Topic'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const PROMPT = `come up with 6 emojis`

export default function Home() {

  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center justify-between">
      <Tabs defaultValue="feed" className="flex flex-col flex-1 gap-8">
        <TabsContent value="feed">
          <Topics />
        </TabsContent>
        <TabsContent value="profile">
          <Profile />
        </TabsContent>
        <TabsContent value="airdrop">
          <Airdrop />
        </TabsContent>
        <TabsContent value="onboarding">
          <OnboardingLogin />
        </TabsContent>
        <TabsList className="absolute bottom-8">
          <TabsTrigger value="feed">for you</TabsTrigger>
          <TabsTrigger value="profile">profile </TabsTrigger>
          <TabsTrigger value="airdrop">airdrop</TabsTrigger>
          <TabsTrigger value="onboarding">onboarding (TEMP)</TabsTrigger>
        </TabsList>
      </Tabs>
    </main>
  )
}
