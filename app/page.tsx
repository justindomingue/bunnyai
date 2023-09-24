'use client'

import { Airdrop } from '@/components/Airdrop'
import { OnboardingLogin } from '@/components/OnboardingLogin'
import { Profile } from '@/components/Profile'
import { Topics } from '@/components/Topic'
import { NounImage } from '@/components/ui/NounImage'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePrivy } from '@privy-io/react-auth'
import { useState } from 'react'

export default function Home() {
  const [backgroundColor, setBackgroundColor] = useState('#ffe7b2')
  // local "fake" $honk credits for user onboarding when claiing free $honk and worldID verified credits
  const [localHonk, setLocalHonk] = useState<number>(0)
  const { ready, authenticated, user } = usePrivy()

  if (!ready) {
    return (
      <main className="flex min-h-screen min-w-screen flex-col items-center justify-center gap-5">
        <div className="flex flex-row justify-between">
          <NounImage size={100} />
        </div>

        {/* body */}
        <div className="flex flex-col gap-2 items-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            loading...
          </h1>
          <p className="text-lg ">$honk $honk</p>
        </div>
      </main>
    )
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen min-w-screen flex-col items-center justify-between">
        <OnboardingLogin />
      </main>
    )
  }

  return (
    <main
      className="flex min-h-screen min-w-screen flex-col items-center justify-between bg-white"
      style={{ backgroundColor: backgroundColor }}
    >
      <Tabs defaultValue="feed" className="flex flex-col flex-1 gap-8">
        <TabsContent value="feed">
          <Topics localHonk={localHonk} setLocalHonk={setLocalHonk} />
        </TabsContent>
        <TabsContent value="profile">
          <Profile localHonk={localHonk} setLocalHonk={setLocalHonk} />
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
