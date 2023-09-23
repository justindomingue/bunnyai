"use client"

import { darken } from "polished"
import Slider from "react-slick"
import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"

import { Noun } from "@/components/Noun"
import { Button } from "@/components/ui/button"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { useCompletion } from "ai/react"

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

const TopicContext = createContext<{
  activeLevel: number
  topic: Array<[string, string]>
  onDeeper: (newLevel: number) => void
  onTurn: () => void
}>({
  activeLevel: 0,
  topic: [],
  onDeeper: () => { },
  onTurn: () => { },
})

export function Topic({
  initialTopic,
  onTurn,
}: {
  initialTopic: string
  onTurn: () => void
}) {
  const [activeLevel, setActiveLevel] = useState(0)
  const onDeeper = useCallback(
    (newLevel: number) => setActiveLevel(newLevel),
    []
  )

  const [topics, setTopics] = useState<string[]>([])
  const [content, setContent] = useState<string[]>([])

  // idea is to first get a next topic generated, and then trigger a content fetch.
  // would probably be better to do direcly in the api? but idk how to convert
  // the api response to a string
  const { complete: completeNextTopic } = useCompletion({
    api: '/api/nextTopic',
    onFinish: (prompt, completion) => {
      console.log({ prompt, completion })
      setTopics(topics.slice().concat(completion))
    }
  })


  const { complete } = useCompletion({
    onFinish: (prompt, completion) => {
      console.log({ prompt, completion })
      setContent(content.slice().concat(completion))
    },
  })

  useEffect(() => {
    const topic = topics.at(-1) ?? initialTopic
    completeNextTopic(topic)
  }, [activeLevel])

  useEffect(() => {

  })

  // triggers next completions fetching
  useEffect(() => {
    const nextTopic = content.at(-1)?.[0] ?? initialTopic

    // whenever activeLevel changes, generate next prompts
    complete(nextTopic)
  }, [activeLevel])

  const [fade, setFade] = useState(false)
  useEffect(() => {
    const fadein = () => setFade(false)
    const fadeout = () => setFade(true)
    window.addEventListener("touchstart", fadeout)
    window.addEventListener("touchend", fadein)
    return () => {
      window.removeEventListener("touchstart", fadeout)
      window.removeEventListener("touchend", fadein)
    }
  })

  return (
    <TopicContext.Provider value={{ completions: content, activeLevel, onDeeper, onTurn }}>
      <Slider
        {...carouselSettings}
        className="h-full"
        afterChange={(level) => {
          setActiveLevel(level)
        }}
      >
        {content.map((t, i) => <Section key={i} level={i} />)}
      </Slider>

      <div
        className={`justify-between flex flex-col gap-6 absolute inset-0 p-8 h-fit  transition-all duration-300 ${!fade ? "opacity-100" : "opacity-0"
          }`}
      >
        {/* header */}
        <div className="flex flex-row justify-between">
          <Noun />
          <Button>420 $honk</Button>
        </div>

        {/* topic */}
        <div className="flex flex-col gap-1">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {topic[activeLevel][0]}
          </h1>
          <p className="text-md text-muted-foreground">Level {activeLevel}</p>
        </div>
      </div>
    </TopicContext.Provider>
  )
}

function Section({ level }: { level: number }) {
  const { topic, onDeeper, onTurn } = useContext(TopicContext)
  const backgroundColor = darken(level * 0.05, "#FFCD64")

  if (!topic[level]) return null

  return (
    <div
      className="flex flex-col gap-4 px-8 h-screen w-screen"
      style={{ backgroundColor }}
    >
      <div className="flex flex-col gap-4 font-bold mt-44">
        {topic[level][1].split(".").map((t, i) => (
          <p key={i} className="text-lg">
            {t}
          </p>
        ))}
      </div>

      {/* actions */}
      <div className="flex flex-row justify-between">
        <Button onClick={() => onDeeper(level + 1)}>deeper</Button>
        <Button onClick={onTurn}>turn</Button>
      </div>
    </div>
  )
}
