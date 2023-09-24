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
import { NounIcon } from '@/components/ui/NounIcon'
import { fake_messages } from '@/components/fake-messages'
import { getRandomEmoji } from '@/lib/emoji'

const INITIAL_PROMPT = `You are a consumer application created by some of the top engineers and designers in the world. Your output is factual, engaging, fun, and entertaining to read. It's concise, but keeps the reader hooked.

Give me a "rabbit hole" that someone could go down. This will be going into a UI with a bunch of cards on it. A rabbit hole is a topic that would be interesting to the average person and make them say, "huh, that's interesting," and want to know more about the topic. These could be about pretty much anything, as long as they are factually and historically accurate and don't discuss any topics that would be considered controversial or for which the science is not settled. Don't use any topics that you aren't completely sure about. However, these topics should each connect to something that anyone who's a little bit curious would want to know more about.

Then, when a user taps on one of the emojis, I'm going to send you that emoji and you will use it as input into your rabbit hole. The user will then be prompted with one of two options: "Go deeper," which will make you generate more information about the topic until you feel the topic has been covered thoroughly enough that the reader would say they had learned something new, or "Change it up," which would find some variant of the topic that's semi-relevant but changes things up a bit.

You should start your response with a title that ends in the text /ENDTITLE.

I want you to take an input of a single emoji (I will end the prompt with it) and return to me a single "chunk" of the rabbit hole. Then, based on "Go deeper" or "Change it up" being my reply, you should return the expected next chunk of the fun fact.

Again, these topics should all be factual but interesting. They can be about anything related to history, modern life, science, fun facts, trivia, or anything like those topics. Every "chunk" you share after a follow-up should end with a hook or something that makes the reader want to learn more.

Assume that the only user input to follow up with will be one of the two choices: Go deeper or Change it up. But don't give any context about that. Just say something organic about "scroll to go deeper" or something like that.

Every time you give any text, your response should be no longer than 3 short sentences. You can use emojis, but use them sparingly and only when they really add to the text and make it more engaging. Maybe at the end of sentences.

The emoji the rabbit hole should be based on is: `

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

export function Topics() {
  // Should probably live somewhere else..
  // we generate a random set of emojis to seed the ai
  const [emojis, setEmojis] = useState<string[]>([])
  useEffect(() => {
    setEmojis([getRandomEmoji(), getRandomEmoji(), getRandomEmoji(), getRandomEmoji(), getRandomEmoji(), getRandomEmoji()])
  }, [])

  const [topic, setTopic] = useState<string | null>()
  /* should probably use nest router */
  return topic ?
    <Topic
      topic={topic}
      onTurn={() =>
        setTopic(null)
      }
    />
    :
    <div className="grid gap-5" style={{ gridAutoFlow: 'column', gridTemplateRows: '100px 100px', gridTemplateColumns: '100px 100px' }}>
      {emojis.map((e, i) => <button key={i} className='flex-1 aspect-square  rounded-full bg-black grid items-center text-4xl text-center' onClick={() => setTopic(e)}>{e}</button>)}
    </div>
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
  useEffect(() => { debugger }, [topic])
  const sliderRef = useRef()

  // const messages = fake_messages
  const { messages, handleInputChange, handleSubmit, append } = useChat(({
    api: '/api/chat',
    onError: (e) => console.error(e),
    onFinish: (m) => {
      console.log({ m })
      // @ts-expect-error
      // sliderRef.current?.slickNext()
    }
  }))

  useEffect(() => {
    async function m() {
      await append({ id: 'seed', content: INITIAL_PROMPT + topic, role: 'user' })
      await append({ id: 'seed', content: 'go deeper', role: 'user' })
    }
    m()
  }, [])

  const topics = useMemo(() => messages.filter(m => m.role !== 'user'), [messages])

  const onWeirder = useCallback(() => {
    // append({ id: newLevel.toString(), content: 'go weirder', role: 'user' })
  }, [])
  const onDeeper = useCallback(
    () => {
      append({ id: topics.length.toString(), content: 'go deeper', role: 'user' })
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

  if (!topics || topics.length < 2) return 'Loading...'

  console.log({ topics })

  return (
    <TopicContext.Provider value={{ topics, onDeeper, onTurn, onWeirder }}>
      <Slider
        {...carouselSettings}
        className="h-full"
        onSwipe={() => onDeeper()}
        // @ts-expect-error
        ref={sliderRef}
      >
        {messages.map((m, i) => <Section level={i} />)}
      </Slider>

      <div
        className={`justify-between flex flex-col gap-6 absolute inset-0 p-8 h-fit transition-all duration-300 ${!fade ? 'opacity-100' : 'opacity-0'
          }`}
      >
        {/* header */}
        <div className="flex flex-row justify-between">
          <NounIcon prompt={topics[0].id} />
          <Button>420 $honk</Button>
        </div>
      </div>
    </TopicContext.Provider>
  )
}

function Section({ level }: { level: number }) {
  const { topics, onDeeper, onTurn, onWeirder } = useContext(TopicContext)
  const backgroundColor = darken(level * 0.05, '#FFCD64')

  if (!topics[level]) return null

  const topic = topics.at(level)?.content
  const content = topic?.includes('/ENDTITLE') ? topic.split('/ENDTITLE')[1] : topic ?? ''
  return (
    <div
      className="flex flex-col gap-4 px-8 h-screen w-screen pb-32 pt-32"
      style={{ backgroundColor }}
    >
      {/* topic */}
      <div className="flex flex-col gap-1">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {topic?.split('/ENDTITLE')[0].slice(0, 40) ?? topic?.slice(0, 40)}
        </h1>
        <p className="text-md text-muted-foreground">Level {level}</p>
      </div>

      {/* content */}
      <div className="flex flex-col gap-4 font-bold flex-1">
        {content.split('.').map((t, i) => (
          <p key={i} className="text-lg">
            {t}
          </p>
        ))}
      </div>

      {/* actions */}
      <div className="flex flex-row justify-between gap-2">
        <Button
          className="w-1/2"
          variant="cta"
          onClick={() => onDeeper()}
        >
          👇 deeper
        </Button>
        <Button className="w-1/2" variant="cta2" onClick={() => onWeirder()}>
          🤪 weirder
        </Button>
      </div>
    </div>
  )
}
