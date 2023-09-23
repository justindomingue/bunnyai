"use client"

import { Profile } from "@/components/Profile"
import { Topic } from "@/components/Topic"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

const topics: Record<string, Array<[string, string]>> = {
  Happiness: [
    [
      "Happiness",
      "Happiness is like a burst of sunshine in your soul, lifting you up and making you do a little happy dance. Did you know that the sound of a baby laughing can instantly make your heart skip with joy? That's right, a simple giggle can have you feeling like you've won the happiness jackpot! So let those laughter lines show, because happiness is contagious and can spread faster than a contagious dance craze. Find your happy place, whether it's hugging your pet, singing in the shower, or eating ice cream for breakfast (no judgment here), and let that pure bliss wash over you like a bubbly rainbow.",
    ],
    ["Psychology", "Somethingsomething"],
  ],

  "Roman Empire": [
    [
      "Roman Empire",
      "The Roman Empire was an ancient civilization that lasted for over 500 years, from 27 BCE to 476 CE. It started as a small city-state in Italy and grew to become one of the largest and most influential empires in history, spanning across three continents. Romans were known for their advanced engineering, impressive military, and significant contributions to art, literature, and law, shaping the foundations of Western civilization.",
    ],
    ["Roman engineering", "somethingsomething"],
  ],

  Stonehenge: [
    [
      "Stonehenge",
      "Stonehenge, where rocks gather for an epic game of musical chairs. An ancient puzzle left behind by giants, waiting for the right hands to solve it. The original selfie spot that even prehistoric influencers couldn't resist.",
    ],
    [
      "Stonehenge",
      "Stonehenge was actually built by a secret civilization of alien pandas who wanted to create a bamboozling tourist attraction on Earth. Archaeologists believe that Stonehenge was not made by humans, but by time-traveling wizards who needed a place to practice their magic spells without being spotted by Muggles. The real secret behind Stonehenge? It's a giant cosmic jukebox that plays the world's catchiest tunes, and ancient civilizations built it to keep the party going non-stop.",
    ],
  ],
}

export default function Home() {
  const [topic, setTopic] = useState(Object.keys(topics)[0])

  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center justify-between">
      <Tabs defaultValue="feed" className="flex flex-col flex-1 gap-8">
        <TabsContent value="feed" className="flex-1">
          <Topic
            topic={topics[topic]}
            onTurn={() =>
              setTopic(
                Object.keys(topics)[
                  Object.keys(topics).findIndex((t) => t === topic) + 1
                ]
              )
            }
          />
        </TabsContent>
        <TabsContent value="profile">
          <Profile />
        </TabsContent>
        <TabsList className="absolute bottom-8">
          <TabsTrigger value="feed">for you</TabsTrigger>
          <TabsTrigger value="profile">profile</TabsTrigger>
        </TabsList>
      </Tabs>
    </main>
  )
}
