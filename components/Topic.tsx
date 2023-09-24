'use client'

import { darken } from 'polished'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import { useChat, Message } from 'ai/react';

import { Button } from '@/components/ui/button'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { NounImage } from '@/components/ui/NounImage'
import { fake_messages } from '@/components/fake-messages'
import { getRandomEmoji } from '@/lib/emoji'

const INITIAL_PROMPT = `You are a consumer application created by some of the top engineers and designers in the world. Your output is factual, engaging, fun, and entertaining to read. It's concise, but keeps the reader hooked.

Give me a "rabbit hole" that someone could go down. A rabbit hole is a topic that would be interesting to the average person and make them say, "oh wow I didn't know that!" and want to tell people about it immediately. These could be about pretty much anything, as long as they are factually and historically accurate and don't discuss any topics that would be considered controversial or for which the science is not settled. Don't use any topics that you aren't completely sure about. However, these topics should each connect to something that anyone who's a little bit curious would want to know more about.

The UI of the app you're powering will show users a set of 6 random emojis.

When a user taps on one of the emojis, I'm going to send you that emoji and you will use it as input with which to create a rabbit hole. You can create a rabbit hole based loosely on the emoji—it doesn't have to be about the emoji itself, but any related concept that the emoji inspires.

The user will then be prompted with one of two options: "Go deeper," which will make you generate more information about the topic until you feel the topic has been covered thoroughly enough that the reader would say they had learned something new, or "Change it up," which would find some variant of the topic that's semi-relevant but changes things up a bit.

I want you to take an input of a single emoji (I will end this prompt with it) and return to me a single "chunk" of the resulting rabbit hole you generate. Then, based on "go deeper" or "change it up" being my reply, you should return the expected next chunk of the fun fact.

Again, these topics should all be factual but interesting. They can be about anything related to history, modern life, science, fun facts, trivia, or anything like those topics. Every "chunk" you share after a follow-up should end with a hook or something that makes the reader want to learn more.

Assume that the only user input to follow up with will be one of the two choices: go deeper or change it up. But don't give any context about that in your response. Just assume that interaction is being abstracted by UI, and say something organic like "go deeper to learn more about X or change it up and learn about ____ instead?" or something like that. Do not say anything that would reveal the fact that you know the user's only options are "go deeper" and "change it up".

Each response you give should be no longer than 3 short sentences, separated by new lines. Keep it extremely brief and concise. Every response you give should be hyper digestible and short and easy to parse very quickly.

The emoji the rabbit hole should be based on will be the following emoji: `

const carouselSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  vertical: true,
  verticalSwiping: true,
  //   swipeToSlide: true,
}

export function IntroEmojis({ setTopic }: { setTopic: (topic: string) => void }) {
  // we generate a random set of emojis to seed the ai
  const [emojis, setEmojis] = useState<string[]>([])
  useEffect(() => {
    setEmojis([getRandomEmoji(), getRandomEmoji(), getRandomEmoji(), getRandomEmoji(), getRandomEmoji(), getRandomEmoji()])
  }, [])
  return (
    <div className='flex flex-col'>
      <h1 className="text-4xl font-bold mb-7 mt-4">Pick a rabbit hole</h1>
      <div className="items-center justify-center w-full grid gap-4" style={{ gridAutoFlow: 'column', gridTemplateRows: 'auto auto auto', gridTemplateColumns: 'auto auto' }}>
        {emojis.map((e, i) => {
          return (
            <button
              key={i}
              className='aspect-square rounded-full border-4 border-black/70 bg-black/70 hover:bg-black/80 transition-all duration-200 grid items-center justify-center text-7xl text-center w-[160px] h-[160px] shadow-xl'
              onClick={() => setTopic(e)}>
              {e}
            </button>)
        })}
      </div>
    </div>
  )
}

export function Topics({ setBackgroundColor }: { setBackgroundColor: (color: string) => void }) {
  const [topic, setTopic] = useState<string | null>()
  /* should probably use nest router */
  return (

    <div
      className="justify-between flex flex-col gap-6 absolute inset-0 p-8 h-fit transition-all duration-300"
    >
      {/* header */}
      <div className="flex flex-row items-center justify-between">
        <NounImage prompt={topic ?? undefined} />
        <p className="text-3xl text-muted-foreground">
          {Array(3).fill(topic).join('   ')}
        </p>
        <Button>420 $honk</Button>
      </div>
      {
        topic ?
          <Topic
            topic={topic}
            onTurn={() =>
              setTopic(null)
            }
          />
          :
          <IntroEmojis setTopic={setTopic} />
      }
    </div>
  )
}

const TopicContext = createContext<{
  topics: Message[]
  onDeeper: () => void
  onWeirder: () => void
  onTurn: () => void
}>({
  topics: [],
  onDeeper: () => { },
  onWeirder: () => { },
  onTurn: () => { },
})

export function Topic({
  topic,
  onTurn,
}: {
  topic: string
  onTurn: () => void
}) {
  // useEffect(() => { debugger }, [topic])
  const sliderRef = useRef()

  // const messages = fake_messages
  const { messages, handleInputChange, handleSubmit, append, isLoading } = useChat(({
    api: '/api/chat',
    onResponse: (m) => {
      console.log('onResponse: ', m)
    },
    onError: (e) => console.error(e),
    onFinish: (m) => {
      console.log({ m })
      // sliderRef.current?.slickNext()
    }
  }))

  useEffect(() => {
    if (!isLoading) {
      append({ id: 'seed', content: INITIAL_PROMPT + topic, role: 'user' })
    }
  }, [])

  const topics = useMemo(() => messages.filter(m => m.role !== 'user'), [messages])

  const onWeirder = useCallback(() => {
    if (!isLoading) {
      append({ id: topics.length.toString(), content: 'change it up', role: 'user' })
    }
  }, [])

  const onDeeper = useCallback(
    () => {
      if (!isLoading) {
        append({ id: topics.length.toString(), content: 'Go deeper', role: 'user' })
      }
    },
    []
  )

  const [fade, setFade] = useState(false)
  useEffect(() => {
    const fadein = () => setFade(false)
    const fadeout = () => setFade(true)
    window.addEventListener('touchstart', fadeout)
    window.addEventListener('touchend', fadein)
    return () => {
      window.removeEventListener('touchstart', fadeout)
      window.removeEventListener('touchend', fadein)
    }
  })

  if (!topics || !topics.length) return 'Loading...'

  // console.log({ topics })

  return (
    <TopicContext.Provider value={{ topics, onDeeper, onTurn, onWeirder }}>
      {/* <Slider
        {...carouselSettings}
        className="h-full"
        onSwipe={() => onDeeper()}
        // @ts-expect-error
        ref={sliderRef}
      >
      </Slider> */}

      {/* topic */}
      <div className="flex flex-col gap-1">
        {/* <p className="text-5xl text-muted-foreground">
          {Array(3).fill(topic).join('   ')}
        </p> */}
        <p className="text-sm text-muted-foreground text-center">Depth: {topics.length}</p>
        <Section level={topics.length - 1} />
      </div>

      {/* actions */}
      <Button className="fixed bottom-24 left-8 flex gap-2" variant="cta2" onClick={() => onWeirder()}>
        <span className='grayscale opacity-75 text-md'>🔀</span>
        <span className='text-md'>change it up</span>
      </Button>
      <Button
        className="fixed bottom-24 right-8 flex gap-2"
        variant="cta"
        onClick={() => onDeeper()}
      >
        <span className='opacity-75'>👇</span>
        <span className='text-md'>go deeper</span>
      </Button>
    </TopicContext.Provider>
  )
}

function Section({ level }: { level: number }) {
  const { topics, onDeeper, onTurn, onWeirder } = useContext(TopicContext)
  const backgroundColor = darken(level * 0.025, '#ffe7b2')

  if (!topics[level]) return null

  const topic = topics.at(-1)?.content
  const content = topic?.includes('/ENDTITLE') ? topic.split('/ENDTITLE')[1] : topics.at(-1)?.content ?? ''
  return (
    <div
      className="flex flex-col gap-4 h-full w-full rounded-tl-none rounded-[40px] px-4 py-2 overflow-scroll border-4 border-black/10"
      style={{ backgroundColor }}
    >
      <div className="flex flex-col gap-4 mt-1 flex-1 overflow-scroll max-h-[450px]">
        {content.split('.').map((t, i) => (
          <p key={i} className="text-lg">
            {t}
          </p>
        ))}
      </div>
    </div>
  )
}
