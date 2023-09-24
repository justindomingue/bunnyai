'use client'

import { Airdrop } from '@/components/Airdrop'
import { OnboardingLogin } from '@/components/OnboardingLogin'
import { Profile } from '@/components/Profile'
import { Topic } from '@/components/Topic'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getRandomEmoji } from '@/lib/emoji'
import { useRef, useState } from 'react'

const PROMPT = `come up with 6 emojis`

export default function Home() {
  // Should probably live somewhere else..
  // we generate a random set of emojis to seed the ai
  const emojis = useRef([getRandomEmoji(), getRandomEmoji(), getRandomEmoji(), getRandomEmoji(), getRandomEmoji(), getRandomEmoji()])
  const [topic, setTopic] = useState<string | null>()

  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center justify-between">
      <Tabs defaultValue="feed" className="flex flex-col flex-1 gap-8">
        <TabsContent value="feed">
          {/* should probably use nest router */}
          {topic ?
            <Topic
              topic={topic}
              onTurn={() =>
                setTopic(null)
              }
            />
            :
            <div className="grid gap-5" style={{ gridAutoFlow: 'column', gridTemplateRows: '100px 100px', gridTemplateColumns: '100px 100px' }}>
              {emojis.current.map(e => <button className='flex-1 aspect-square  rounded-full bg-black grid items-center text-4xl text-center' onClick={() => setTopic(e)}>{e}</button>)}
            </div>
          }
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
